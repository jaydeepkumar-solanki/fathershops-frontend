
import Link from "next/link";
import { Suspense } from "react";
import { apiRequest } from "@/lib/api";

// Fetch product details from Laravel API
async function ProductDetails({ productId }) {
    let product = null;
    let error = null;

    try {
        product = await apiRequest(`/products/${productId}`);
    } catch (err) {
        error = err instanceof Error ? err.message : "Something went wrong";
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-5 text-red-600">
                Failed to load product: {error}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="rounded-lg bg-white p-10 text-center">
                Product not found.
            </div>
        );
    }

    const englishDetails = product.descriptions?.["1"] || {};
    const productName =
        englishDetails.name || product.model || "Product Details";

    const price = product.calculated_price ?? product.base_price;

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
                {productName}
            </h1>

            <p className="mt-3 text-xl font-bold text-blue-600">
                {price != null
                    ? `${price} ${product.currency || ""}`
                    : "Price unavailable"}
            </p>

            <p className="mt-2 text-sm text-gray-500">
                Model: {product.model || "N/A"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
                SKU: {product.sku || "N/A"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
                Available quantity: {product.quantity ?? "N/A"}
            </p>

            <p className="mt-3 text-sm text-gray-600">
                Rating: ★ {product.rating ?? 0} ({product.reviews ?? 0} reviews)
            </p>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">
                    Product Images
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {(product.images?.length
                        ? product.images
                        : product.image
                            ? [{ image: product.image }]
                            : []
                    ).map((item, index) => (
                        <img
                            key={index}
                            src={item.image}
                            alt={`${productName} ${index + 1}`}
                            className="h-48 w-full rounded-lg bg-gray-100 object-contain"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">
                    Description
                </h2>

                <p className="mt-3 text-gray-600">
                    {englishDetails.description
                        ? englishDetails.description
                            .replace(/<[^>]*>/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                        : "No description available."}
                </p>
            </div>
        </div>
    );
}

// Resolve dynamic params and fetch product
async function ProductPageContent({ params }) {
    const { id } = await params;

    return <ProductDetails productId={id} />;
}

// Product Details Page
export default function ProductDetailsPage({ params }) {
    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        FatherShops
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Categories
                    </Link>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-6 py-12">
                <Suspense
                    fallback={
                        <div className="animate-pulse rounded-xl bg-white p-10">
                            Loading product details...
                        </div>
                    }
                >
                    <ProductPageContent params={params} />
                </Suspense>
            </section>
        </main>
    );
}
