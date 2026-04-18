"use client";

import { useState } from "react";
import { removeRecord } from "@/lib/actions";

export default function DeleteButton({ id, dish }: { id: string; dish: string }) {
  const [open,    setOpen]    = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    await removeRecord(id);
  };

  return (
    <>
      <button type="button" className="btn-danger" style={{ flex: 1 }}
        onClick={() => setOpen(true)}>
        削除
      </button>

      {open && (
        /* Bottom-sheet modal */
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,30,46,0.45)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-modal-title"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            style={{
              background: "var(--surface-lowest)",
              borderRadius: "24px 24px 0 0",
              padding: "28px 20px 48px",
              width: "100%", maxWidth: 720,
              boxShadow: "0 -4px 40px rgba(72,95,132,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="del-modal-title"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em",
                color: "var(--on-surface)", marginBottom: 8,
              }}
            >
              このログを削除しますか？
            </h2>
            <p style={{ fontSize: 14, color: "var(--on-surface-variant)", marginBottom: 24, lineHeight: 1.6 }}>
              「{dish}」の記録を削除します。この操作は取り消せません。
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="btn-danger"
                style={{ flex: 1, padding: 14, opacity: pending ? 0.7 : 1 }}
              >
                {pending ? "削除中…" : "削除する"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-glass"
                style={{ flex: 1, padding: 14 }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
