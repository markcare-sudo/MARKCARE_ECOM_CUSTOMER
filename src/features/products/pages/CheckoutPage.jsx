import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { FiLock, FiArrowRight } from "react-icons/fi";
import AddressSection from "../../address/components/AddressSection";

const CheckoutPage = () => {
    const { cart } = useCart();
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const addresses = [
        { id: 1, name: "John Doe", type: "HOME", street: "123 Tech Lane", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "9876543210" },
    ];

    const totalAmount = cart?.total_amount || 0;

    return (
        <div className="bg-[#FAFBFF] min-h-screen pb-32 lg:pb-12"> {/* Added extra bottom padding for mobile footer */}
            <div className="max-w-7xl px-4 mx-auto pt-6">

                {/* Main Grid: 1 column on mobile/tablet, 12 columns on large desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Shipping & Items */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8 lg:space-y-12">
                        <AddressSection
                            addresses={addresses}
                            selectedAddress={selectedAddressId}
                            onSelect={setSelectedAddressId}
                        />

                        <div className="pt-8 border-t border-slate-200">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">Review Items</h2>
                            <div className="space-y-3">
                                {cart?.items?.map(item => (
                                    <div key={item?.id} className="group flex items-center gap-3 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md transition-all">
                                        {/* Image: Smaller on mobile */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 flex-shrink-0 overflow-hidden border border-slate-100">
                                            <img src={item?.product?.images[0]?.url} alt="" className="w-full h-full object-contain mix-blend-multiply p-2" />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-800 truncate">{item?.product?.name}</h4>
                                            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-tight">
                                                Qty: {item?.quantity || 1}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="font-bold text-sm sm:text-base text-slate-900">
                                                ₹{item?.product?.selected_variant?.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        {/* Hidden on mobile, visible on LG screens and up */}
                        <div className="hidden lg:block bg-slate-900 rounded p-8 text-white sticky top-8 shadow-2xl shadow-indigo-100">
                            <h3 className="text-xl font-medium mb-8">Order Summary</h3>

                            <div className="space-y-4 border-b border-slate-800 pb-8">
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">₹{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400 font-medium uppercase text-xs tracking-wider">Free</span>
                                </div>
                                <div className="flex justify-between text-slate-400 text-sm">
                                    <span>Tax (GST)</span>
                                    <span className="text-white font-medium">Included</span>
                                </div>
                            </div>

                            <div className="py-8">
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Payable</p>
                                <p className="text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</p>
                            </div>

                            <button
                                disabled={!selectedAddressId}
                                className={`group w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${selectedAddressId
                                    ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                    }`}
                            >
                                <FiLock className="text-sm" />
                                PROCEED TO PAYMENT
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-[0.2em]">
                                Secure Checkout • MarkCare
                            </p>
                        </div>

                        {/* Mobile/Tablet Price Breakdown (Visible only when not LG) */}
                        <div className="lg:hidden bg-white border border-slate-200 rounded-3xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Price Details</h3>
                            <div className="space-y-3 text-sm text-slate-600">
                                <div className="flex justify-between"><span>Subtotal</span><span className="text-slate-900 font-medium">₹{totalAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between border-t border-slate-100 pt-3 font-bold text-lg text-slate-900">
                                    <span>Total</span>
                                    <span>₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile-Only Sticky Footer Button */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total</p>
                        <p className="text-xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p>
                    </div>
                    <button
                        disabled={!selectedAddressId}
                        className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${selectedAddressId
                            ? "bg-indigo-600 text-white active:scale-95 shadow-md"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        <span>Checkout</span>
                        <FiArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;