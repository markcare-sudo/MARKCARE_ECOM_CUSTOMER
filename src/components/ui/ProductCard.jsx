import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiCalendar, FiArrowRight } from "react-icons/fi";

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const isService = product.type === "SERVICE";

    // ✅ Image handling
    const primaryImage = isService
        ? product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
        : product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url;

    // ✅ Price logic
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
        <div className="group relative bg-white rounded border border-slate-100 flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1">

            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[10/11] overflow-hidden rounded bg-slate-50">
                <img
                    src={primaryImage || "/placeholder-product.png"}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* FLOATING BADGES */}
                <div className="absolute top-2 md:top-3 left-2 md:left-3 flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-md border shadow-sm ${isService
                        ? "bg-amber-50/80 border-amber-200 text-amber-700"
                        : "bg-emerald-50/80 border-emerald-200 text-emerald-700"
                        }`}>
                        {isService ? "Service" : "Product"}
                    </span>
                    {hasDiscount && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-red-200 uppercase">
                            Sale
                        </span>
                    )}
                </div>

                {/* QUICK WISHLIST */}
                <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-2 md:top-3 right-2 md:right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 group/heart"
                >
                    <FiHeart
                        size={18}
                        className={`transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400 group-hover/heart:text-red-400"}`}
                    />
                </button>
            </div>

            {/* CARD CONTENT */}
            <div className="px-2 pb-5 pt-3 flex flex-col flex-1">
                <div className="mb-3">
                    <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                        {product.brand?.name || "Premium Care"}
                    </p>
                    <Link to={`/${isService ? "service" : "product"}/${product.slug}`}>
                        <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* SPECS MINI-CHIPS */}
                {!isService && Object.keys(specs).length > 0 && (
                    <div className="flex gap-1.5 mb-4">
                        {Object.entries(specs).slice(0, 2).map(([key, val]) => (
                            <span key={key} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                {val}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-50">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-slate-900">
                                ₹{price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-slate-400 line-through font-medium">
                                    ₹{discountPrice.toLocaleString()}
                                </span>
                            )}
                        </div>
                        {isService && (
                            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                                {product.service_type?.replace("_", " ")}
                            </p>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                        {/* Desktop "Quick View" arrow that appears on hover */}
                        <Link
                            to={`/${isService ? "service" : "product"}/${product.slug}`}
                            className="hidden lg:flex p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                            <FiArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        disabled={isOutOfStock}
                        className={`w-full py-2 md:py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] shadow-sm
                        ${isService
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                                : isOutOfStock
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                    : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200"
                            }`}
                    >
                        {isService ? (
                            <><FiCalendar size={15} /> Book Now</>
                        ) : isOutOfStock ? (
                            "Sold Out"
                        ) : (
                            <><FiShoppingCart size={15} /> Add to Cart</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;