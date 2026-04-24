import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import wishlistService from "@/services/wishlist.service";
import { postErrorHandler } from "@/components/ErrorHandler";
import { useAuthContext } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    const fetchWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            return;
        }
        try {
            const res = await wishlistService.getWishlist();
            // In your backend, wishlist items are inside res.data.data.items
            const items = res.data.data?.items || [];
            setWishlist(items);
        } catch (err) {
            console.error("Wishlist fetch error:", err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (variantId) => {
        if (!isAuthenticated) {
            toast.error("Please login to manage your wishlist");
            navigate("/login");
            return;
        }

        // Save current state for revert
        const previousWishlist = [...wishlist];
        const isExist = wishlist.some(item => Number(item.product_variant_id) === Number(variantId));

        // --- OPTIMISTIC UI UPDATE ---
        if (isExist) {
            setWishlist(prev => prev.filter(item => Number(item.product_variant_id) !== Number(variantId)));
        } else {
            setWishlist(prev => [...prev, { product_variant_id: variantId }]);
        }

        // --- API CALL ---
        try {
            const res = await wishlistService.toggleWishlist(variantId);
            if (res.data.success) {
                toast.success(isExist ? "Removed from wishlist" : "Added to wishlist");
            }
        } catch (err) {
            postErrorHandler(err);
            setWishlist(previousWishlist); // Revert on failure
        }
    };

    const isInWishlist = (variantId) => {
        if (!variantId) return false;
        return wishlist.some(item => Number(item.product_variant_id) === Number(variantId));
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);