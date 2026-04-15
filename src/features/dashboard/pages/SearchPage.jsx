// import React, { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useProducts } from "@/context/ProductContext";
// import ProductCard from "@/components/ui/ProductCard";

// const SearchPage = () => {
//     const [params] = useSearchParams();
//     const query = params.get("q");

//     const { products, loading, fetchCatalog } = useProducts();

//     useEffect(() => {
//         if (query) {
//             fetchCatalog({ search: query });
//         }
//     }, [query]);

//     return (
//         <div className="max-w-7xl mx-auto px-4 md:px-0 py-4 md:py-10">

//             <h2 className="text-2xl font-bold mb-6">
//                 Search Results for "{query}"
//             </h2>

//             {loading ? (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                     {[1, 2, 3, 4].map(i => (
//                         <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
//                     ))}
//                 </div>
//             ) : products.length === 0 ? (
//                 <p className="text-gray-500">No results found</p>
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
//                     {products.map(item => (
//                         <ProductCard key={item.id} product={item} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SearchPage;






import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import ProductCard from "@/components/ui/ProductCard";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const { products, fetchCatalog, loading } = useProducts();

    useEffect(() => {
        // ✅ ONLY call API if query exists
        if (query.trim()) {
            fetchCatalog({ search: query });
        }
    }, [query, fetchCatalog]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">

            <h1 className="text-2xl font-bold mb-6">
                Search Results for: "{query}"
            </h1>

            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No results found</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;