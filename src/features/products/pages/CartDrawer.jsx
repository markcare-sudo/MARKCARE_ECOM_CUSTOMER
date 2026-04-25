import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiX, FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
    const { cart, updateQuantity, removeFromCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const isOpen = searchParams.get("cart") === "open";

    const closeDrawer = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("cart");
        setSearchParams(newParams);
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    // Calculate total from the cart object if not provided by context
    const totalAmount = cart?.total_amount || 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={closeDrawer}
            />

            {/* Panel */}
            <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <FiShoppingBag /> Your Cart ({cart?.item_count || 0})
                    </h2>
                    <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-170px)]">
                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <CartRow
                                key={item.id}
                                item={item}
                                onUpdate={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <FiShoppingBag size={48} className="mb-4 opacity-20" />
                            <p>Your cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart?.items?.length > 0 && (
                    <div className="absolute bottom-0 w-full p-4 border-t bg-white">
                        <div className="flex justify-between mb-4 font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-blue-600">₹{Number(totalAmount).toLocaleString()}</span>
                        </div>
                        <Link
                            to="/checkout"
                            onClick={closeDrawer}
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-bold text-center transition-colors"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
};

// Helper component for the rows
const CartRow = ({ item, onUpdate, onRemove }) => {
    // Correctly destructuring based on your new JSON structure
    const { product, quantity } = item;
    const variant = product?.selected_variant;

    // Find the primary image or use the first one available
    const displayImage = product?.images?.find(img => img.is_primary)?.url || product?.images?.[0]?.url;

    return (
        <div className="flex gap-4 mb-4 border-b pb-4 last:border-0">
            <div className="relative group">
                <img
                    src={displayImage || "/placeholder.png"}
                    className="w-20 h-20 object-contain bg-gray-50 rounded-lg border"
                    alt={product?.name}
                />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{product?.name}</h4>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>

                    {/* Display Variant Specs */}
                    {variant?.variant_specifications && (
                        <p className="text-xs text-gray-500 mt-0.5">
                            Option: <span className="text-gray-700 font-medium">{variant.variant_specifications}</span>
                        </p>
                    )}

                    <p className="text-xs text-blue-600 font-semibold mt-1">
                        ₹{Number(variant?.price).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => onUpdate(item.id, quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <FiMinus size={12} />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{quantity}</span>
                        <button
                            onClick={() => onUpdate(item.id, quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                        >
                            <FiPlus size={12} />
                        </button>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                        ₹{(Number(variant?.price || 0) * quantity).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;