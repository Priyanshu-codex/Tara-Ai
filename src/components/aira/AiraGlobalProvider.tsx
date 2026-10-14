"use client";

import React from "react";
import { AiraProvider } from "./AiraContext";
import AiraChatPanel from "./AiraChatPanel";
import AiraLauncher from "./AiraLauncher";

export default function AiraGlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AiraProvider>
      {children}
      <AiraLauncher />
      <AiraChatPanel />
    </AiraProvider>
  );
}
