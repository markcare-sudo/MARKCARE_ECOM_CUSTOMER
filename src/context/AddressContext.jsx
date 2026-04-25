import { createContext, useContext, useState, useCallback, useEffect } from "react";
import addressService from "@/services/address.service"; // Assuming this service exists
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [addresses, setAddresses] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    // 1. Fetch all addresses
    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await addressService.getAddresses();
            const data = res.data.data || [];

            setAddresses(data);

            // Auto-select the first address if none selected
            if (data.length > 0 && !selectedAddressId) {
                setSelectedAddressId(data[0].id);
            }

            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated, selectedAddressId]);

    // 2. Add new address
    const addAddress = async (addressData) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await addressService.createAddress(addressData);
            successHandler(res);
            await fetchAddresses(); // Refresh list
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // 3. Update existing address
    const updateAddress = async (addressId, updatedData) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await addressService.updateAddress(addressId, updatedData);
            successHandler(res);
            await fetchAddresses(); // Refresh list
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // 4. Delete address
    const deleteAddress = async (addressId) => {
        try {
            const res = await addressService.deleteAddress(addressId);
            successHandler(res);
            await fetchAddresses();

            // Clear selection if deleted address was selected
            if (selectedAddressId === addressId) {
                setSelectedAddressId(null);
            }
        } catch (err) {
            postErrorHandler(err);
        }
    };

    // 5. Select address (for checkout)
    const selectAddress = (id) => {
        setSelectedAddressId(id);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAddresses();
        }
    }, [isAuthenticated, fetchAddresses]);

    return (
        <AddressContext.Provider value={{
            addresses,
            status,
            selectedAddressId,
            loading: status === apiStatusConstants.IN_PROGRESS,
            fetchAddresses,
            addAddress,
            updateAddress,
            deleteAddress,
            selectAddress,
            // Computed selected address object
            selectedAddress: addresses.find(a => a.id === selectedAddressId) || null
        }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);