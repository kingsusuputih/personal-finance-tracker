import { useState, useEffect } from "react";
import { useSpreadsheet } from "../hooks/useSpreadsheet.js";
import { useT } from "../i18n/LanguageProvider.jsx";
import { useToast } from "../components/ui/Toast.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { Navbar } from "../components/layout/Navbar.jsx";
import { BottomNav } from "../components/layout/BottomNav.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import {
  detectBrowserTimezone,
  getSupportedTimezones,
  getEffectiveCutoff,
} from "../utils/dateTime.js";

export default function SettingsPage() {
  const { ensureSpreadsheet, loadData, provisioning, loading, settings, saveSettings } =
    useSpreadsheet();
  const t = useT();
  const toast = useToast();

  const detectedZone = detectBrowserTimezone();
  const allZones = getSupportedTimezones();

  const [mode, setMode] = useState(settings?.timezone_mode || "auto");
  const [selectedZone, setSelectedZone] = useState(settings?.timezone || detectedZone);
  const [cutoff, setCutoff] = useState(String(getEffectiveCutoff(settings)));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ensureSpreadsheet().then((id) => {
      if (id) loadData();
    });
  }, [ensureSpreadsheet, loadData]);

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

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:pl-64">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 md:px-8 md:py-10">
            <header className="mb-8">
              <p className="kbd mb-1 text-[11px] text-ink-3">
                {t("app.name")}
              </p>
              <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold">
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
                <Card className="p-5">
                  <h2 className="text-base font-semibold text-ink">
                    {t("settings.timezoneTitle")}
                  </h2>
                  <p className="mt-1 text-xs text-ink-3">
                    {t("settings.timezoneDesc")}
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="tz_mode"
                        value="auto"
                        checked={mode === "auto"}
                        onChange={() => setMode("auto")}
                        className="accent-accent"
                      />
                      <span className="text-sm text-ink">
                        {t("settings.modeAuto", { zone: detectedZone })}
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="tz_mode"
                        value="manual"
                        checked={mode === "manual"}
                        onChange={() => setMode("manual")}
                        className="accent-accent"
                      />
                      <span className="text-sm text-ink">
                        {t("settings.modeManual")}
                      </span>
                    </label>

                    {mode === "manual" && (
                      <div className="pt-2">
                        <select
                          value={selectedZone}
                          onChange={(e) => setSelectedZone(e.target.value)}
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
                </Card>

                <Card className="p-5">
                  <h2 className="text-base font-semibold text-ink">
                    {t("settings.cutoffTitle")}
                  </h2>
                  <p className="mt-1 text-xs text-ink-3">
                    {t("settings.cutoffDesc")}
                  </p>

                  <div className="mt-4">
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
                </Card>

                <Button type="submit" loading={saving} className="w-full">
                  {t("settings.save")}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
