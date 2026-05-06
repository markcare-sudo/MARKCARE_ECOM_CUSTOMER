import React, { useState } from "react";
import { useAddress } from "@/context/AddressContext";
import AddressSection from "../../address/components/AddressSection";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import bookingService from "@/services/booking.service";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { FaMoneyBillWave, FaQrcode } from "react-icons/fa";

// Razorpay loader
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
    const { state } = useLocation(); // ✅ FIX
    const navigate = useNavigate();
    const { addresses } = useAddress();

    const service = state?.service; // ✅ service from ProductCard

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

    // ❌ safety: direct access should not break
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
                service_id: Number(service.id),          // ✅ FIX
                address_id: Number(selectedAddressId),   // ✅ FIX
                scheduled_date: date,
                time_slot: timeSlot,
                notes,
                payment_method: paymentMethod,
                total_amount: service.price              // ✅ IMPORTANT
            });

            const data = res.data.data;

            // ✅ CASH ON SERVICE
            if (paymentMethod === "COD") {
                toast.success("Booking created!");
                navigate(`/booking-success/${data.booking.id}`);
                return;
            }

            // ✅ ONLINE PAYMENT
            const isLoaded = await loadRazorpay();
            if (!isLoaded) return toast.error("Payment SDK failed");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.razorpayOrder.amount,
                currency: "INR",
                name: "MarkCare",
                description: service.name, // ✅ dynamic
                order_id: data.razorpayOrder.id,

                handler: async (res) => {
                    try {
                        await bookingService.verifyPayment({
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_signature: res.razorpay_signature,
                        });

                        toast.success("Payment successful!");
                        navigate(`/booking-success/${data.booking.id}`);
                    } catch {
                        toast.error("Verification failed");
                    }
                },

                modal: {
                    ondismiss: () => toast("Payment cancelled"),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAFBFF] min-h-screen pb-32">
            <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">

                {/* ✅ SERVICE SUMMARY (NEW) */}
                <div className="bg-white p-4 rounded-xl border flex gap-4 items-center">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                        <h2 className="font-semibold">{service.name}</h2>
                        <p className="text-gray-600">₹{service.price}</p>
                    </div>
                </div>

                {/* ADDRESS */}
                <AddressSection
                    addresses={addresses}
                    selectedAddress={selectedAddressId}
                    onSelect={setSelectedAddressId}
                />

                {/* DATE + TIME */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-4">Schedule</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border p-3 rounded"
                        />

                        <select
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="border p-3 rounded"
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
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <textarea
                        className="w-full border p-3 rounded"
                        placeholder="Any special instructions..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                {/* PAYMENT */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-4">Payment Method</h3>

                    <div className="space-y-3">
                        {paymentOptions.map((opt) => (
                            <div
                                key={opt.id}
                                onClick={() => setPaymentMethod(opt.id)}
                                className={`p-4 border rounded cursor-pointer flex justify-between ${paymentMethod === opt.id ? "border-indigo-600 bg-indigo-50" : ""
                                    }`}
                            >
                                <div className="flex gap-3 items-center">
                                    {opt.icon}
                                    {opt.label}
                                </div>
                                {paymentMethod === opt.id && <FiCheckCircle />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2"
                >
                    {loading ? "Processing..." : "Book Service"}
                    <FiArrowRight />
                </button>

            </div>
        </div>
    );
};

export default BookingPage;