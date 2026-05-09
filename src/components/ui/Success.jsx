export default function BookingSuccessScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <SuccessCard />
        </div>
    );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SuccessCard() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] max-w-lg w-full p-10 text-center"
        >
            {/* Floating Sparkles */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-5 -left-5"
            >
                <Sparkles className="text-yellow-400 w-10 h-10" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -bottom-5 -right-5"
            >
                <Sparkles className="text-emerald-400 w-10 h-10" />
            </motion.div>

            {/* Success Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 10, delay: 0.2 }}
                className="flex justify-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-green-400/30 blur-2xl animate-ping" />
                    <CheckCircle2 className="relative w-28 h-28 text-green-500 drop-shadow-xl" strokeWidth={1.5} />
                </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-extrabold text-gray-900 mt-8"
            >
                Booking Successful
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-gray-500 mt-4 text-lg leading-relaxed"
            >
                Your service booking & payment were completed successfully.
                Our team will contact you shortly.
            </motion.p>

            {/* Countdown */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-50 border border-green-100 text-green-700 font-semibold shadow-sm">
                    <Home className="w-5 h-5" />
                    Redirecting to home in {countdown}s
                </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mt-8 w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                />
            </div>

            {/* Button */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300"
            >
                Go To Home
            </motion.button>
        </motion.div>
    );
}
