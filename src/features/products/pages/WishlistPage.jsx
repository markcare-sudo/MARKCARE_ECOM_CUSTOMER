import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import PageHeader from "@/components/ui/PageHeader";

const WishlistPage = () => {
    const { wishlist, toggleWishlist, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Handle empty state within the main layout to keep the PageHeader if desired,
    // or return the full EmptyWishlist component.
    if (!wishlist || wishlist.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="My Wishlist"
                    subtitle={`You have ${wishlist.length} items saved in your wishlist`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {wishlist.map((item) => (
                        <WishlistItemCard
                            key={item.id}
                            item={item}
                            onRemove={toggleWishlist}
                            onMoveToCart={addToCart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const WishlistItemCard = ({ item, onRemove, onMoveToCart }) => {
    // Data path alignment
    const variant = item?.variant;
    const product = variant?.product;

    const price = Number(variant?.price || 0);
    const originalPrice = variant?.discount_price ? Number(variant.discount_price) : null;

    const image = variant?.variant_images?.[0]?.url ||
        product?.images?.find(img => img.is_primary)?.url ||
        product?.images?.[0]?.url ||
        "/placeholder.png";

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Passing the ID to the toggle function
        onRemove(item.product_variant_id);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-sm hover:shadow-md transition-shadow flex flex-col group relative">
            {/* Remove Button */}
            <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:shadow-md transition-all z-10"
                title="Remove from Wishlist"
            >
                <FiTrash2 size={18} />
            </button>

            {/* Image Area */}
            <Link to={`/product/${product?.slug}`} className="p-4 h-52 flex items-center justify-center overflow-hidden">
                <img
                    src={image}
                    alt={product?.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </Link>

            {/* Info Area */}
            <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                    {product?.brand?.name || "Premium"}
                </div>

                <Link to={`/product/${product?.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 hover:text-[#2874f0] h-10">
                    {product?.name}
                </Link>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                    {originalPrice > price && (
                        <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                    )}
                    {originalPrice > price && (
                        <span className="text-xs text-green-600 font-semibold">
                            {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
                        </span>
                    )}
                </div>

                {/* Move to Cart Action */}
                <button
                    onClick={() => onMoveToCart({
                        productId: product?.id,
                        variantId: variant?.id,
                        quantity: 1
                    })}
                    disabled={variant?.stock_quantity <= 0}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 border font-bold rounded-sm transition-colors text-xs uppercase tracking-wider
                        ${variant?.stock_quantity <= 0
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-[#2874f0] text-[#2874f0] hover:bg-blue-50"
                        }`}
                >
                    <FiShoppingCart size={16} />
                    {variant?.stock_quantity <= 0 ? "Out of Stock" : "Move to Cart"}
                </button>
            </div>
        </div>
    );
};

const EmptyWishlist = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-white min-h-[60vh]">
        <div className="bg-blue-50 p-8 rounded-full mb-6">
            <FiHeart className="text-[#2874f0] w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your wishlist is empty!</h2>
        <p className="text-gray-500 mt-2">Explore our products and save your favorites.</p>
        <Link to="/" className="mt-8 bg-[#2874f0] text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-700 transition-all uppercase tracking-wide text-sm">
            Start Shopping
        </Link>
    </div>
);

export default WishlistPage;