"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { KatsuoRecord, KatsuoType } from "@/types";
import SkipjackRating from "./SkipjackRating";

interface RecordFormProps {
  action: (formData: FormData) => Promise<void>;
  initial?: KatsuoRecord;
}

const KATSUO_TYPES: { value: KatsuoType; label: string; activeClass: string }[] = [
  { value: "初カツオ",  label: "🌸 初カツオ",  activeClass: "bg-[#fff0e0] text-[#a04000] !border-[#f0b060]" },
  { value: "戻りカツオ", label: "🍂 戻りカツオ", activeClass: "bg-[#eef3ff] text-[#1a4a7a] !border-[#a8c0e8]" },
  { value: "その他",   label: "その他",       activeClass: "!bg-[--surface-high] !text-[--secondary] !border-[--secondary]" },
];

const DISH_OPTIONS = [
  "カツオのたたき", "カツオの刺身", "カツオのなめろう",
  "カツオ漬け丼", "カツオのユッケ", "カツオの煮付け", "カツオの塩たたき",
];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}
      style={{ opacity: pending ? 0.65 : 1 }}>
      {pending ? "保存中…" : label}
    </button>
  );
}

/* ── Field wrapper ── */
function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="label-logbook" style={{ display: "block", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "var(--primary)", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "rgba(72,95,132,0.5)", marginTop: 4 }}>{hint}</p>}
      {error && (
        <p role="alert" style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Form section card ── */
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-nautical" style={{ marginBottom: 10 }}>
      <p className="sec-label">{title}</p>
      {children}
    </div>
  );
}

