export default function RootPage() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.location.href = '/en/'`,
      }}
    />
  );
}
