import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel max-w-xl rounded-[2rem] p-8 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">404</div>
        <h1 className="docs-header-title mb-4 text-4xl text-white">Page not found</h1>
        <p className="mb-6 leading-8 text-neutral-400">
          The doc page you asked for does not exist in this Entangle docs build.
        </p>
        <Link
          href="/docs/introduction"
          className="inline-flex rounded-full border border-white bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
        >
          Back to introduction
        </Link>
      </div>
    </main>
  );
}
