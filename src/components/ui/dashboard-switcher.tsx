"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Item = {
  key: string;
  label: string;
  src: string;           // image url or /public path
  title?: string;
  description?: string;
};

type Props = {
  items: Item[];
  className?: string;
};

export default function DashboardSwitcher({ items, className }: Props) {
  const [active, setActive] = useState(items[0]?.key);
  const current = items.find(i => i.key === active) ?? items[0];

  return (
    <div className={cn("relative w-full", className)}>
      {/* Container card */}
      <div className="relative rounded-3xl border border-[#111621]/5 bg-white/60 shadow-[0_10px_30px_rgba(17,22,33,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        {/* Segmented control */}
        <div className="flex w-full justify-center px-4 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#111621]/10 bg-white/70 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
            {items.map((it) => {
              const selected = it.key === active;
              return (
                <button
                  key={it.key}
                  onClick={() => setActive(it.key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition",
                    "hover:bg-[#111621]/5 dark:hover:bg-white/10",
                    selected && "bg-[#111621] text-white dark:bg-white dark:text-[#111621]"
                  )}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview frame */}
        <div className="relative mx-auto mt-4 w-full max-w-5xl px-4 pb-10">
          {/* Aspect-ratio frame like a dashboard */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-[#111621]/5 bg-white/80 shadow-md ring-1 ring-[#111621]/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
            <div className="relative aspect-[16/9]">
              <Image
                src={current.src}
                alt={current.title ?? current.label}
                fill
                className="object-cover"
                priority
              />
              {/* Soft inner vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(17,22,33,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.08)_100%)]" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}