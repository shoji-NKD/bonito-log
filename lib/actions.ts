"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { insertRecord, updateRecord, deleteRecord, getRecord } from "./db";
import { KatsuoRecord, KatsuoType } from "@/types";

// ─── 記録を新規作成 ───────────────────────────────────────────
export async function createRecord(formData: FormData) {
  const now = new Date().toISOString();
  const id  = uuidv4();

  const photo_url = await uploadPhoto(formData, null);

  const record: KatsuoRecord = {
    id,
    date:        formData.get("date") as string,
    katsuo_type: (formData.get("katsuo_type") as KatsuoType) ?? "その他",
    dish:        (formData.get("dish") as string).trim(),
    weight_g:    parseWeight(formData.get("weight_g")),
    location:    (formData.get("location") as string).trim(),
    rating:      parseInt(formData.get("rating") as string, 10),
    memo:        ((formData.get("memo") as string) ?? "").trim(),
    photo_url,
    created_at:  now,
    updated_at:  now,
  };

  await insertRecord(record);
  revalidatePath("/");
  redirect(`/${id}`);
}

// ─── 記録を更新 ───────────────────────────────────────────────
export async function editRecord(id: string, formData: FormData) {
  const existing = await getRecord(id);
  if (!existing) throw new Error("Record not found");

  const photo_url = await uploadPhoto(formData, existing.photo_url);

  const record: KatsuoRecord = {
    ...existing,
    date:        formData.get("date") as string,
    katsuo_type: (formData.get("katsuo_type") as KatsuoType) ?? "その他",
    dish:        (formData.get("dish") as string).trim(),
    weight_g:    parseWeight(formData.get("weight_g")),
    location:    (formData.get("location") as string).trim(),
    rating:      parseInt(formData.get("rating") as string, 10),
    memo:        ((formData.get("memo") as string) ?? "").trim(),
    photo_url,
    updated_at:  new Date().toISOString(),
  };

  await updateRecord(record);
  revalidatePath("/");
  revalidatePath(`/${id}`);
  redirect(`/${id}`);
}

// ─── 記録を削除 ───────────────────────────────────────────────
export async function removeRecord(id: string) {
  const record = await getRecord(id);
  if (record?.photo_url) {
    // Vercel Blob から画像も削除
    try { await del(record.photo_url); } catch { /* ignore */ }
  }
  await deleteRecord(id);
  revalidatePath("/");
  redirect("/");
}

// ─── 写真アップロード（Vercel Blob） ──────────────────────────
async function uploadPhoto(
  formData: FormData,
  existingUrl: string | null
): Promise<string | null> {
  const file = formData.get("photo") as File | null;

  // 「写真を削除」フラグが立っている場合
  if (formData.get("remove_photo") === "true") {
    if (existingUrl) {
      try { await del(existingUrl); } catch { /* ignore */ }
    }
    return null;
  }

  // 新しいファイルがアップロードされた場合
  if (file && file.size > 0) {
    const ext  = file.name.split(".").pop() ?? "jpg";
    const name = `katsuo/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const blob = await put(name, file, { access: "public" });
    // 古い画像を削除
    if (existingUrl) {
      try { await del(existingUrl); } catch { /* ignore */ }
    }
    return blob.url;
  }

  return existingUrl;
}

// ─── 重量パース ───────────────────────────────────────────────
function parseWeight(val: FormDataEntryValue | null): number | null {
  if (!val || val === "") return null;
  const n = parseInt(val as string, 10);
  return isNaN(n) ? null : n;
}
