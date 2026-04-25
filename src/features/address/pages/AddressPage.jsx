import { useState } from "react";
import { FiPlus, FiArrowLeft, FiLoader } from "react-icons/fi";
import AddressTable from "../components/AddressTable";
import AddressForm from "../components/AddressForm";
import PageHeader from "@/components/ui/PageHeader"; // Using your PageHeader component
import { useAddress } from "@/context/AddressContext"; // Hook into global address state

const AddressPage = () => {
    // 1. Pull data and methods from our Context
    const {
        addresses = [],
        addAddress,
        updateAddress,
        deleteAddress,
        loading
    } = useAddress();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // 2. Handle Add/Update via Context
    const handleSubmit = async (data) => {
        if (data.id) {
            // Update via API
            await updateAddress(data.id, data);
        } else {
            // Create via API
            await addAddress(data);
        }
        closeForm();
    };

    // 3. Handle Delete via Context
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            await deleteAddress(id);
        }
    };

    const handleEdit = (addr) => {
        setEditData(addr);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditData(null);
    };

    return (
        <div className="pb-10">
            <div className="max-w-7xl mx-auto">
                {/* 4. Integrating your PageHeader */}
                <PageHeader
                    title="Manage Addresses"
                    subtitle="Add, edit or remove your delivery locations"
                    action={
                        !isFormOpen && (
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center gap-2 bg-[#2874f0] text-white px-6 py-2.5 rounded-sm font-bold hover:bg-blue-700 transition-all shadow-sm uppercase text-sm tracking-wide"
                            >
                                <FiPlus /> Add New Address
                            </button>
                        )
                    }
                />

                <div className="mt-6">
                    {/* Content Toggle */}
                    {isFormOpen ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <button
                                onClick={closeForm}
                                className="flex items-center gap-2 text-slate-500 hover:text-[#2874f0] mb-6 font-semibold transition-colors text-sm"
                            >
                                <FiArrowLeft /> BACK TO ADDRESS LIST
                            </button>

                            {/* The Form now receives the submission handler linked to Context */}
                            <AddressForm
                                initialData={editData}
                                onSubmit={handleSubmit}
                                onCancel={closeForm}
                                loading={loading}
                            />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Show a loader if fetching data */}
                            {loading && addresses?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <FiLoader className="animate-spin text-[#2874f0] text-3xl mb-2" />
                                    <p className="text-slate-500 text-sm font-medium">Loading addresses...</p>
                                </div>
                            ) : (
                                <AddressTable
                                    addresses={addresses}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressPage;