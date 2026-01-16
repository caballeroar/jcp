"use client";

import Switch from "./Switch";
import { useI18n } from "../../../lib/I18nContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const isEnglish = locale === "en";

  return (
    <Switch
      checked={isEnglish}
      onToggle={() => setLocale(isEnglish ? "nl" : "en")}
    />
  );
}
