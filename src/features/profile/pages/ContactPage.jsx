import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

const ContactPage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Message sent successfully!");
            setLoading(false);
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h1>
                <p className="text-slate-500">Have a question about a service or product? We're here to help.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info Cards */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                            <FiPhone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Call Us</h3>
                            <p className="text-sm text-slate-500">+91 98765 43210</p>
                            <p className="text-xs text-slate-400">Mon-Sat, 9am - 6pm</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="bg-green-50 p-3 rounded-xl text-green-600">
                            <FiMessageCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">WhatsApp</h3>
                            <p className="text-sm text-slate-500">Chat with support</p>
                            <button className="mt-2 text-xs font-bold text-green-600 uppercase tracking-wider">Start Chat</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                            <FiMail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Email</h3>
                            <p className="text-sm text-slate-500">support@yourbrand.com</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded border border-slate-100 shadow-xl">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <input type="text" required placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Phone</label>
                            <input type="number" required placeholder="1234567890" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Subject</label>
                            <input type="text" required placeholder="How can we help?" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Message</label>
                            <textarea rows="4" required placeholder="Tell us more..." className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all"></textarea>
                        </div>
                        <button
                            disabled={loading}
                            className="md:col-span-2 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all disabled:bg-slate-300"
                        >
                            {loading ? "Sending..." : <><FiSend /> Send Message</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;