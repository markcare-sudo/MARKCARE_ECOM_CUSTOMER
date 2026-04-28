import { createContext, useContext, useState, useCallback, useEffect } from "react";
import cartService from "@/services/cart.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [cart, setCart] = useState(null);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);


    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await cartService.getCart();

            setCart(res.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const addToCart = async ({ productId, variantId, quantity = 1 }) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }

        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await cartService.addToCart({ product_id: productId, product_variant_id: variantId, quantity });
            successHandler(res);
            await fetchCart(); // Refresh cart data
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const res = await cartService.updateItem(itemId, { quantity });
            await fetchCart();
        } catch (err) {
            postErrorHandler(err);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await cartService.removeItem(itemId);
            successHandler(res);
            await fetchCart();
        } catch (err) {
            postErrorHandler(err);
        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    return (
        <CartContext.Provider value={{
            cart, status,
            loading: status === apiStatusConstants.IN_PROGRESS,
            fetchCart, addToCart, updateQuantity, removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);











