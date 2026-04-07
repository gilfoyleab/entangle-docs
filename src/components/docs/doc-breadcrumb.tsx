import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DocBreadcrumbProps {
  sectionTitle?: string;
  title: string;
}

export function DocBreadcrumb({ sectionTitle, title }: DocBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] mb-6">
      <Link href="/docs/overview" className="hover:text-[var(--foreground)] transition-colors">
        Docs
      </Link>
      {sectionTitle && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{sectionTitle}</span>
        </>
      )}
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-[var(--foreground)] font-medium">{title}</span>
    </nav>
  );
}
