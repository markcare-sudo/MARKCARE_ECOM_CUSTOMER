import { useState } from "react";
import { FiPlus, FiHome, FiBriefcase, FiCheck, FiMapPin } from "react-icons/fi";
import AddressForm from "./AddressForm";

const AddressSection = ({ addresses, selectedAddress, onSelect, onAddAddress }) => {
    const [showForm, setShowForm] = useState(false);

    const handleFormSubmit = (data) => {
        onAddAddress(data);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">Shipping Address</h2>
                    <p className="text-slate-500 text-sm">Choose where to deliver your order</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm font-medium border border-blue-600 p-2 rounded cursor-pointer text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    {showForm ? "View Saved" : <><FiPlus /> Add New</>}
                </button>
            </div>

            {!showForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses?.map((addr) => (
                        <div
                            key={addr.id}
                            onClick={() => onSelect(addr.id)}
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id
                                ? "border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50"
                                : "border-slate-100 bg-white hover:border-slate-200"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                    {/* Corrected: address_type instead of type */}
                                    {addr.address_type === "WORK" ? (
                                        <FiBriefcase className="text-indigo-600" />
                                    ) : addr.address_type === "HOME" ? (
                                        <FiHome className="text-indigo-600" />
                                    ) : (
                                        <FiMapPin className="text-indigo-600" />
                                    )}
                                </div>
                                {selectedAddress === addr.id && (
                                    <div className="bg-indigo-600 rounded-full p-1">
                                        <FiCheck className="text-white text-xs" />
                                    </div>
                                )}
                            </div>

                            {/* Corrected: full_name instead of name */}
                            <p className="font-bold text-slate-800">{addr.full_name}</p>
                            <p className="text-xs font-medium text-slate-400 mb-2">{addr.phone}</p>

                            {/* Corrected: address instead of street */}
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {addr.address}, {addr.locality},<br />
                                {addr.city}, {addr.state} - <span className="font-semibold text-slate-700">{addr.pincode}</span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <AddressForm
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default AddressSection;