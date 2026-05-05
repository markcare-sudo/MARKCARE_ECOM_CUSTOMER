import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiCalendar, FiPlus, FiMinus } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { cart, addToCart, updateQuantity } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isService = product?.type === "SERVICE";

    // ✅ Extract Pricing & Variant ID
    let currentPrice = 0, originalPrice = null, stock = 0, variantId = null;

    if (isService) {
        currentPrice = product?.price;
        originalPrice = product?.discount_price;
        variantId = product?.variants?.[0]?.id || product?.id;
    } else {
        const defaultVariant = product?.variants?.find(v => v.is_default) || product?.variants?.[0];
        currentPrice = defaultVariant?.price || 0;
        originalPrice = defaultVariant?.discount_price || null;
        stock = defaultVariant?.stock_quantity || 0;
        variantId = defaultVariant?.id;
    }

    const cartItem = cart?.items?.find(item => String(item.product_variant_id) === String(variantId));
    const isInCart = !!cartItem;
    const isLiked = isInWishlist(variantId);
    const isOutOfStock = !isService && stock <= 0;

    const primaryImage = isService
        ? product?.images?.find(img => img.is_primary)?.image_url || product?.images?.[0]?.image_url
        : product?.images?.find(img => img.is_primary)?.url || product?.images?.[0]?.url;

    const discountPercentage = (originalPrice > currentPrice)
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : null;

    // --- HANDLERS ---

    const handleAction = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isService) {
            // Plan for Service: Redirect to details page to select Slot/Date
            navigate(`/service/${product?.slug}`);
            return;
        }

        if (loading || isOutOfStock) return;

        setLoading(true);
        try {
            await addToCart({
                productId: product?.id,
                variantId,
                quantity: 1,
            });
        } catch (err) {
            console.error("Action error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (e, newQty) => {
        e.preventDefault();
        e.stopPropagation();
        if (newQty < 1) return;
        setLoading(true);
        await updateQuantity(cartItem.id, newQty);
        setLoading(false);
    };

    return (
        <div className="group bg-white flex flex-col h-full hover:shadow-[0_2px_15px_0_rgba(0,0,0,0.15)] transition-all duration-300 border border-gray-100 relative rounded-sm">

            {/* ✅ REMOVED WISHLIST FOR SERVICES */}
            {!isService && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(variantId);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md border border-gray-100 z-20 hover:scale-110 transition-transform"
                >
                    <FiHeart
                        className={`w-4 h-4 transition-colors ${isLiked ? "fill-[#ff4343] text-[#ff4343]" : "text-gray-300"}`}
                    />
                </button>
            )}

            <Link to={`/${isService ? "service" : "product"}/${product?.slug}`} className="flex flex-col h-full">
                <div className="h-[160px] p-2 md:p-4 md:h-[220px] flex items-center justify-center overflow-hidden">
                    <img
                        src={primaryImage || "/placeholder-product?.png"}
                        alt={product?.name}
                        className={`max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                    />
                </div>

                <div className="px-2 md:px-4 pb-2 flex flex-col flex-1">
                    <div className="text-gray-400 truncate text-[10px] md:text-xs font-medium mb-1 uppercase">
                        {product?.brand?.name || (isService ? "On-Demand Service" : "Premium")}
                    </div>

                    <h3 className="text-sm truncate text-gray-800 mb-2 line-clamp-2 group-hover:text-[#2874f0] font-medium leading-tight h-6">
                        {product?.name}
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
                {(!isService && isInCart) ? (
                    <div className="flex items-center w-full bg-white border border-[#2874f0] rounded-sm overflow-hidden h-[32px] md:h-[42px]">
                        <button
                            onClick={(e) => handleQuantityChange(e, cartItem.quantity - 1)}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center h-full hover:bg-gray-50 text-[#2874f0]"
                        >
                            <FiMinus size={14} />
                        </button>
                        <span className="flex-1 flex items-center justify-center font-bold text-sm text-[#2874f0]">
                            {loading ? "..." : cartItem.quantity}
                        </span>
                        <button
                            onClick={(e) => handleQuantityChange(e, cartItem.quantity + 1)}
                            disabled={loading || (cartItem.quantity >= stock)}
                            className="flex-1 flex items-center justify-center h-full hover:bg-gray-50 text-[#2874f0]"
                        >
                            <FiPlus size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAction}
                        disabled={isOutOfStock || loading}
                        className={`w-full flex items-center justify-center gap-2 py-1 md:py-2.5 rounded-sm text-[11px] font-bold uppercase transition-colors h-[32px] md:h-[42px]
                            ${isOutOfStock ? "bg-gray-100 text-gray-400" : "bg-[#2874f0] text-white hover:bg-[#1266f1]"}
                        `}
                    >
                        {loading ? "..." : isService ? <><FiCalendar /> Select Slot</> : <><FiShoppingCart /> Add to Cart</>}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;