export default function RecordForm({ action, initial }: RecordFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const fileRef = useRef<HTMLInputElement>(null);

  const [katsuoType, setKatsuoType] = useState<KatsuoType>(initial?.katsuo_type ?? "その他");
  const [rating,     setRating]     = useState(initial?.rating ?? 0);
  const [preview,    setPreview]    = useState<string | null>(initial?.photo_url ?? null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("ファイルサイズは5MB以下にしてください。"); return; }
    setPreview(URL.createObjectURL(file));
    setRemovePhoto(false);
  };

  const clearPhoto = () => {
    setPreview(null); setRemovePhoto(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (formData: FormData) => {
    const errs: Record<string, string> = {};
    if (!formData.get("date"))     errs.date     = "日付を入力してください";
    if (!formData.get("dish"))     errs.dish     = "料理名を入力してください";
    if (!formData.get("location")) errs.location = "場所を入力してください";
    if (rating === 0)              errs.rating   = "評価を選択してください";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    formData.set("katsuo_type", katsuoType);
    formData.set("rating", String(rating));
    formData.set("remove_photo", removePhoto ? "true" : "false");
    return action(formData);
  };

  return (
    <form action={handleSubmit} noValidate>
      <div>

        {/* ── Photo ── */}
        <FormSection title="Photo">
          {preview ? (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="プレビュー"
                style={{
                  width: "100%", maxHeight: 220, objectFit: "cover",
                  borderRadius: 12, display: "block",
                }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button type="button" className="btn-glass" style={{ fontSize: 13, padding: "7px 14px" }}
                  onClick={() => fileRef.current?.click()}>変更</button>
                <button type="button" className="btn-danger" style={{ fontSize: 13, padding: "7px 14px" }}
                  onClick={clearPhoto}>削除</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%", background: "var(--surface-high)",
                border: "none", borderRadius: 12, padding: "28px 20px",
                textAlign: "center", cursor: "pointer", transition: "background 140ms",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-highest)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--surface-high)")}
              aria-label="写真をアップロード"
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, opacity: 0.35 }}>
                <svg width="40" height="17" viewBox="0 0 52 22" fill="var(--secondary)">
                  <path d="M 2 11 C 5 3 18 1 30 6 C 37 9 41 11 41 11 C 41 11 37 13 30 16 C 18 21 5 19 2 11 Z" />
                  <path d="M 41 6 L 51 2 L 46 11 L 51 20 L 41 16 Z" />
                  <path d="M 16 1 C 19 -3 26 -3 28 1 Z" />
                </svg>
              </div>
              <p style={{ fontSize: 13, color: "var(--on-surface-variant)", fontWeight: 500 }}>タップして写真を選択</p>
              <p style={{ fontSize: 11, color: "rgba(72,95,132,0.45)", marginTop: 3 }}>JPEG · PNG · WEBP（5MB以下）</p>
            </button>
          )}
          <input
            ref={fileRef} name="photo" type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            style={{ display: "none" }} aria-hidden="true" tabIndex={-1}
          />
        </FormSection>

        {/* ── Basic Info ── */}
        <FormSection title="Basic Info">

          {/* カツオ種類 */}
          <Field label="種類" required>
            <div style={{ display: "flex", gap: 8 }}>
              {KATSUO_TYPES.map((t) => {
                const on = katsuoType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setKatsuoType(t.value)}
                    style={{
                      flex: 1, borderRadius: 12, padding: "10px 6px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 12, fontWeight: 700, textAlign: "center",
                      cursor: "pointer", border: "1.5px solid transparent",
                      transition: "all 140ms",
                      background: on ? undefined : "var(--surface-high)",
                      color: on ? undefined : "var(--on-surface-variant)",
                      ...(on && t.value === "初カツオ"  ? { background: "#fff0e0", color: "#a04000", borderColor: "#f0b060" } : {}),
                      ...(on && t.value === "戻りカツオ" ? { background: "#eef3ff", color: "#1a4a7a", borderColor: "#a8c0e8" } : {}),
                      ...(on && t.value === "その他"    ? { background: "var(--surface-high)", color: "var(--secondary)", borderColor: "var(--secondary)" } : {}),
                    }}
                    aria-pressed={on}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Date + Weight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date" required error={errors.date}>
              <input id="f-date" name="date" type="date"
                defaultValue={initial?.date ?? today}
                className="inp-nautical"
                style={{ colorScheme: "light" }}
                required aria-required="true" />
            </Field>
            <Field label="Weight (g)">
              <input id="f-weight" name="weight_g" type="number"
                min="1" defaultValue={initial?.weight_g ?? ""}
                placeholder="例: 300" className="inp-nautical" />
            </Field>
          </div>

          {/* Dish */}
          <Field label="Dish" required error={errors.dish}
            hint="一覧から選ぶか、自由に入力できます">
            <input id="f-dish" name="dish" type="text" list="dish-opts"
              defaultValue={initial?.dish ?? ""}
              placeholder="例: カツオのたたき"
              className="inp-nautical" required aria-required="true" />
            <datalist id="dish-opts">
              {DISH_OPTIONS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </Field>

          {/* Location */}
          <Field label="Location" required error={errors.location} style={{ marginBottom: 0 }}>
            <input id="f-location" name="location" type="text"
              defaultValue={initial?.location ?? ""}
              placeholder="例: 明神丸 高知本店"
              className="inp-nautical" required aria-required="true" />
          </Field>
        </FormSection>

        {/* ── Skipjack Rating ── */}
        <FormSection title="Skipjack Rating">
          <SkipjackRating value={rating} onChange={setRating} size={38} />
          {errors.rating && (
            <p role="alert" style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginTop: 6 }}>
              {errors.rating}
            </p>
          )}
        </FormSection>

        {/* ── Notes ── */}
        <FormSection title="Notes">
          <textarea
            id="f-memo" name="memo"
            defaultValue={initial?.memo ?? ""}
            placeholder="味の感想、産地、一緒に食べた方など"
            className="inp-nautical"
            rows={3}
            style={{ height: "auto" }}
          />
        </FormSection>

        {/* ── Actions ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <SubmitButton label={initial ? "変更を保存" : "記録を保存"} />
        </div>

      </div>
    </form>
  );
}
