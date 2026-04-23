import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import {
    FiShoppingCart,
    FiCalendar,
    FiChevronRight,
    FiShield,
    FiTruck,
    FiHeart,
    FiShare2,
    FiCheckCircle,
    FiBell,
    FiAlertCircle,
    FiInfo
} from "react-icons/fi";

// Reusable Section for Description/Specs
const Section = ({ title, children, className = "" }) => (
    <section className={`bg-white rounded-2xl border border-gray-100 p-5 md:p-6 ${className}`}>
        <h2 className="text-sm md:text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full" /> {title}
        </h2>
        {children}
    </section>
);

const ProductServiceDetailsPage = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products } = useProducts();
    const [isLiked, setIsLiked] = useState(false);

    const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);

    const selectedVariant = useMemo(() => {
        if (!product?.variants) return null;
        const vid = searchParams.get("vid");
        return product.variants.find(v => v.id === vid) ||
            product.variants.find(v => v.is_default) ||
            product.variants[0];
    }, [product, searchParams]);

    const [activeImageUrl, setActiveImageUrl] = useState("");

    useEffect(() => {
        if (selectedVariant) {
            const variantImg = selectedVariant.variant_images?.[0]?.url;
            const productImg = product?.images?.find(i => i.is_primary)?.url || product?.images?.[0]?.url;
            setActiveImageUrl(variantImg || productImg);
        }
    }, [selectedVariant, product]);

    if (!product) return <div className="p-20 text-center text-gray-400">Product not found</div>;

    const isService = product.type === "SERVICE";
    const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : product.price;
    const currentDiscountPrice = selectedVariant ? parseFloat(selectedVariant.discount_price) : product.discount_price;
    const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
    const isOutOfStock = currentStock <= 0;

    const handleVariantChange = (variant) => setSearchParams({ vid: variant.id });

    const handleImageChange = (url) => {
        setActiveImageUrl(url);
        const linked = product.variants?.find(v => v.variant_images?.some(img => img.url === url));
        if (linked && linked.id !== selectedVariant?.id) setSearchParams({ vid: linked.id });
    };

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-28 lg:pb-20">
            {/* Breadcrumbs - Hidden on tiny screens */}
            <nav className="hidden sm:flex max-w-7xl mx-auto px-4 md:px-6 py-4 items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-gray-400">
                <span>Home</span> <FiChevronRight /> <span>{isService ? "Services" : "Shop"}</span>
                <FiChevronRight /> <span className="text-gray-900 font-bold truncate">{product.name}</span>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

                {/* 1. Image Gallery - Full width on mobile, 7 cols on desktop */}
                <div className="lg:col-span-7 w-full">
                    <div className="flex flex-col lg:flex-row-reverse gap-4">
                        {/* Main Image Container */}
                        <div className="flex-1 bg-white rounded-3xl overflow-hidden aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center border border-gray-100 relative group shadow-sm">
                            <img
                                src={activeImageUrl}
                                alt={product.name}
                                className="w-full h-full object-contain p-6 md:p-12 transition-transform duration-700 group-hover:scale-105"
                            />
                            {isOutOfStock && (
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-red-600 border border-red-100 shadow-sm">
                                    OUT OF STOCK
                                </div>
                            )}
                        </div>

                        {/* Thumbnails - Horizontal scroll on mobile */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-2 lg:pb-0">
                            {product.images?.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleImageChange(img.url)}
                                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImageUrl === img.url ? "border-blue-600 shadow-md scale-95" : "border-transparent bg-white opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={img.url} className="w-full h-full object-contain p-1" alt="thumb" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Product Information */}
                <div className="lg:col-span-5 space-y-6 md:space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest">{product.brand?.name}</p>
                                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                            </div>
                            <button onClick={() => setIsLiked(!isLiked)} className={`shrink-0 p-3 rounded-2xl border transition-all ${isLiked ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-300"}`}>
                                <FiHeart className={isLiked ? "fill-current" : ""} size={20} />
                            </button>
                        </div>

                        {/* Pricing Box */}
                        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-3xl font-black text-gray-900">₹{currentPrice?.toLocaleString()}</span>
                                {currentDiscountPrice && (
                                    <span className="text-base md:text-lg text-gray-300 line-through font-medium">₹{currentDiscountPrice.toLocaleString()}</span>
                                )}
                            </div>
                            <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {isOutOfStock ? <FiAlertCircle /> : <FiCheckCircle />}
                                {isOutOfStock ? 'Sold Out' : 'Instock'}
                            </div>
                        </div>
                    </div>

                    {/* Variant Selector */}
                    {product.variants?.length > 1 && (
                        <div className="space-y-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Available Options</span>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => handleVariantChange(v)}
                                        className={`px-4 py-3 md:px-6 md:py-4 rounded-2xl border-2 text-xs md:text-sm font-bold transition-all ${selectedVariant?.id === v.id
                                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                            : "border-white bg-white text-gray-500 hover:border-gray-200 shadow-sm"
                                            } ${v.stock_quantity <= 0 ? "opacity-40 grayscale" : ""}`}
                                    >
                                        {v.variant_specifications}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Desktop Actions */}
                    <div className="hidden lg:block pt-4">
                        {isOutOfStock ? (
                            <button className="w-full py-5 rounded-2xl bg-orange-50 text-orange-600 font-bold flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors">
                                <FiBell /> Notify Me When Available
                            </button>
                        ) : (
                            <button className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5 active:translate-y-0 ${isService ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
                                {isService ? <FiCalendar size={20} /> : <FiShoppingCart size={20} />}
                                {isService ? "Secure Your Slot" : "Add to Shopping Cart"}
                            </button>
                        )}
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FiTruck size={18} /></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Fast Delivery</span>
                                <span className="text-[10px] text-gray-400 font-medium">Free on all orders</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FiShield size={18} /></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-tighter">Warranty</span>
                                <span className="text-[10px] text-gray-400 font-medium">12 Months Protection</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Description and Specs - Full width */}
                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <Section title="Overview">
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                            {product.description || "Detailed product information currently unavailable."}
                        </p>
                    </Section>

                    <Section title="Technical Details">
                        <div className="space-y-1">
                            {Object.entries(product.specifications || {}).map(([key, val]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                                    <span className="text-[11px] md:text-xs text-gray-400 font-bold uppercase tracking-tight">{key}</span>
                                    <span className="text-[11px] md:text-xs text-gray-800 font-black">{String(val)}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </main>

            {/* 4. Mobile Sticky Bottom Bar - Hidden on LG+ */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 pb-6 flex items-center gap-4 z-[100] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col shrink-0">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">Total Price</span>
                    <span className="text-xl font-black text-gray-900 tracking-tight">₹{currentPrice?.toLocaleString()}</span>
                </div>
                {isOutOfStock ? (
                    <button className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                        <FiBell /> Notify Me
                    </button>
                ) : (
                    <button className={`flex-1 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-white shadow-lg ${isService ? "bg-blue-600 shadow-blue-200" : "bg-black shadow-gray-200"}`}>
                        {isService ? "Book Now" : "Add to Cart"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductServiceDetailsPage;