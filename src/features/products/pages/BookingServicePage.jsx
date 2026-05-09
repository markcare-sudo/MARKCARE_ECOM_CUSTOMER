import React, { useState } from "react";
import { useAddress } from "@/context/AddressContext";
import AddressSection from "../../address/components/AddressSection";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import bookingService from "@/services/booking.service";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FaMoneyBillWave, FaQrcode } from "react-icons/fa";

const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const BookingPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { addresses } = useAddress();

    const service = state?.service;

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("ONLINE");
    const [loading, setLoading] = useState(false);

    const paymentOptions = [
        { id: "ONLINE", label: "UPI / Online Payment", icon: <FaQrcode /> },
        { id: "COD", label: "Cash on Service", icon: <FaMoneyBillWave /> },
    ];

    if (!service) {
        return (
            <div className="p-10 text-center">
                <p className="text-lg font-semibold">Invalid booking access</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 text-indigo-600 underline"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const handleBooking = async () => {
        if (!selectedAddressId) return toast.error("Select address");
        if (!date) return toast.error("Select date");
        if (!timeSlot) return toast.error("Select time slot");

        try {
            setLoading(true);

            const res = await bookingService.create({
                service_id: Number(service.id),
                address_id: Number(selectedAddressId),
                scheduled_date: date,
                time_slot: timeSlot,
                notes,
                payment_method: paymentMethod,
                total_amount: service.price
            });

            const data = res.data.data;

            if (paymentMethod === "COD") {
                toast.success("Booking created!");
                navigate(`/booking-success`);
                return;
            }

            const isLoaded = await loadRazorpay();
            if (!isLoaded) return toast.error("Payment SDK failed");

            const rzp = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.razorpayOrder.amount,
                currency: "INR",
                name: "MarkCare",
                description: service.name,
                order_id: data.razorpayOrder.id,

                handler: async (res) => {
                    try {
                        await bookingService.verifyPayment({
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_signature: res.razorpay_signature,
                        });

                        toast.success("Payment successful!");
                        navigate(`/booking-success`);
                    } catch {
                        toast.error("Verification failed");
                    }
                },

                modal: {
                    ondismiss: () => toast("Payment cancelled"),
                },
            });

            rzp.open();

        } catch (err) {
            toast.error(err?.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-32">
            <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDE */}
                <div className="lg:col-span-8 space-y-6">

                    {/* SERVICE CARD */}
                    <div className="bg-white p-5 rounded-2xl border flex gap-5 items-center shadow-sm">
                        <img
                            src={service.image}
                            alt={service.name}
                            className="w-24 h-24 object-cover rounded-xl border"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {service.name}
                            </h2>
                            <p className="text-indigo-600 font-bold text-lg mt-1">
                                ₹{service.price}
                            </p>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <AddressSection
                        addresses={addresses}
                        selectedAddress={selectedAddressId}
                        onSelect={setSelectedAddressId}
                    />

                    {/* SCHEDULE */}
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">Schedule Service</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />

                            <select
                                value={timeSlot}
                                onChange={(e) => setTimeSlot(e.target.value)}
                                className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Time Slot</option>
                                <option>10:00 AM - 12:00 PM</option>
                                <option>12:00 PM - 2:00 PM</option>
                                <option>2:00 PM - 4:00 PM</option>
                                <option>4:00 PM - 6:00 PM</option>
                            </select>
                        </div>
                    </div>

                    {/* NOTES */}
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3">Additional Notes</h3>
                        <textarea
                            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            rows={4}
                            placeholder="Any special instructions..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {/* PAYMENT */}
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">Payment Method</h3>

                        <div className="grid gap-3">
                            {paymentOptions.map((opt) => (
                                <div
                                    key={opt.id}
                                    onClick={() => setPaymentMethod(opt.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition 
                                    ${paymentMethod === opt.id
                                            ? "border-indigo-600 bg-indigo-50"
                                            : "hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-lg text-indigo-600">
                                            {opt.icon}
                                        </div>
                                        <span className="font-medium">{opt.label}</span>
                                    </div>
                                    {paymentMethod === opt.id && (
                                        <FiCheckCircle className="text-indigo-600" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE (SUMMARY) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 bg-white p-6 rounded-2xl border shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Service</span>
                            <span>{service.name}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                            <span>Date</span>
                            <span>{date || "-"}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>Time</span>
                            <span>{timeSlot || "-"}</span>
                        </div>

                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{service.price}</span>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={loading}
                            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500 transition"
                        >
                            {loading ? "Processing..." : "Confirm Booking"}
                            <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;