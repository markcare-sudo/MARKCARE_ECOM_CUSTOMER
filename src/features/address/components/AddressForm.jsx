import { useState, useEffect } from "react";
import { State, City } from "country-state-city";
import { FiNavigation, FiAlertCircle, FiHome, FiBriefcase } from "react-icons/fi";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";

const AddressForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [errors, setErrors] = useState({}); // New errors state
    const indiaStates = State.getStatesOfCountry("IN");

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        state_code: "",
        latitude: "",
        longitude: "",
        address_type: "HOME",
        ...initialData
    });

    const [availableCities, setAvailableCities] = useState([]);

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    useEffect(() => {
        if (formData.state_code) {
            const cities = City.getCitiesOfState("IN", formData.state_code);
            setAvailableCities(cities);
        } else {
            setAvailableCities([]);
        }
    }, [formData.state_code]);

    // Validation Logic
    const validateForm = () => {
        let newErrors = {};

        if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";

        // Phone: Basic 10 digit check (assuming +91 is handled by PhoneInput)
        if (!formData.phone || formData.phone.length < 10) {
            newErrors.phone = "Enter a valid 10-digit mobile number";
        }

        // Pincode: Exactly 6 digits
        if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
        }

        if (!formData.state) newErrors.state = "Please select a state";
        if (!formData.city) newErrors.city = "Please select a city";
        if (!formData.locality.trim()) newErrors.locality = "Locality/Area is required";
        if (!formData.address.trim()) newErrors.address = "Address details are required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleStateChange = (e) => {
        const stateName = e.target.value;
        const selectedState = indiaStates.find(s => s.name === stateName);

        setFormData(prev => ({
            ...prev,
            state: stateName,
            state_code: selectedState ? selectedState.isoCode : "",
            city: ""
        }));
        if (errors.state) setErrors(prev => ({ ...prev, state: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // Helper to render error message
    const ErrorMsg = ({ field }) => errors[field] ? (
        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <FiAlertCircle size={12} /> {errors[field]}
        </span>
    ) : null;

    return (
        <form onSubmit={handleSubmit} className="bg-white md:p-8 rounded p-2 md:border border-slate-100 md:shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
                {initialData?.id ? "Edit Address" : "Add New Address"}
            </h3>

            {/* Use Current Location */}
            <div className="mb-8">
                <button
                    type="button"
                    onClick={() => {/* logic from your original code */ }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-50 text-indigo-600 rounded border-2 border-dashed border-indigo-200 font-semibold hover:bg-indigo-100 transition-all"
                >
                    <FiNavigation className={loadingLocation ? "animate-pulse" : ""} />
                    {loadingLocation ? "Locating..." : "Use Current Location"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        error={!!errors.full_name} // Assuming your Input component handles 'error' prop
                    />
                    <ErrorMsg field="full_name" />
                </div>

                <div>
                    <PhoneInput
                        label="Mobile"
                        value={formData.phone}
                        onChange={(val) => handleInputChange('phone', val)}
                    />
                    <ErrorMsg field="phone" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <select
                        value={formData.state}
                        onChange={handleStateChange}
                        className={`w-full border rounded px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${errors.state ? 'border-red-500' : 'border-slate-200'}`}
                    >
                        <option value="">Select State</option>
                        {indiaStates.map(state => (
                            <option key={state.isoCode} value={state.name}>{state.name}</option>
                        ))}
                    </select>
                    <ErrorMsg field="state" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!formData.state}
                        className={`w-full border rounded px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-50 ${errors.city ? 'border-red-500' : 'border-slate-200'}`}
                    >
                        <option value="">{formData.state ? "Select City" : "Select State first"}</option>
                        {availableCities.map(city => (
                            <option key={`${city.name}-${city.latitude}`} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <ErrorMsg field="city" />
                </div>

                <div>
                    <Input
                        label="Pincode"
                        placeholder="6 digits"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                    <ErrorMsg field="pincode" />
                </div>

                <div>
                    <Input
                        label="Locality"
                        placeholder="Area/Sector"
                        value={formData.locality}
                        onChange={(e) => handleInputChange('locality', e.target.value)}
                    />
                    <ErrorMsg field="locality" />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Address</label>
                    <textarea
                        rows="3"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full border rounded px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.address ? 'border-red-500' : 'border-slate-200'}`}
                        placeholder="House No, Street, Landmark..."
                    />
                    <ErrorMsg field="address" />
                </div>
            </div>

            {/* Address Type Selection */}
            <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">Address Type</label>
                <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.address_type === 'HOME' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                        <input
                            type="radio"
                            name="address_type"
                            className="hidden"
                            checked={formData.address_type === 'HOME'}
                            onChange={() => handleInputChange('address_type', 'HOME')}
                        />
                        <FiHome size={18} />
                        <span className="font-bold">Home</span>
                    </label>

                    <label className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.address_type === 'WORK' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>
                        <input
                            type="radio"
                            name="address_type"
                            className="hidden"
                            checked={formData.address_type === 'WORK'}
                            onChange={() => handleInputChange('address_type', 'WORK')}
                        />
                        <FiBriefcase size={18} />
                        <span className="font-bold">Work</span>
                    </label>
                </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                    type="submit"
                    className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg order-1 sm:order-none"
                >
                    {initialData?.id ? "Update Address" : "Save Address"}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="bg-white text-slate-400 px-6 py-4 font-bold">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default AddressForm;