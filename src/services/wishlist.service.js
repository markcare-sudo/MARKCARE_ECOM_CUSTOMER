import apiClient from "../utils/api";

const getWishlist = async () => {
    return await apiClient.get("/wishlist");
};

const toggleWishlist = async (productVariantId) => {
    // Often a single endpoint to add/remove based on current state
    return await apiClient.post(`/wishlist/toggle`, { product_variant_id: productVariantId });
};

const removeFromWishlist = async (id) => {
    return await apiClient.delete(`/wishlist/${id}`);
};

const wishlistService = {
    getWishlist,
    toggleWishlist,
    removeFromWishlist
};

export default wishlistService;