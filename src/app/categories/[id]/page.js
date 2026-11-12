import { redirect } from "next/navigation";

export default async function CategoryPage({ params }) {
    const { id } = await params;
    redirect(`/categories/${id}/products`);
}
