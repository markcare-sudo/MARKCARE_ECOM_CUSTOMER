import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiCalendar } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";
import { useService } from "@/context/ServiceContext";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }) => {
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();
    const { bookNow } = useService();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isService = product.type === "SERVICE";

    // ✅ Extract Pricing & Variant ID
    let currentPrice = 0, originalPrice = null, stock = 0, variantId = null;

    if (isService) {
        currentPrice = product.price;
        originalPrice = product.discount_price;
        // If Services don't have variants, we use product.id as a fallback
        // But per your model, variantId is required. Ensure services have a default variant.
        variantId = product.variants?.[0]?.id || product.id;
    } else {
        const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0];
        currentPrice = defaultVariant?.price || 0;
        originalPrice = defaultVariant?.discount_price || null;
        stock = defaultVariant?.stock_quantity || 0;
        variantId = defaultVariant?.id; // This matches product_variant_id in DB
    }

    const isLiked = isInWishlist(variantId);
    const isOutOfStock = !isService && stock <= 0;

    // ✅ Image Selection
    const primaryImage = isService
        ? product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url
        : product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url;

    const discountPercentage = (originalPrice > currentPrice)
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;

    // --- HANDLERS ---

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!variantId) {
            toast.error("Product variant not available");
            return;
        }

        // Context handleWishlist now expects the product_variant_id
        await toggleWishlist(variantId);
    };

    const handleAction = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        try {
            if (isService) {
                await bookNow(product.id);
            } else {
                await addToCart({
                    productId: product.id,
                    variantId: variantId,
                    quantity: 1
                });
            }
        } catch (err) {
            console.error("Action error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group bg-white flex flex-col h-full hover:shadow-[0_2px_15px_0_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100 relative rounded-sm">

            {/* WISHLIST BUTTON */}
            <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md border border-gray-100 z-20 hover:scale-110 transition-transform"
            >
                <FiHeart
                    className={`w-4 h-4 transition-colors ${isLiked ? "fill-[#ff4343] text-[#ff4343]" : "text-gray-300"}`}
                />
            </button>

            <Link to={`/${isService ? "service" : "product"}/${product.slug}`} className="flex flex-col h-full">
                <div className="p-4 h-[180px] md:h-[220px] flex items-center justify-center overflow-hidden">
                    <img
                        src={primaryImage || "/placeholder-product.png"}
                        alt={product.name}
                        className={`max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                </div>

                <div className="px-4 pb-3 flex flex-col flex-1">
                    <div className="text-gray-400 text-[10px] md:text-xs font-medium mb-1 truncate uppercase">
                        {product.brand?.name || (isService ? "Service" : "Premium")}
                    </div>

                    <h3 className="text-sm text-gray-800 mb-1 line-clamp-2 group-hover:text-[#2874f0] font-medium leading-tight h-10">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            4.3 ★
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                        <span className="text-base md:text-lg font-bold text-gray-900">₹{currentPrice.toLocaleString()}</span>
                        {discountPercentage > 0 && (
                            <span className="text-[#388e3c] text-xs font-bold">{discountPercentage}% off</span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-2 pt-0">
                <button
                    onClick={handleAction}
                    disabled={isOutOfStock || loading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-sm text-[11px] font-bold uppercase transition-colors
                        ${isOutOfStock ? "bg-gray-100 text-gray-400" : "bg-[#2874f0] text-white hover:bg-[#1266f1]"}
                    `}
                >
                    {loading ? "..." : isService ? <><FiCalendar /> Book Now</> : <><FiShoppingCart /> Add to Cart</>}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;