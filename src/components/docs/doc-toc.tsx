"use client";

import { useEffect, useRef, useState } from "react";

interface DocTocProps {
  items: { id: string; title: string; level: 2 | 3 }[];
}

export function DocToc({ items }: DocTocProps) {
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current?.disconnect();

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const bodyHeight = document.documentElement.scrollHeight;

      if (windowHeight + window.scrollY >= bodyHeight - 20) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          if (top >= 0 && top <= 150) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      },
    );

    headingElements.forEach((el) => observerRef.current?.observe(el));
    window.addEventListener("scroll", handleScroll);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden xl:block w-[220px] shrink-0">
      <div className="sticky top-20">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
          On this page
        </h4>
        <nav className="space-y-1 border-l border-[var(--border)]">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`toc-link ${activeId === item.id ? "active" : ""}`}
              style={{ paddingLeft: `${(item.level - 2) * 12 + 12}px` }}
              onClick={(event) => {
                event.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  setActiveId(item.id);
                }
              }}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
