import { useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { Button } from "../ui/Button.jsx";
import { useI18n } from "../../i18n/LanguageProvider.jsx";
import { updatePublicationPreference } from "../../api/registry.js";
import { useAuthStore } from "../../store/authStore.js";

export function PublicationConsent({ open, maskedName, onClose, onSaved }) {
  const { t } = useI18n();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!accessToken) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      if (agreed) {
        await updatePublicationPreference(accessToken, true, "2026-09-06");
      }
      onSaved?.(agreed);
    } catch {
      // silent fallback
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("consent.title")}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            {t("consent.notNow")}
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {t("consent.save")}
          </Button>
        </>
      }>
      <div className="space-y-4 text-sm text-ink-2">
        <p>{t("consent.desc")}</p>
        <div className="rounded-card border border-rule bg-paper-2 p-3 font-mono text-xs text-ink">
          {t("consent.preview", { name: maskedName || "Anonymous" })}
        </div>
        <label className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-rule-2 accent-accent"
          />
          <span className="text-xs text-ink leading-relaxed">
            {t("consent.agree")}
          </span>
        </label>
      </div>
    </Modal>
  );
}
