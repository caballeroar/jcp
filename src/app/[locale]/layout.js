export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return <>{children}</>;
}
