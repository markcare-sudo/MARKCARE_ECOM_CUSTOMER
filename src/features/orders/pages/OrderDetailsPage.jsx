import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useOrder } from "@/context/OrderContext";
import { apiStatusConstants } from "@/utils/api";



const OrderDetailsPage = () => {
    const { id } = useParams();
    const { currentOrder, fetchOrderDetails, status } = useOrder();
    const [showCancelBox, setShowCancelBox] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        fetchOrderDetails(id);
    }, [id]);

    if (status === apiStatusConstants.IN_PROGRESS) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FiLoader className="animate-spin text-3xl text-indigo-600 mb-2" />
                <p className="text-sm text-slate-500">Loading order details...</p>
            </div>
        );
    }

    if (status === apiStatusConstants.FAILURE) {
        return (
            <div className="text-center py-20">
                <FiAlertCircle className="text-red-500 text-3xl mx-auto mb-2" />
                <p className="text-red-600 font-medium">Failed to load order</p>
            </div>
        );
    }

    if (!currentOrder) return null;

    const order = currentOrder;

    const getStatusStyles = (status) => {
        switch (status) {
            case "DELIVERED":
                return "text-green-600 bg-green-50";
            case "CANCELLED":
                return "text-red-600 bg-red-50";
            case "SHIPPED":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-orange-600 bg-orange-50";
        }
    };

    const canCancelOrder = () => {
        const orderDate = new Date(order.created_at);
        const now = new Date();

        const diffTime = now - orderDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays <= 3 && order.order_status !== "CANCELLED";
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert("Please enter cancellation reason");
            return;
        }

        try {
            await cancelOrder(order.id, cancelReason); // <-- from context/API
            setShowCancelBox(false);
            setCancelReason("");
            fetchOrderDetails(id); // refresh
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                    <Link to="/account/orders" className="text-slate-500 hover:text-indigo-600">
                        <FiArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">
                        Order Details
                    </h1>
                </div>

                {canCancelOrder() && (
                    <button
                        onClick={() => setShowCancelBox(true)}
                        className="px-4 py-2 text-sm cursor-pointer bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Return Order
                    </button>
                )}

            </div>


            {/* Order Info */}
            <div className="bg-white border rounded-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                    <div>
                        <p className="text-sm text-slate-500">Order ID</p>
                        <p className="font-semibold text-slate-800">{order.id}</p>

                        <p className="text-sm text-slate-500 mt-2">Placed On</p>
                        <p className="font-medium">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Total Amount</p>
                        <p className="text-lg font-bold text-slate-900">
                            ₹{Number(order.total_amount).toLocaleString()}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">Payment</p>
                        <p className="font-medium">
                            {order.payment_status} ({order.payment_method})
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(order.order_status)}`}>
                            {order.order_status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Items</h2>

                <div className="space-y-4">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-4 last:border-none">

                            {/* Image */}
                            <div className="w-20 h-20 border rounded overflow-hidden">
                                <img
                                    src={item.variant?.variant_images?.[0]?.url || "/placeholder.png"}
                                    alt=""
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">
                                    {item.variant?.product?.name}
                                </p>

                                <p className="text-sm text-slate-500 mt-1">
                                    Qty: {item.quantity}
                                </p>

                                <p className="text-sm text-slate-500">
                                    ₹{Number(item.unit_price).toLocaleString()}
                                </p>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                                <p className="font-semibold text-slate-900">
                                    ₹{Number(item.subtotal).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Provider</p>
                        <p className="font-medium">{order.payment?.provider || "-"}</p>
                    </div>

                    <div>
                        <p className="text-slate-500">Transaction ID</p>
                        <p className="font-medium">{order.payment?.transaction_id || "-"}</p>
                    </div>

                    <div>
                        <p className="text-slate-500">Status</p>
                        <p className="font-medium">{order.payment?.status || "-"}</p>
                    </div>

                    <div>
                        <p className="text-slate-500">Amount</p>
                        <p className="font-medium">
                            ₹{Number(order.payment?.amount || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {showCancelBox && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl p-6">

                        <h2 className="text-lg font-semibold mb-3">
                            Cancel Order
                        </h2>

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                            className="w-full border rounded-lg p-3 text-sm mb-4"
                            rows={4}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowCancelBox(false)}
                                className="px-4 py-2 text-sm border rounded-lg"
                            >
                                Close
                            </button>

                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg"
                            >
                                Confirm Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default OrderDetailsPage;