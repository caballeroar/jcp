import { I18nProvider } from "../../lib/I18nContext";
import { getDictionary } from "../../lib/i18n";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params; // unwrap params
  const dict = await getDictionary(locale).catch(() => ({}));

  return <I18nProvider value={{ locale, dict }}>{children}</I18nProvider>;
}
