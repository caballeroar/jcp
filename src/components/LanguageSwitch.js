"use client";

import { useRouter } from "next/navigation";
import { Switch } from "./ui";

export default function LanguageSwitch({ currentLocale }) {
  const router = useRouter();

  const handleLanguageChange = (checked) => {
    const newLocale = checked ? "nl" : "en";
    router.push(`/${newLocale}`);
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50 ">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${
            currentLocale === "en" ? "text-primary-950" : "text-gray-500"
          }`}
        >
          EN
        </span>
        <Switch
          checked={currentLocale === "nl"}
          onChange={handleLanguageChange}
          activeColor={currentLocale === "nl" ? "brand" : "primary"}
        />
        <span
          className={`text-sm font-medium transition-colors ${
            currentLocale === "nl" ? "text-brand-600" : "text-gray-500"
          }`}
        >
          NL
        </span>
      </div>
    </div>
  );
}
