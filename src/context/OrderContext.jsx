import { createContext, useContext, useState, useCallback, useEffect } from "react";
import ordersService from "@/services/orders.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);
    const [currentOrder, setCurrentOrder] = useState(null); // For order details view

    // 1. Fetch all orders (History)
    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await ordersService.getOrders();
            // setOrders(res.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    // 2. Fetch specific order details
    const fetchOrderDetails = async (orderId) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await ordersService.getOrderById(orderId);
            setCurrentOrder(res.data.data);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    // 3. Place a new order
    const placeOrder = async (orderPayload) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await ordersService.createOrder(orderPayload);
            successHandler(res);
            await fetchOrders(); // Refresh history
            return res.data.data; // Return order info for redirection to success page
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err;
        }
    };

    // 4. Cancel an order
    const cancelOrder = async (orderId, reason) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await ordersService.cancelOrder(orderId, reason);
            successHandler(res);
            await fetchOrders(); // Refresh list to show 'Cancelled' status
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, fetchOrders]);

    return (
        <OrderContext.Provider value={{
            orders,
            currentOrder,
            status,
            loading: status === apiStatusConstants.IN_PROGRESS,
            fetchOrders,
            fetchOrderDetails,
            placeOrder,
            cancelOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);