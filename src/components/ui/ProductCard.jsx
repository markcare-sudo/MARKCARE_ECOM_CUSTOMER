import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiCalendar, FiArrowRight, FiInfo } from "react-icons/fi";

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const isService = product.type === "SERVICE";

    // ✅ Image Selection
    const primaryImage = isService
        ? product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
        : product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url;

    // ✅ Selection Logic
    let price = 0;
    let discountPrice = null;
    let stock = 0;

    if (isService) {
        price = product.price;
        discountPrice = product.discount_price;
    } else {
        const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0];
        price = defaultVariant?.price || 0;
        discountPrice = defaultVariant?.discount_price || null;
        stock = defaultVariant?.stock_quantity || 0;
    }

    const isOutOfStock = !isService && stock <= 0;
    const hasDiscount = discountPrice && discountPrice > price;
    const specs = product.specifications || product.common_specifications || {};

    return (
        <div className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] lg:hover:-translate-y-2 overflow-hidden">

            {/* IMAGE AREA - Aspect ratio shifts for better mobile viewing */}
            <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden m-2 md:m-3 rounded-[1.2rem] md:rounded-[1.5rem] bg-[#F9F9F9]">
                <img
                    src={primaryImage || "/placeholder-product.png"}
                    alt={product.name}
                    className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 ease-out group-hover:scale-110 ${isOutOfStock ? 'opacity-40 grayscale' : ''}`}
                    loading="lazy"
                />

                {/* BADGES - Scaled for mobile */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-1.5">
                    <div className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-tighter backdrop-blur-md shadow-sm border ${isService ? "bg-blue-50/80 border-blue-100 text-blue-600" : "bg-white/80 border-gray-100 text-gray-900"
                        }`}>
                        {isService ? "Service" : "Product"}
                    </div>
                    {hasDiscount && (
                        <div className="bg-red-500 text-white text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full shadow-lg shadow-red-100 uppercase tracking-tighter w-fit">
                            Sale
                        </div>
                    )}
                </div>

                {/* WISHLIST - Larger touch target for mobile */}
                <button
                    onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
                    className="absolute top-2 right-2 md:top-3 md:right-3 p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-sm lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50 active:scale-90 z-10"
                >
                    <FiHeart
                        size={16}
                        className={`md:w-[18px] md:h-[18px] transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                </button>

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                        <span className="bg-black/60 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENT AREA */}
            <div className="px-4 pb-5 md:px-6 md:pb-7 pt-1 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-[0.1em] md:tracking-[0.15em]">
                        {product.brand?.name || "Premium"}
                    </span>
                    {isService && (
                        <span className="flex items-center gap-1 text-[8px] md:text-[10px] text-gray-400 font-bold uppercase">
                            <FiInfo size={10} /> {product.service_type?.split('_')[0]}
                        </span>
                    )}
                </div>

                <Link to={`/${isService ? "service" : "product"}/${product.slug}`} className="mb-3 md:mb-4">
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-snug md:leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors tracking-tight">
                        {product.name}
                    </h3>
                </Link>

                {/* MINI SPECS - Hidden on very small mobile screens to save space */}
                <div className="hidden sm:flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {Object.entries(specs).slice(0, 2).map(([key, val]) => (
                        <span key={key} className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md">
                            {val}
                        </span>
                    ))}
                </div>

                {/* PRICE & ACTION AREA */}
                <div className="mt-auto">
                    <div className="flex items-end justify-between mb-3 md:mb-5">
                        <div className="flex flex-col">
                            {hasDiscount && (
                                <span className="text-[10px] md:text-xs text-gray-300 line-through font-bold mb-[-2px] md:mb-[-4px]">
                                    ₹{discountPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">
                                ₹{price.toLocaleString()}
                            </span>
                        </div>

                        {/* Hidden on mobile, shown on desktop for better UX */}
                        <Link
                            to={`/${isService ? "service" : "product"}/${product.slug}`}
                            className="hidden sm:flex p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
                        >
                            <FiArrowRight size={18} />
                        </Link>
                    </div>

                    <button
                        disabled={isOutOfStock}
                        className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-all duration-500 shadow-sm
                        ${isService
                                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97]"
                                : isOutOfStock
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-blue-600 active:scale-[0.97]"
                            }`}
                    >
                        {isService ? (
                            <><FiCalendar className="w-3 h-3 md:w-4 md:h-4" /> Book</>
                        ) : isOutOfStock ? (
                            "Sold Out"
                        ) : (
                            <><FiShoppingCart className="w-3 h-3 md:w-4 md:h-4" /> Add</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;