// import { useState, useEffect, useRef } from "react";
// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import Select from "@/components/ui/Select";

// const GenericFilter = ({ fields, onFilterChange, onAdd, addLabel = "Add New" }) => {
//     // Initialize state dynamically based on field names
//     const [filters, setFilters] = useState(() =>
//         fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
//     );

//     const isFirstRender = useRef(true);

//     const handleChange = (name, value) => {
//         setFilters((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClear = () => {
//         const cleared = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
//         setFilters(cleared);
//     };

//     useEffect(() => {
//         if (isFirstRender.current) {
//             isFirstRender.current = false;
//             return;
//         }

//         const timer = setTimeout(() => {
//             onFilterChange(filters);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [filters, onFilterChange]);

//     return (
//         <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//                 {fields.map((field) => (
//                     <div key={field.name} className="w-full">
//                         {field.type === "select" ? (
//                             <div className="space-y-1">
//                                 {field.label && <label className="text-sm text-gray-600">{field.label}</label>}
//                                 <select
//                                     className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
//                                     value={filters[field.name]}
//                                     onChange={(e) => handleChange(field.name, e.target.value)}
//                                 >
//                                     {field.options.map((opt) => {
//                                         const isObject = typeof opt === "object" && opt !== null;
//                                         const val = isObject ? opt.value : opt;
//                                         const label = isObject ? opt.label : opt;
//                                         return (
//                                             <option key={isObject ? val : opt} value={val}>
//                                                 {label}
//                                             </option>
//                                         );
//                                     })}
//                                 </select>
//                             </div>
//                         ) : (
//                             <Input
//                                 label={field.label}
//                                 type={field.type || "text"}
//                                 placeholder={field.placeholder}
//                                 value={filters[field.name]}
//                                 onChange={(e) => handleChange(field.name, e.target.value)}
//                             />
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <div className="flex justify-end pt-2">
//                 {/* Clear Filters */}
//                 <div className="flex justify-end">
//                     <Button variant="outline" size="md" onClick={handleClear}>
//                         Clear All Filters
//                     </Button>
//                 </div>

//                 {onAdd && (
//                     <Button variant="primary" onClick={onAdd}>
//                         {addLabel}
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default GenericFilter;


import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const GenericFilter = ({ fields, filters: urlFilters, onFilterChange, onAdd, addLabel = "Add New" }) => {
    // ✅ localState allows for smooth typing before the URL updates (debouncing)
    const [localState, setLocalState] = useState(urlFilters);

    // ✅ Keep local state in sync if URL changes externally (e.g. browser back button)
    useEffect(() => {
        setLocalState(urlFilters);
    }, [urlFilters]);

    // ✅ Handle Change with optional Debounce logic
    const handleChange = (name, value, debounce = false) => {
        const newState = { ...localState, [name]: value };
        setLocalState(newState);

        // If it's a select or date, update URL immediately. 
        // If it's text, the useEffect below will handle the debounce.
        if (!debounce) {
            onFilterChange(newState);
        }
    };

    // ✅ Debounce effect for text/search inputs
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only trigger if localState actually differs from the URL state
            if (JSON.stringify(localState) !== JSON.stringify(urlFilters)) {
                onFilterChange(localState);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [localState, onFilterChange, urlFilters]);

    const handleClear = () => {
        const cleared = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
        setLocalState(cleared);
        onFilterChange(cleared);
    };

    return (
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {fields.map((field) => (
                    <div key={field.name} className="w-full">
                        <div className="space-y-1">
                            {field.label && (
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    {field.label}
                                </label>
                            )}

                            {field.type === "select" ? (
                                <select
                                    className="w-full h-10 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={localState[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value, false)}
                                >
                                    <option value="">All {field.label}</option>
                                    {field.options.map((opt) => {
                                        const isObject = typeof opt === "object" && opt !== null;
                                        const val = isObject ? opt.value : opt;
                                        const label = isObject ? opt.label : opt;
                                        return (
                                            <option key={val} value={val}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            ) : (
                                <Input
                                    type={field.type || "text"}
                                    placeholder={field.placeholder}
                                    value={localState[field.name] || ""}
                                    // Debounce if it's a text input
                                    onChange={(e) => handleChange(field.name, e.target.value, field.type !== "date")}
                                    className="h-10"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
                {/* Clear Filters */}
                <div className="flex justify-end">
                    <Button variant="outline" size="md" onClick={handleClear}>
                        Clear All Filters
                    </Button>
                </div>

                {onAdd && (
                    <Button variant="primary" onClick={onAdd}>
                        {addLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GenericFilter;