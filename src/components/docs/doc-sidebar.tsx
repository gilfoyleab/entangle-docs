"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { docsStructure } from "@/lib/docs-content";

interface DocSidebarProps {
  currentSlug: string;
  mobileOpen: boolean;
  onClose: () => void;
}

export function DocSidebar({ currentSlug, mobileOpen, onClose }: DocSidebarProps) {
  return (
    <>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

      <aside
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-[280px] bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="lg:hidden flex items-center justify-end px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)]"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pt-6 pb-12 px-4 space-y-8 scrollbar-none">
          {docsStructure.map((section) => (
            <div key={section.title} className="sidebar-section-container">
              <h4 className="sidebar-section-title">{section.title}</h4>
              <div className="sidebar-links-container">
                {section.pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/docs/${page.slug}`}
                    className={`sidebar-link ${currentSlug === page.slug ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <span className="truncate">{page.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)]">
            Powered by <span className="font-medium text-[var(--foreground)]">Entangle Docs</span>
          </div>
        </div>
      </aside>
    </>
  );
}
