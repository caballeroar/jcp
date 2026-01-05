"use client";

import { createContext, useContext } from "react";

const I18nContext = createContext({ locale: "en", dict: null });

export function I18nProvider({ value, children }) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
