import { notFound } from "next/navigation";
import { DocLayout } from "@/components/docs/doc-layout";
import { DocBreadcrumb } from "@/components/docs/doc-breadcrumb";
import { DocPagination } from "@/components/docs/doc-pagination";
import {
  extractHeadings,
  getAllPages,
  getPageBySlug,
  getSectionBySlug,
} from "@/lib/docs-content";

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {
      title: "Not Found | Entangle Docs",
    };
  }

  return {
    title: `${page.title} | Entangle Docs`,
    description: page.description,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const section = getSectionBySlug(slug);
  const tocItems = extractHeadings(page.content);

  return (
    <DocLayout currentSlug={slug} tocItems={tocItems}>
      <DocBreadcrumb sectionTitle={section?.title} title={page.title} />
      <article
        className="doc-prose"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      <DocPagination slug={slug} />
    </DocLayout>
  );
}
