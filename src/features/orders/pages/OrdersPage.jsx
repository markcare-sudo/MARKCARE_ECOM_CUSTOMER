import React, { useState } from "react";
import { FiPackage, FiChevronRight, FiSearch, FiLoader, FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { apiStatusConstants } from "@/utils/api";
import PageHeader from "@/components/ui/PageHeader";
import { useOrder } from "@/context/OrderContext"; // 1. Import the hook

const OrdersPage = () => {
    // 2. Consume Context instead of local state
    const { orders, status, fetchOrders } = useOrder();
    const [searchTerm, setSearchTerm] = useState("");

    // 3. Filter logic remains the same, but uses context orders
    const filteredOrders = orders.filter(order =>
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case "DELIVERED": return "text-green-600 bg-green-50 border-green-100";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-100";
            case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-100";
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
                                placeholder="Search by Order ID or Product"
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm outline-none focus:border-[#2874f0] text-sm transition-all"
                            />
                        </div>
                    }
                />

                <div className="mt-6">
                    {/* 4. Use status from Context for UI feedback */}
                    {status === apiStatusConstants.IN_PROGRESS ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <FiLoader className="animate-spin text-[#2874f0] text-3xl mb-2" />
                            <p className="text-slate-500 text-sm font-medium">Fetching your orders...</p>
                        </div>
                    ) : status === apiStatusConstants.FAILURE ? (
                        <div className="text-center py-20 bg-red-50 rounded-sm border border-red-100">
                            <FiAlertCircle className="mx-auto text-3xl text-red-500 mb-2" />
                            <p className="text-red-600 font-medium">Failed to load orders.</p>
                            <button
                                onClick={fetchOrders} // 5. Use fetchOrders from context to retry
                                className="mt-4 text-[#2874f0] underline font-bold"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <EmptyOrders isSearch={searchTerm.length > 0} />
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <OrderCard key={order.id} order={order} getStatusStyles={getStatusStyles} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order, getStatusStyles }) => {
    // Standardizing data access
    const mainItem = order.items?.[0] || {};
    const statusStyle = getStatusStyles(order.status);

    return (
        <Link
            to={`/account/orders/${order.id}`}
            className="flex flex-col md:flex-row items-center gap-4 p-4 border border-slate-200 rounded-sm hover:shadow-md transition-all bg-white group"
        >
            {/* Product Image */}
            <div className="h-20 w-20 flex-shrink-0 border border-slate-100 rounded-sm overflow-hidden">
                <img
                    src={mainItem.product_image || "/placeholder.png"}
                    alt={mainItem.product_name}
                    className="h-full w-full object-contain p-1"
                />
            </div>

            {/* Order Details */}
            <div className="flex-grow flex flex-col md:flex-row justify-between w-full gap-4">
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-[#2874f0]">
                        {order.items?.length > 1
                            ? `${mainItem.product_name} & ${order.items.length - 1} more items`
                            : mainItem.product_name
                        }
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Order ID: {order.order_number}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Placed: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>

                <div className="w-32">
                    <p className="text-sm font-bold text-slate-900">₹{Number(order.total_amount).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Total Amount</p>
                </div>

                <div className="flex items-center gap-4 md:w-48 justify-between md:justify-end">
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}>
                        {order.status}
                    </div>
                    <FiChevronRight className="text-slate-300 group-hover:text-[#2874f0] group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </Link>
    );
};

const EmptyOrders = ({ isSearch }) => (
    <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-sm">
        <div className="bg-slate-50 p-6 rounded-full mb-4">
            <FiPackage className="text-slate-300 w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
            {isSearch ? "No orders match your search" : "No orders found"}
        </h2>
        <p className="text-slate-500 mt-1 text-sm">
            {isSearch ? "Try checking your order ID or product name." : "Looks like you haven't placed any orders yet."}
        </p>
        {!isSearch && (
            <Link to="/" className="mt-6 bg-[#2874f0] text-white px-8 py-2.5 rounded-sm font-bold text-sm uppercase">
                Start Shopping
            </Link>
        )}
    </div>
);

export default OrdersPage;