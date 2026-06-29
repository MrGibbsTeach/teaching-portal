"use client";

import { useEffect } from "react";

export function FoundationsThemeRoot({
  fontVariable,
  children,
}: {
  fontVariable: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add("theme-foundations");
    return () => {
      document.documentElement.classList.remove("theme-foundations");
    };
  }, []);

  return <div className={`${fontVariable} font-foundations`}>{children}</div>;
}
