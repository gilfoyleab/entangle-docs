"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Menu, Search } from "lucide-react";
import { SearchDialog } from "@/components/docs/search-dialog";
import { useEffect, useState } from "react";

interface DocNavbarProps {
  onMenuToggle: () => void;
}

export function DocNavbar({ onMenuToggle }: DocNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchKey, setSearchKey] = useState(0);

  const openSearch = () => {
    setSearchKey((value) => value + 1);
    setSearchOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[color:rgba(6,6,6,0.92)] backdrop-blur-md border-b border-[var(--border)] flex items-center px-4 lg:px-6">
        <div className="flex-1 flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-md hover:bg-[var(--secondary)] transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>

          <Link href="/docs/introduction" className="flex items-center gap-2.5 group">
            <Image
              src="/entangle-logo.png"
              alt="Entangle logo"
              width={24}
              height={24}
              className="w-6 h-6 brightness-200 grayscale transition-all"
            />
            <span className="text-lg font-semibold text-[var(--foreground)] tracking-tight">Entangle Docs</span>
            <span className="hidden sm:inline text-xs text-[var(--muted-foreground)] font-medium px-1.5 py-0.5 rounded bg-[var(--secondary)]">
              v1.0
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 h-9 rounded-xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(255,255,255,0.04)] hover:bg-[color:rgba(255,255,255,0.07)] transition-all text-sm text-[var(--muted-foreground)] w-full max-w-[440px] shadow-sm"
          >
            <Search className="w-4 h-4 shrink-0 opacity-60" />
            <span className="flex-1 text-left">Search ...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[color:rgba(255,255,255,0.03)] border border-[var(--border)] font-mono text-[var(--muted-foreground)]">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="lg:hidden p-2 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/entangle-whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-white text-black hover:bg-neutral-200 transition-colors"
              style={{ color: "#000000" }}
            >
              <span style={{ color: "#000000" }}>White Paper</span>
            </Link>

            <a
              href="https://github.com/entanglefi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="GitHub"
            >
              <Github className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </header>

      <SearchDialog key={searchKey} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
