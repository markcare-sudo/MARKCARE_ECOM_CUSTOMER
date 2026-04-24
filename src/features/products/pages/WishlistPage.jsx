import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHeart } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

const WishlistPage = () => {
    const { wishlist, toggleWishlist, fetchWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    if (!wishlist || wishlist.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            <div className="max-w-7xl mx-auto px-4  pt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    My Wishlist ({wishlist.length})
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    // 1. Correct the data path based on your JSON (lowercase 'variant')
    const variant = item?.variant;
    const product = variant?.product;

    // 2. Format Price (handle string to number conversion)
    const price = Number(variant?.price || 0);
    const originalPrice = variant?.discount_price ? Number(variant.discount_price) : null;

    // 3. Robust Image Selection
    // Priority: Variant Image -> Product Primary Image -> First Product Image -> Placeholder
    const image = variant?.variant_images?.[0]?.url ||
        product?.images?.find(img => img.is_primary)?.url ||
        product?.images?.[0]?.url ||
        "/placeholder.png";

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Use the product_variant_id as that's what your toggle service expects
        onRemove(item.product_variant_id);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-sm hover:shadow-md transition-shadow flex flex-col group">
            {/* Image Area */}
            <Link to={`/product/${product?.slug}`} className="relative p-4 h-48 flex items-center justify-center overflow-hidden">
                <img
                    src={image}
                    alt={product?.name}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <button
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:shadow-md transition-all z-10"
                    title="Remove from Wishlist"
                >
                    <FiTrash2 size={18} />
                </button>
            </Link>

            {/* Info Area */}
            <div className="p-4 flex flex-col flex-1 border-t border-gray-50">
                <div className="text-[10px] text-blue-600 font-bold uppercase mb-1">
                    {product?.brand?.name || "Premium"}
                </div>

                <Link to={`/product/${product?.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 h-10">
                    {product?.name}
                </Link>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                    {originalPrice > price && (
                        <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                    )}
                </div>

                {/* Actions */}
                <button
                    onClick={() => onMoveToCart({
                        productId: product?.id,
                        variantId: variant?.id,
                        quantity: 1
                    })}
                    disabled={variant?.stock_quantity <= 0}
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2 border font-semibold rounded-sm transition-colors text-sm uppercase
                        ${variant?.stock_quantity <= 0
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-blue-600 text-blue-600 hover:bg-blue-50"
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
            <FiHeart className="text-blue-500 w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your wishlist is empty!</h2>
        <p className="text-gray-500 mt-2">Explore our products and save your favorites.</p>
        <Link to="/" className="mt-8 bg-[#2874f0] text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-700 transition-all uppercase tracking-wide text-sm">
            Start Shopping
        </Link>
    </div>
);

export default WishlistPage;