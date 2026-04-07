import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAdjacentPages } from "@/lib/docs-content";

interface DocPaginationProps {
  slug: string;
}

export function DocPagination({ slug }: DocPaginationProps) {
  const { prev, next } = getAdjacentPages(slug);

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--border)]">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <div>
            <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Previous</div>
            <div className="font-medium text-[var(--foreground)]">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors text-right"
        >
          <div>
            <div className="text-xs text-[var(--muted-foreground)] mb-0.5">Next</div>
            <div className="font-medium text-[var(--foreground)]">{next.title}</div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
