import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore.js";
import {
  urlBase64ToUint8Array,
  getVapidPublicKey,
  subscribeDevice,
  unsubscribeDevice,
} from "../api/notifications.js";

export function usePushNotifications() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  const [permission, setPermission] = useState(
    isSupported ? Notification.permission : "denied",
  );
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupported) return;
    setPermission(Notification.permission);

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        setSubscribed(Boolean(sub));
      })
      .catch(() => {});
  }, [isSupported]);

  const subscribe = useCallback(
    async ({ timezone = "Asia/Jakarta", cutoffDay = 25, lang = "id" } = {}) => {
      if (!isSupported) throw new Error("Push notifications not supported");
      if (!accessToken) throw new Error("Not authenticated");

      setLoading(true);
      try {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm !== "granted") {
          throw new Error("Notification permission denied");
        }

        const vapidKey = await getVapidPublicKey();
        if (!vapidKey) throw new Error("VAPID key not configured on server");

        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();

        if (!sub) {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
          });
        }

        await subscribeDevice(accessToken, {
          subscription: sub.toJSON(),
          timezone,
          cutoffDay,
          lang,
          consentVersion: "2026-09-06",
        });

        setSubscribed(true);
        return true;
      } finally {
        setLoading(false);
      }
    },
    [isSupported, accessToken],
  );

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        if (accessToken) {
          await unsubscribeDevice(accessToken, endpoint).catch(() => {});
        }
      }
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  }, [isSupported, accessToken]);

  return {
    isSupported,
    permission,
    subscribed,
    loading,
    subscribe,
    unsubscribe,
  };
}
