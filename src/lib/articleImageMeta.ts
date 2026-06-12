import type { Article, ArticleImageMeta } from '@/data/articles';
import { siteUrl } from '@/lib/seo';

const IMAGE_EXTENSION_PATTERN = /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;
const IMAGE_TAG_PATTERN = /<img\b([^>]*)>/gi;

function decodeHtmlEntities(value: string) {
    return value
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function cleanText(value?: string | null) {
    if (!value) return '';

    return decodeHtmlEntities(value)
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getImageAttribute(attrs: string, name: string) {
    const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
    const match = attrs.match(pattern);
    return cleanText(match?.[1] || match?.[2] || match?.[3] || '');
}

function isSupportedImageUrl(url: string) {
    try {
        const parsed = new URL(url);
        return IMAGE_EXTENSION_PATTERN.test(parsed.pathname);
    } catch {
        return IMAGE_EXTENSION_PATTERN.test(url);
    }
}

export function absoluteSiteUrl(pathOrUrl: string, baseUrl: string = siteUrl) {
    const trimmed = pathOrUrl.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${baseUrl.replace(/\/$/, '')}${encodeURI(cleanPath)}`;
}

export function extractInlineArticleImages(article: Article): ArticleImageMeta[] {
    const images: ArticleImageMeta[] = [];

    for (const match of article.content.matchAll(IMAGE_TAG_PATTERN)) {
        const attrs = match[1] || '';
        const src = getImageAttribute(attrs, 'src');
        if (!src) continue;

        const alt = getImageAttribute(attrs, 'alt') || article.coverImageAlt || `ภาพประกอบบทความ ${article.title}`;
        const title = getImageAttribute(attrs, 'title') || alt;

        images.push({
            src,
            alt,
            title,
            caption: title,
        });
    }

    return images;
}

export function getArticleImages(article: Article, baseUrl: string = siteUrl): ArticleImageMeta[] {
    const coverImage: ArticleImageMeta[] = article.coverImage
        ? [{
            src: article.coverImage,
            alt: article.coverImageAlt || `ภาพหน้าปกบทความ ${article.title}`,
            title: article.title,
            caption: article.excerpt,
        }]
        : [];

    const allImages = [
        ...coverImage,
        ...(article.images || []),
        ...extractInlineArticleImages(article),
    ];

    const seen = new Set<string>();
    const normalized: ArticleImageMeta[] = [];

    for (const image of allImages) {
        const absoluteUrl = absoluteSiteUrl(image.src, baseUrl);
        if (!absoluteUrl || !isSupportedImageUrl(absoluteUrl) || seen.has(absoluteUrl)) continue;

        seen.add(absoluteUrl);
        normalized.push({
            ...image,
            src: absoluteUrl,
            alt: cleanText(image.alt) || `ภาพประกอบบทความ ${article.title}`,
            title: cleanText(image.title) || cleanText(image.alt) || article.title,
            caption: cleanText(image.caption) || cleanText(image.alt) || article.excerpt,
            credit: cleanText(image.credit),
        });
    }

    return normalized;
}

export function toArticleImageObject(image: ArticleImageMeta, representativeOfPage = false) {
    const imageObject: Record<string, unknown> = {
        '@type': 'ImageObject',
        url: image.src,
        contentUrl: image.src,
        name: image.title || image.alt,
        caption: image.caption || image.alt,
        description: image.alt,
    };

    if (image.credit) {
        imageObject.creditText = image.credit;
    }

    if (representativeOfPage) {
        imageObject.representativeOfPage = true;
    }

    return imageObject;
}
