import { Suspense } from "react";
import { redirect } from "next/navigation";

async function CategoryRedirect({ params }) {
    const { id } = await params;
    redirect(`/categories/${id}/products`);
}

export default function CategoryPage({ params }) {
    return (
        <Suspense fallback={null}>
            <CategoryRedirect params={params} />
        </Suspense>
    );
}
