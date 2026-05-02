"use client";

import { MotionProvider } from "@/lib/motion";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
