"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Search } from "lucide-react";
import { docsStructure } from "@/lib/docs-content";

interface SearchResult {
  slug: string;
  title: string;
  section: string;
  snippet: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

function stripHtml(content: string) {
  return content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lower = query.toLowerCase();
    const found: SearchResult[] = [];

    for (const section of docsStructure) {
      for (const page of section.pages) {
        const titleMatch = page.title.toLowerCase().includes(lower);
        const descMatch = page.description.toLowerCase().includes(lower);
        const plainContent = stripHtml(page.content);
        const contentLower = plainContent.toLowerCase();
        const contentMatch = contentLower.includes(lower);

        if (titleMatch || descMatch || contentMatch) {
          let snippet = page.description;
          if (contentMatch && !titleMatch) {
            const idx = contentLower.indexOf(lower);
            const start = Math.max(0, idx - 40);
            const end = Math.min(plainContent.length, idx + query.length + 60);
            snippet =
              (start > 0 ? "..." : "") +
              plainContent.slice(start, end).trim() +
              (end < plainContent.length ? "..." : "");
          }

          found.push({
            slug: page.slug,
            title: page.title,
            section: section.title,
            snippet,
          });
        }
      }
    }

    return found;
  }, [query]);

  const handleNavigate = (slug: string) => {
    router.push(`/docs/${slug}`);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && results[selectedIndex]) {
      handleNavigate(results[selectedIndex].slug);
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-5 h-5 text-[var(--muted-foreground)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            placeholder="Search documentation..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[var(--foreground)] text-base outline-none placeholder:text-[var(--muted-foreground)]"
          />
          <kbd className="text-xs px-1.5 py-0.5 rounded bg-[var(--secondary)] border border-[var(--border)] font-mono text-[var(--muted-foreground)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              No results found for <span className="text-[var(--foreground)] font-medium">{query}</span>
            </div>
          )}

          {results.map((result, index) => (
            <div
              key={result.slug}
              className={`search-result ${index === selectedIndex ? "selected" : ""}`}
              onClick={() => handleNavigate(result.slug)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <FileText className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                <span className="font-medium text-[var(--foreground)]">{result.title}</span>
                <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)] ml-auto shrink-0" />
              </div>
              <div className="text-xs text-[var(--muted-foreground)] ml-[22px]">
                <span className="text-white/70">{result.section}</span>
                {result.snippet ? <span> - {result.snippet}</span> : null}
              </div>
            </div>
          ))}

          {!query && (
            <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              Start typing to search across all documentation pages
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--secondary)] border border-[var(--border)] font-mono">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-[var(--secondary)] border border-[var(--border)] font-mono">↵</kbd> Open
            </span>
            <span className="ml-auto">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
