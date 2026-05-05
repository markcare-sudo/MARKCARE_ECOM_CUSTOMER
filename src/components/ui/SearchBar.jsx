import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({
    placeholder = "Search...",
    onSearch,
    value: externalValue = "", // ✅ value from parent (URL)
    autoFocus = false
}) => {
    const [value, setValue] = useState(externalValue);
    const [debouncedValue, setDebouncedValue] = useState("");
    const isFirstRender = useRef(true);

    // ✅ Sync with URL value
    useEffect(() => {
        setValue(externalValue);
    }, [externalValue]);

    // ✅ Debounce (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, 500);

        return () => clearTimeout(timer);
    }, [value]);

    // ✅ Trigger search AFTER debounce (skip first render)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (debouncedValue.trim()) {
            onSearch(debouncedValue);
        }
    }, [debouncedValue, onSearch]);

    // ✅ Manual submit (Enter / Click)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;

        onSearch(value);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center w-full bg-gray-100 rounded-full border border-gray-200 overflow-hidden focus-within:border-blue-600 focus-within:border-2"
        >
            <input
                type="text"
                autoFocus={autoFocus}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 bg-transparent outline-none text-sm"
            />

            <button
                type="submit"
                className="px-3 py-2 text-gray-500 hover:text-black"
            >
                <FiSearch />
            </button>
        </form>
    );
};

export default SearchBar;




