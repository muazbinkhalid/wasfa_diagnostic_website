"use client";

import { useEffect } from "react";
import { registerGsapPlugins } from "@/lib/gsap";

export function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsapPlugins();
  }, []);

  return <>{children}</>;
}
