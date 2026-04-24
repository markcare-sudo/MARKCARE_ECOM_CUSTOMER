import apiClient from "../utils/api";

const getCart = async () => {
    return await apiClient.get("/cart");
};

const addToCart = async (payload) => {
    // payload: { product_id, variant_id, quantity }
    return await apiClient.post("/cart", payload);
};

const updateItem = async (itemId, payload) => {
    // payload: { quantity }
    return await apiClient.put(`/cart/${itemId}`, payload);
};

const removeItem = async (itemId) => {
    return await apiClient.delete(`/cart/${itemId}`);
};

const clearCart = async () => {
    return await apiClient.delete("/cart");
};

const cartService = {
    getCart,
    addToCart,
    updateItem,
    removeItem,
    clearCart
};

export default cartService;