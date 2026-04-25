import apiClient from "../utils/api";

/**
 * Fetches all saved addresses for the authenticated user.
 */
const getAddresses = async () => {
    return await apiClient.get("/addresses");
};

/**
 * Adds a new address to the user's profile.
 * payload: { fullName, phone, pincode, locality, address, city, state, stateCode, type, latitude, longitude }
 */
const createAddress = async (payload) => {
    return await apiClient.post("/addresses", payload);
};

/**
 * Updates an existing address by its ID.
 * payload: { fullName, phone, pincode, locality, address, city, state, stateCode, type, latitude, longitude }
 */
const updateAddress = async (addressId, payload) => {
    return await apiClient.put(`/addresses/${addressId}`, payload);
};

/**
 * Deletes a specific address by its ID.
 */
const deleteAddress = async (addressId) => {
    return await apiClient.delete(`/addresses/${addressId}`);
};

/**
 * Sets an address as the default shipping address.
 */
const setDefaultAddress = async (addressId) => {
    return await apiClient.patch(`/addresses/${addressId}/default`);
};

const addressService = {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};

export default addressService;