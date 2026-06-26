'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Invalidates the articles cache. Call after admin creates/updates/deletes articles.
 */
export async function revalidateArticles(slug?: string): Promise<void> {
    revalidateTag('articles', 'max');
    revalidatePath('/articles');

    if (slug) {
        revalidatePath(`/articles/${slug}`);
    }
}
