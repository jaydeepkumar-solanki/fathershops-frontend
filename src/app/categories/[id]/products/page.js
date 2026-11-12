
import Link from "next/link";
import { Suspense } from "react";
import { apiRequest } from "@/lib/api";


async function CategoryHeading({ categoryId }) {
    let categoryName = "Category";

    try {
        const categories = await apiRequest("/categories");

        const category = categories.find(
            (item) => String(item.category_id) === String(categoryId)
        );

        if (category) {
            categoryName = category.name;
        }
    } catch (error) {
        console.error("Category fetch error:", error.message);
    }

    return (
        <h1 className="text-2xl font-bold text-gray-900">
            Explore products from {categoryName}
        </h1>
    );
}

// Fetch products using category ID
async function ProductsSection({ categoryId }) {
    let products = [];
    let error = null;

    try {
        products = await apiRequest(
            `/categories/${categoryId}/products`
        );
    } catch (err) {
        error = err.message;
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-5 text-red-600">
                Failed to load products: {error}
            </div>
        );
    }

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="rounded-lg bg-white p-10 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">
                    No Products Found
                </h3>
                <p className="mt-2 text-gray-500">
                    No products are currently available in this category.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product,index) => {
                const productName =
                    product.descriptions?.["1"]?.name ||
                    product.model ||
                    `Product ${product.product_id}`;

                const price =
                    product.calculated_price ??
                    product.base_price ??
                    "Price unavailable";

                return (
                    <Link
                        key={`${product.product_id}-${index}`}
                        href={`/products/${product.product_id}`}
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        {/* Product Image */}
                        <div className="h-56 overflow-hidden bg-gray-100">
                            <img
                                src={product.image}
                                alt={productName}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Product Information */}
                        <div className="p-5">

                            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                                {productName}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Model: {product.model || "N/A"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                SKU: {product.sku || "N/A"}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">
                                    {typeof price === "object"
                                        ? "Price unavailable"
                                        : price}
                                </span>

                                <span className="text-sm font-medium text-blue-600">
                                    View Details →
                                </span>
                            </div>

                            {product.rating != null && (
                                <p className="mt-3 text-sm text-yellow-600">
                                    ★ {product.rating}
                                    {product.reviews != null &&
                                        ` (${product.reviews} reviews)`}
                                </p>
                            )}

                        </div>
                    </Link>
                );
            })}

        </div>
    );
}

// Loading UI
function ProductsLoading() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-xl bg-white"
                >
                    <div className="h-56 bg-gray-200" />

                    <div className="space-y-3 p-5">
                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                        <div className="h-6 w-1/3 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Dynamic Category Page Content
async function CategoryPageContent({ params }) {
    const { id } = await params;

    return (
        <main className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-gray-900"
                    >
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

            {/* Products */}
            <section className="mx-auto max-w-7xl px-6 py-12">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Category Products
                    </h1>

                    <Suspense
                        fallback={
                            <h2 className="text-2xl font-bold">
                                Explore products...
                            </h2>
                        }
                    >
                        <CategoryHeading categoryId={id} />
                    </Suspense>
                </div>

                <Suspense fallback={<ProductsLoading />}>
                    <ProductsSection categoryId={id} />
                </Suspense>

            </section>
        </main>
    );
}

// Category products page
export default function CategoryProductsPage({ params }) {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <CategoryPageContent params={params} />
        </Suspense>
    );
}

