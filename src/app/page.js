export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/en/" />
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Redirecting to English version...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (typeof window !== 'undefined') { window.location.replace('/en/'); }`,
          }}
        />
      </body>
    </html>
  );
}
