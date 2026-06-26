'use server';

import { revalidateTag } from 'next/cache';

/**
 * Invalidates cached app settings after admin updates tracking, payment, or prompt settings.
 */
export async function revalidateSettings(): Promise<void> {
    revalidateTag('settings', 'max');
}
