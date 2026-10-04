import { useState, useEffect } from "react";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { usePushNotifications } from "../hooks/usePushNotifications.js";
import { useT, useI18n } from "../i18n/LanguageProvider.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { useAuthStore } from "../store/authStore.js";
import {
  updatePublicationPreference,
  deleteRegistryUser,
  registerUser,
} from "../api/registry.js";
import {
  detectBrowserTimezone,
  getSupportedTimezones,
  getEffectiveCutoff,
} from "../utils/dateTime.js";

export default function SettingsPage() {
  const { ensureSpreadsheet, loadData, provisioning, loading, settings, saveSettings } =
    useSpreadsheet();
  const accessToken = useAuthStore((s) => s.accessToken);
  const t = useT();
  const { lang } = useI18n();
  const toast = useToast();
  const {
    isSupported: isPushSupported,
    subscribed: isPushSubscribed,
    loading: pushLoading,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush,
  } = usePushNotifications();

  const detectedZone = detectBrowserTimezone();
  const allZones = getSupportedTimezones();

  const [mode, setMode] = useState(settings?.timezone_mode || "auto");
  const [selectedZone, setSelectedZone] = useState(settings?.timezone || detectedZone);
  const [cutoff, setCutoff] = useState(String(getEffectiveCutoff(settings)));
  const [saving, setSaving] = useState(false);

  const [publishName, setPublishName] = useState(false);
  const [maskedName, setMaskedName] = useState("");
  const [savingCommunity, setSavingCommunity] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRegistry, setDeletingRegistry] = useState(false);

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData();
    });
  }, [ensureSpreadsheet, loadData]);

  useEffect(() => {
    if (accessToken) {
      registerUser(accessToken).then((res) => {
        if (res) {
          setPublishName(Boolean(res.publishName));
          if (res.maskedName) setMaskedName(res.maskedName);
        }
      });
    }
  }, [accessToken]);

  useEffect(() => {
    if (settings) {
      setMode(settings.timezone_mode === "manual" ? "manual" : "auto");
      setSelectedZone(settings.timezone || detectedZone);
      setCutoff(String(getEffectiveCutoff(settings)));
    }
  }, [settings, detectedZone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cutoffNum = Number(cutoff);
    if (!Number.isInteger(cutoffNum) || cutoffNum < 1 || cutoffNum > 28) {
      toast.error(t("settings.errCutoff"));
      return;
    }
    setSaving(true);
    try {
      await saveSettings({
        timezone_mode: mode,
        timezone: mode === "manual" ? selectedZone : detectedZone,
        cutoff_day: cutoffNum,
      });
      toast.success(t("toast.saved"));
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCommunity = async (nextVal) => {
    if (!accessToken) return;
    setSavingCommunity(true);
    try {
      const res = await updatePublicationPreference(accessToken, nextVal, "2026-09-06");
      setPublishName(Boolean(res.publishName));
      toast.success(t("toast.saved"));
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setSavingCommunity(false);
    }
  };

  const handleDeleteRegistry = async () => {
    if (!accessToken) return;
    setDeletingRegistry(true);
    try {
      await deleteRegistryUser(accessToken);
      setPublishName(false);
      setDeleteModalOpen(false);
      toast.success(t("settings.deleteRegistrySuccess"));
    } catch (err) {
      toast.error(err.message || t("toast.error"));
    } finally {
      setDeletingRegistry(false);
    }
  };

  const handleTogglePush = async () => {
    if (isPushSubscribed) {
      await unsubscribePush();
      toast.success(t("settings.notifyDisabledSuccess"));
    } else {
      try {
        await subscribePush({
          timezone: mode === "manual" ? selectedZone : detectedZone,
          cutoffDay: Number(cutoff) || 25,
          lang,
        });
        toast.success(t("settings.notifySuccess"));
      } catch (err) {
        toast.error(err.message || t("settings.notifyDenied"));
      }
    }
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:pt-10 md:pb-32 lg:pb-12">
            <header className="mb-8">
              <p className="kbd mb-1 text-[11px] text-ink-3">
                {t("app.name")}
              </p>
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl lg:text-[clamp(1.75rem,4vw,2.5rem)]">
                {t("settings.title")}
              </h1>
              <p className="mt-2 text-sm text-ink-3">
                {t("settings.subtitle")}
              </p>
            </header>

            {provisioning || loading ? (
              <div className="max-w-xl space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
                <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden divide-y divide-rule">
                  {/* Timezone Section */}
                  <div className="p-5 sm:p-6">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("settings.timezoneTitle")}
                    </h2>
                    <p className="mt-1 text-xs text-ink-3">
                      {t("settings.timezoneDesc")}
                    </p>

                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="tz_mode"
                          value="auto"
                          checked={mode === "auto"}
                          onChange={() => setMode("auto")}
                          className="accent-accent"
                        />
                        <span className="text-sm text-ink font-medium">
                          {t("settings.modeAuto", { zone: detectedZone })}
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="tz_mode"
                          value="manual"
                          checked={mode === "manual"}
                          onChange={() => setMode("manual")}
                          className="accent-accent"
                        />
                        <span className="text-sm text-ink font-medium">
                          {t("settings.modeManual")}
                        </span>
                      </label>

                      {mode === "manual" && (
                        <div className="pt-2">
                          <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            aria-label={t("settings.timezoneTitle")}
                            className="field">
                            {allZones.map((z) => (
                              <option key={z} value={z}>
                                {z}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cutoff Day Section */}
                  <div className="p-5 sm:p-6">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("settings.cutoffTitle")}
                    </h2>
                    <p className="mt-1 text-xs text-ink-3">
                      {t("settings.cutoffDesc")}
                    </p>

                    <div className="mt-4 max-w-xs">
                      <label className="block">
                        <span className="kbd mb-1.5 block text-[10px] text-ink-3">
                          {t("settings.cutoffLabel")}
                        </span>
                        <select
                          value={cutoff}
                          onChange={(e) => setCutoff(e.target.value)}
                          className="field">
                          {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                              {day === 25 ? `${day} (${t("settings.defaultTag")})` : day}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Save Action Bar */}
                  <div className="p-4 sm:p-5 bg-paper-2/40 flex justify-end">
                    <Button type="submit" loading={saving} className="w-full sm:w-auto px-6">
                      {t("settings.save")}
                    </Button>
                  </div>
                </div>

                {/* Secondary Preferences - Connected Panel */}
                <div className="rounded-card border border-rule bg-paper shadow-sm overflow-hidden divide-y divide-rule">
                  {/* Community & Social Proof */}
                  <div className="p-5 sm:p-6">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("settings.communityTitle")}
                    </h2>
                    <p className="mt-1 text-xs text-ink-3">
                      {t("settings.communityDesc")}
                    </p>

                    <div className="mt-4 space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={publishName}
                          disabled={savingCommunity}
                          onChange={(e) => handleToggleCommunity(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-rule-2 accent-accent"
                        />
                        <div className="text-sm">
                          <span className="text-ink font-medium">
                            {t("settings.showName", { name: maskedName || "H*** A***" })}
                          </span>
                        </div>
                      </label>

                      <div className="border-t border-rule pt-4">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteModalOpen(true)}>
                          {t("settings.deleteRegistry")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="p-5 sm:p-6">
                    <h2 className="text-base font-bold text-ink tracking-tight">
                      {t("settings.notifyTitle")}
                    </h2>
                    <p className="mt-1 text-xs text-ink-3">
                      {t("settings.notifyDesc")}
                    </p>

                    <div className="mt-4">
                      {!isPushSupported ? (
                        <p className="text-xs text-ink-3">
                          {t("settings.notifyUnsupported")}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                isPushSubscribed ? "bg-success" : "bg-ink-3"
                              }`}
                            />
                            <span className="text-sm font-medium text-ink">
                              {isPushSubscribed
                                ? t("settings.notifyEnabled")
                                : t("settings.notifyDisabled")}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant={isPushSubscribed ? "secondary" : "primary"}
                            size="sm"
                            loading={pushLoading}
                            onClick={handleTogglePush}>
                            {isPushSubscribed
                              ? t("settings.notifyDisable")
                              : t("settings.notifyEnable")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
      <BottomNav />

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("settings.deleteRegistry")}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deletingRegistry}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRegistry}
              loading={deletingRegistry}>
              {t("settings.deleteRegistryConfirm")}
            </Button>
          </>
        }>
        <p className="text-sm leading-relaxed text-ink-2">
          {t("settings.deleteRegistryDesc")}
        </p>
      </Modal>
    </div>
  );
}
