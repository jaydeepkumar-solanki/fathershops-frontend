import Link from "next/link";
import { Suspense } from "react";
import { apiRequest } from "@/lib/api";

// Categories component
async function CategoriesSection() {
    let categories = [];
    let error = null;

    try {
        categories = await apiRequest("/categories");
    } catch (err) {
        error = err.message;
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
                Failed to load categories: {error}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="rounded-lg bg-white p-10 text-center">
                No categories available.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
                <Link
                    href={`/categories/${category.category_id}/products`}
                    key={category.category_id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                    <div className="h-52 overflow-hidden bg-gray-100">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                    </div>

                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {category.name}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            {/* Category ID: {category.category_id} */}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            {category.parent_id === "0"
                                ? "Main Category"
                                : "Subcategory"}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

// Loading component
function CategoriesLoading() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm"
                >
                    <div className="h-52 bg-gray-200" />
                    <div className="space-y-3 p-5">
                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Homepage
export default function HomePage() {
    return (
        <main className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <h1 className="text-2xl font-bold text-gray-900">
                        FatherShops
                    </h1>

                    <span className="text-sm text-gray-500">
                        Online Shopping
                    </span>
                </div>
            </header>

            {/* Categories Section */}
            <section className="mx-auto max-w-7xl px-6 py-12">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Shop by Categories
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Explore our available product categories.
                    </p>
                </div>

                <Suspense fallback={<CategoriesLoading />}>
                    <CategoriesSection />
                </Suspense>

            </section>
        </main>
    );
}