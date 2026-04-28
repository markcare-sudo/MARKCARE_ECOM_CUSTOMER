const SlotPicker = ({ onSelect }) => {
    const slots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];
    const [selectedSlot, setSelectedSlot] = useState("");

    return (
        <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                Select Time Slot
            </h4>
            <div className="grid grid-cols-3 gap-3">
                {slots.map((slot) => (
                    <button
                        key={slot}
                        type="button"
                        onClick={() => {
                            setSelectedSlot(slot);
                            onSelect(slot);
                        }}
                        className={`py-3 rounded-xl border-2 font-bold transition-all ${selectedSlot === slot
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                            }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlotPicker;