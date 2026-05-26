import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
};

// Admin article slug route — redirect to public article for preview
export default async function AdminArticlePreviewPage({ params }: Props) {
    const { slug } = await params;
    redirect(`/articles/${slug}`);
}
