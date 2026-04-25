import { useState } from "react";
import { FiPlus, FiHome, FiBriefcase, FiCheck } from "react-icons/fi";
import AddressForm from "./AddressForm"; // Import the reusable component

const AddressSection = ({ addresses, selectedAddress, onSelect, onAddAddress }) => {
    const [showForm, setShowForm] = useState(false);

    const handleFormSubmit = (data) => {
        onAddAddress(data); // Pass data back to parent/API
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
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                    {showForm ? "View Saved" : <><FiPlus /> Add New</>}
                </button>
            </div>

            {!showForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            onClick={() => onSelect(addr.id)}
                            className={`p-5 rounded border-2 cursor-pointer transition-all ${selectedAddress === addr.id ? "border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50" : "border-slate-100 bg-white"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-white rounded-lg border border-slate-100">
                                    {addr.type === "WORK" ? <FiBriefcase className="text-indigo-600" /> : <FiHome className="text-indigo-600" />}
                                </div>
                                {selectedAddress === addr.id && <FiCheck className="text-indigo-600" />}
                            </div>
                            <p className="font-bold text-slate-800">{addr.name}</p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
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