import { createServerFn } from '@tanstack/react-start';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import browserCollections from 'collections/browser';
import type { Root } from 'fumadocs-core/page-tree';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { ClientAPIPage } from '@/components/api-page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { useSidebar } from 'fumadocs-ui/layouts/docs/slots/sidebar';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page';
import { useMDXComponents } from '@/components/mdx';
import { ViewOptionsPopover } from '@/components/page-actions';
import { type DocsManifest, getManifestKey, type LoaderData } from '@/lib/docs-manifest';
import { baseOptions } from '@/lib/layout.shared';
import { preparePageTree } from '@/lib/page-tree';
import { absoluteUrl, getDocGithubPath, getDocOgPath, site } from '@/lib/site';
import { getPageMarkdownUrl, source } from '@/lib/source';

type RuntimeLoaderData = LoaderData extends infer T
  ? T extends unknown
    ? Omit<T, 'pageTree'> & { pageTree: Root }
    : never
  : never;

function toPublicDocUrl(url: string): string {
  if (url === '/') return site.docsBasePath;
  return `${site.docsBasePath}${url}`;
}

const folderIndexRedirects = new Map([
  ['applications/build-packs/overview', '/applications/build-packs'],
  ['applications/ci-cd/introduction', '/applications/ci-cd'],
  ['integrations/cloudflare/tunnels/overview', '/integrations/cloudflare/tunnels'],
  ['knowledge-base/overview', '/knowledge-base'],
  ['knowledge-base/proxy/traefik/overview', '/knowledge-base/proxy/traefik'],
  ['knowledge-base/proxy/caddy/overview', '/knowledge-base/proxy/caddy'],
  ['troubleshoot/overview', '/troubleshoot'],
]);

export const Route = createFileRoute('/$')({
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/').filter(Boolean) ?? [];
    const redirectPath = folderIndexRedirects.get(slugs.join('/'));

    if (redirectPath) {
      throw redirect({ href: toPublicDocUrl(redirectPath), statusCode: 308 });
    }

    const data = await loadPageData(slugs);
    if (data.type === 'docs') {
      await clientLoader.preload(data.path);
    }

    return data;
  },
  head: ({ loaderData }) => {
    const data = loaderData as LoaderData | undefined;
    if (!data) {
      return {};
    }

    const title = data.isIndex ? site.title : `${data.title} | ${site.title}`;
    const description = data.description || site.description;
    const canonicalUrl = absoluteUrl(data.url.endsWith('/') ? data.url : `${data.url}`);
    const ogImageUrl = data.ogImagePath;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': data.isIndex ? 'WebPage' : 'TechArticle',
      headline: data.title,
      description,
      url: canonicalUrl,
      image: absoluteUrl(data.ogImagePath),
      inLanguage: site.locale,
      publisher: {
        '@type': 'Organization',
        name: site.name,
      },
    };

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: String(site.og.width) },
        { property: 'og:image:height', content: String(site.og.height) },
        { property: 'og:type', content: data.isIndex ? 'website' : 'article' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl },
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }): Promise<LoaderData> => {
    const page = source.getPage(slugs);
    if (!page) throw notFound();
    const pageTree = await source.serializePageTree(preparePageTree(source.getPageTree()));

    if (page.data.type === 'openapi') {
      return {
        type: 'openapi',
        description: page.data.description ?? site.description,
        isIndex: page.slugs.length === 0,
        ogImagePath: getDocOgPath(page.slugs),
        pageTree,
        props: await page.data.getClientAPIPageProps(),
        title: page.data.title ?? 'API Reference',
        url: toPublicDocUrl(page.url),
      } satisfies LoaderData;
    }

    return {
      type: 'docs',
      description: page.data.description ?? site.description,
      isIndex: page.slugs.length === 0,
      markdownUrl: getPageMarkdownUrl(page).url,
      ogImagePath: getDocOgPath(page.slugs),
      pageTree,
      path: page.path,
      title: page.data.title,
      url: toPublicDocUrl(page.url),
    } satisfies LoaderData;
  });

let docsManifestPromise: Promise<DocsManifest> | undefined;

async function loadDocsManifest() {
  docsManifestPromise ??= fetch(`${site.docsBasePath}/docs-manifest.json`, {
    method: 'GET',
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Failed to load docs manifest: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as DocsManifest;
  });

  return docsManifestPromise;
}

async function loadPageData(slugs: string[]): Promise<LoaderData> {
  if (import.meta.env.PROD && typeof document !== 'undefined') {
    const manifest = await loadDocsManifest();
    const page = manifest.pages[getManifestKey(slugs)];

    if (!page) throw notFound();

    return {
      ...page,
      pageTree: manifest.pageTree,
    } as LoaderData;
  }

  return serverLoader({ data: slugs });
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: MDX },
    { markdownUrl, path }: { markdownUrl: string; path: string },
  ) {
    if (frontmatter.full) {
      return (
        <DocsPage full toc={toc} tableOfContent={{ enabled: false }} breadcrumb={{ enabled: false }}>
          <MDX components={useMDXComponents()} />
        </DocsPage>
      );
    }

    return (
      <DocsPage toc={toc}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="flex flex-row items-center gap-2 border-b -mt-4 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={getDocGithubPath(path)} />
        </div>
        <DocsBody>
          <MDX components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData()) as unknown as RuntimeLoaderData;
  let content: ReactNode;

  if (data.type === 'openapi') {
    content = (
      <DocsPage full tableOfContent={{ enabled: false }}>
        <DocsTitle>{data.title}</DocsTitle>
        <DocsDescription>{data.description}</DocsDescription>
        <DocsBody>
          <ClientAPIPage {...data.props} />
        </DocsBody>
      </DocsPage>
    );
  } else {
    content = clientLoader.useContent(data.path, { markdownUrl: data.markdownUrl, path: data.path });
  }

  const indexLayoutProps = data.isIndex
    ? {
        sidebar: {
          enabled: false,
        },
        containerProps: {
          style: {
            '--fd-sidebar-col': '0px',
          } as CSSProperties,
        },
      }
    : {};

  return (
    <DocsLayout {...baseOptions()} tree={data.pageTree} {...indexLayoutProps}>
      <IndexSidebarState isIndex={data.isIndex} />
      <Suspense>{content}</Suspense>
    </DocsLayout>
  );
}

function IndexSidebarState({ isIndex }: { isIndex: boolean }) {
  const { setCollapsed } = useSidebar();

  useLayoutEffect(() => {
    setCollapsed(isIndex);
  }, [isIndex, setCollapsed]);

  return null;
}
