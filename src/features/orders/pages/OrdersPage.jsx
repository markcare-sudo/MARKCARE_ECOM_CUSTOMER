import React, { useState } from "react";
import { FiPackage, FiChevronRight, FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { apiStatusConstants } from "@/utils/api";
import PageHeader from "@/components/ui/PageHeader";
import { useOrder } from "@/context/OrderContext";

const OrdersPage = () => {
    const { orders = [], status, fetchOrders } = useOrder();

    const [searchTerm, setSearchTerm] = useState("");

    // ✅ FIXED FILTER (based on actual response)
    const filteredOrders = orders.filter(order =>
        order.order_code?.toString().includes(searchTerm) ||
        order.items?.some(item =>
            item.product_id?.toString().includes(searchTerm)
        )
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "DELIVERED": return "text-green-600 bg-green-50 border-green-100";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-100";
            case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-100";
            case "CONFIRMED": return "text-green-600 bg-green-50 border-green-100";
            default: return "text-orange-600 bg-orange-50 border-orange-100";
        }
    };

    return (
        <div className="pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="My Orders"
                    subtitle="Track and manage your recent purchases"
                    action={
                        <div className="relative w-full sm:w-72">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by Order ID"
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm outline-none focus:border-[#2874f0] text-sm"
                            />
                        </div>
                    }
                />

                <div className="mt-6">
                    {status === apiStatusConstants.IN_PROGRESS ? (
                        <div className="flex flex-col items-center py-20">
                            <FiLoader className="animate-spin text-3xl mb-2" />
                            <p>Fetching your orders...</p>
                        </div>
                    ) : status === apiStatusConstants.FAILURE ? (
                        <div className="text-center py-20">
                            <FiAlertCircle className="mx-auto text-3xl mb-2 text-red-500" />
                            <p>Failed to load orders</p>
                            <button onClick={fetchOrders} className="mt-4 underline">
                                Try Again
                            </button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <EmptyOrders isSearch={searchTerm.length > 0} />
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    getStatusStyles={getStatusStyles}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order, getStatusStyles }) => {
    const statusStyle = getStatusStyles(order.order_status);

    return (
        <Link
            to={`/account/orders/${order.id}`}
            className="flex justify-between items-center p-4 border rounded bg-white hover:shadow"
        >
            <div>
                <h3 className="font-semibold">
                    Order #{order.order_code}
                </h3>

                <p className="text-xs text-gray-500">
                    {order.items?.length} item(s)
                </p>

                <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
            </div>

            <div className="text-right">
                <p className="font-bold">
                    ₹{Number(order.total_amount).toLocaleString()}
                </p>

                <span className={`px-2 py-1 text-xs rounded ${statusStyle}`}>
                    {order.order_status}
                </span>
            </div>

            <FiChevronRight />
        </Link>
    );
};

const EmptyOrders = ({ isSearch }) => (
    <div className="text-center py-20">
        <FiPackage className="mx-auto text-4xl text-gray-300 mb-4" />
        <h2 className="text-xl font-bold">
            {isSearch ? "No results found" : "No orders yet"}
        </h2>
    </div>
);

export default OrdersPage;