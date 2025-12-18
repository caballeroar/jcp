import Link from "next/link";

export default function RootPage() {
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>
        If you are not redirected automatically,{" "}
        <Link href="/en/">click here</Link>.
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/en/');`,
        }}
      />
    </div>
  );
}
