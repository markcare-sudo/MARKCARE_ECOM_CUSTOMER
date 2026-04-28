import React, { useState } from "react";
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [orderData, setOrderData] = useState(null);

    // Mock function to "fetch" order
    const handleTrack = (e) => {
        e.preventDefault();
        // Mocking a service booking result
        setOrderData({
            id: orderId || "ORD-9921",
            type: "SERVICE",
            status: "IN_PROGRESS",
            item: "Deep Kitchen Cleaning",
            date: "28 Oct 2023",
            professional: "Rahul Kumar",
            steps: [
                { title: "Confirmed", date: "26 Oct", completed: true },
                { title: "Professional Assigned", date: "27 Oct", completed: true },
                { title: "Professional on the way", date: "Today", completed: true, current: true },
                { title: "Service Completed", date: "--", completed: false },
            ]
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Track Your Order</h1>
                <p className="text-slate-500 text-sm mb-8">Enter your Order ID or Booking ID to see status.</p>

                <form onSubmit={handleTrack} className="flex gap-2 mb-10">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            placeholder="e.g. ORD-12345"
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <button className="bg-slate-900 text-white px-8 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                        Track
                    </button>
                </form>

                {orderData && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Order Summary Header */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                <h2 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                                    <FiClock /> {orderData.status.replace("_", " ")}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                                <p className="font-bold text-slate-800">#{orderData.id}</p>
                            </div>
                        </div>

                        {/* Professional Info (For Services) */}
                        {orderData.type === "SERVICE" && (
                            <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-4 mb-8">
                                <div className="bg-white p-3 rounded-full text-indigo-600 shadow-sm">
                                    <FiUser size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-600 font-bold uppercase">Assigned Professional</p>
                                    <p className="font-bold text-slate-800">{orderData.professional}</p>
                                </div>
                            </div>
                        )}

                        {/* Visual Stepper */}
                        <div className="relative space-y-8">
                            {orderData.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {/* Line connecting circles */}
                                    {idx !== orderData.steps.length - 1 && (
                                        <div className={`absolute left-[11px] top-7 w-[2px] h-full ${step.completed ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                                    )}

                                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${step.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-300'
                                        }`}>
                                        {step.completed ? <FiCheckCircle size={14} /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${step.current ? 'text-indigo-600' : 'text-slate-700'}`}>
                                            {step.title}
                                        </h4>
                                        <p className="text-xs text-slate-400">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;