"use client";

import { ReactNode, useState } from "react";
import { DocNavbar } from "@/components/docs/doc-navbar";
import { DocSidebar } from "@/components/docs/doc-sidebar";
import { DocToc } from "@/components/docs/doc-toc";

interface DocLayoutProps {
  currentSlug: string;
  tocItems: { id: string; title: string; level: 2 | 3 }[];
  children: ReactNode;
}

export function DocLayout({ currentSlug, tocItems, children }: DocLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DocNavbar onMenuToggle={() => setMobileOpen((value) => !value)} />
      <DocSidebar currentSlug={currentSlug} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="lg:pl-[280px] pt-14 min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
          <div className="flex gap-10">
            <div className="flex-1 min-w-0 max-w-[var(--content-max-width)]">{children}</div>
            <DocToc items={tocItems} />
          </div>
        </div>
        <footer className="border-t border-[var(--border)] mt-8">
          <div className="max-w-5xl mx-auto px-6 lg:px-10 py-6 text-sm text-[var(--muted-foreground)] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>Entangle Docs</span>
            <span>Black-and-white docs build based on the current product content.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
