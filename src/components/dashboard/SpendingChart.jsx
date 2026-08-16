import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { useT } from "../../i18n/LanguageProvider.jsx";
import { formatIDR } from "../../utils/financeFormulas.js";

echarts.use([PieChart, TooltipComponent, CanvasRenderer]);

function chartColors() {
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) =>
    (cs.getPropertyValue(name) || fallback).trim();
  return {
    Needs: get("--chart-accent", "#0f6fff"),
    Lifestyle: get("--chart-warning", "#d9971b"),
    Investment: get("--chart-success", "#2e9e5b"),
  };
}

export function SpendingChart({ data = [], loading = false }) {
  const containerRef = useRef(null);
  const t = useT();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (loading || !total || !containerRef.current) return;
    const colors = chartColors();
    const chart = echarts.init(containerRef.current);
    chart.setOption({
      tooltip: {
        trigger: "item",
        formatter: (p) =>
          `${p.name}<br/><strong>${formatIDR(p.value)}</strong>`,
      },
      series: [
        {
          type: "pie",
          radius: ["62%", "90%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          itemStyle: { borderWidth: 0 },
          label: { show: false },
          emphasis: { scaleSize: 4 },
          data: data.map((d) => ({
            name: d.name,
            value: d.value,
            itemStyle: { color: colors[d.name] },
          })),
        },
      ],
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }, [loading, total, data]);

  if (loading) {
    return (
      <Card className="p-5">
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <Skeleton className="h-48 w-48 shrink-0 rounded-full" />
          <div className="w-full space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-ink">{t("chart.title")}</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-ink-3">{t("chart.empty")}</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <div ref={containerRef} className="h-48 w-48 shrink-0" />
          <ul className="w-full space-y-2">
            {data.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-ink-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: chartColors()[d.name] }}
                  />
                  {d.name}
                </span>
                <span className="amount font-medium text-ink">
                  {formatIDR(d.value)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
