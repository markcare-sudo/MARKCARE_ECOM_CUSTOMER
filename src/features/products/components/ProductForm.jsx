// import { useState, useEffect, useRef } from "react";
// import Input from "@/components/ui/Input";
// import Button from "@/components/ui/Button";
// import { useProducts } from "@/context/ProductContext";
// import { useBrands } from "@/context/BrandContext";
// import { FiPlus, FiTrash2, FiUpload, FiCheckCircle } from "react-icons/fi";

// const ProductForm = ({ onSuccess, initialData }) => {
//     const { createProduct, updateProduct } = useProducts();
//     const { brands = [] } = useBrands();
//     const fileInputRef = useRef(null);

//     // --- State Management ---
//     const [form, setForm] = useState({
//         name: "",
//         brand_id: "",
//         category_id: "",
//         type: "PRODUCT",
//         common_specifications: [{ key: "Manufacturer", value: "Tata Industries" }, { key: "Warranty", value: "1 Year" }],
//         variants: [
//             { sku: "LAP-440V-16GB", price: "89999", stock: "10", isDefault: true, specs: "RAM: 16GB, Voltage: 440V" }
//         ],
//         images: [] // Stores { file, preview, type: 'global' | 'variant' }
//     });

//     const [loading, setLoading] = useState(false);
//     const isEdit = !!initialData;

//     // --- Handlers: Product Details ---
//     const handleChange = (field, value) => {
//         setForm((prev) => ({ ...prev, [field]: value }));
//     };

//     // --- Handlers: Specifications ---
//     const addSpecification = () => {
//         setForm(prev => ({
//             ...prev,
//             common_specifications: [...prev.common_specifications, { key: "", value: "" }]
//         }));
//     };

//     const updateSpec = (index, field, value) => {
//         const newSpecs = [...form.common_specifications];
//         newSpecs[index][field] = value;
//         setForm(prev => ({ ...prev, common_specifications: newSpecs }));
//     };

//     // --- Handlers: Variants ---
//     const addVariant = () => {
//         setForm(prev => ({
//             ...prev,
//             variants: [...prev.variants, { sku: "", price: "", stock: "", isDefault: false, specs: "" }]
//         }));
//     };

//     // --- Handlers: Images ---
//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         const newImages = files.map(file => ({
//             file,
//             preview: URL.createObjectURL(file),
//             label: form.images.length === 0 ? "Primary Image (Global)" : "Variant Image"
//         }));
//         setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
//     };

//     const removeImage = (index) => {
//         setForm(prev => ({
//             ...prev,
//             images: prev.images.filter((_, i) => i !== index)
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // In a real app, you would use FormData for image uploads
//         const formData = new FormData();
//         Object.keys(form).forEach(key => {
//             if (key !== 'images') formData.append(key, JSON.stringify(form[key]));
//         });
//         form.images.forEach(img => formData.append('files', img.file));

//         try {
//             if (isEdit) {
//                 await updateProduct(initialData.id, formData);
//             } else {
//                 await createProduct(formData);
//             }
//             if (onSuccess) onSuccess();
//         } catch (error) {
//             console.error("Submission failed:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-8 overflow-y-auto max-h-[90vh]">

//             {/* Header Actions */}
//             <div className="flex justify-between items-center border-b pb-4">
//                 <h2 className="text-xl font-semibold text-slate-800">{isEdit ? "Edit Product" : "New Product"}</h2>
//                 <div className="flex gap-2">
//                     <Button type="button" variant="secondary" onClick={onSuccess}>Cancel</Button>
//                     <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
//                         {loading ? "Saving..." : "Save"}
//                     </Button>
//                 </div>
//             </div>

//             {/* Section 1: Product Details */}
//             <section className="space-y-4">
//                 <div className="flex items-center gap-2">
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Details</span>
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-1.5">Product Name</label>
//                         <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter product name..." required />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium mb-1.5">Brand</label>
//                         <select value={form.brand_id} onChange={(e) => handleChange("brand_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                             <option value="">Select Brand</option>
//                             {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium mb-1.5">Category</label>
//                         <select value={form.category_id} onChange={(e) => handleChange("category_id", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
//                             <option value="">Select Category</option>
//                             <option value="electronics">Electronics</option>
//                             <option value="apparel">Apparel</option>
//                         </select>
//                     </div>

//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium mb-1.5">Product Type</label>
//                         <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
//                             <option value="PRODUCT">PRODUCT</option>
//                             <option value="SERVICE">SERVICE</option>
//                         </select>
//                     </div>
//                 </div>
//             </section>

//             {/* Section 2: Common Specifications */}
//             <section className="space-y-4">
//                 <div className="flex items-center gap-2">
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Common Specifications</span>
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                 </div>
//                 <p className="text-xs text-gray-500">Common specs applied to all variants (e.g. Material, Origin)</p>

//                 <div className="border rounded-md overflow-hidden">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 border-b">
//                             <tr>
//                                 <th className="px-4 py-2 font-medium">Specification</th>
//                                 <th className="px-4 py-2 font-medium">Value</th>
//                                 <th className="px-4 py-2 w-10"></th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y">
//                             {form.common_specifications.map((spec, idx) => (
//                                 <tr key={idx}>
//                                     <td className="px-2 py-1"><Input value={spec.key} onChange={(e) => updateSpec(idx, "key", e.target.value)} className="border-none shadow-none" placeholder="e.g. Material" /></td>
//                                     <td className="px-2 py-1"><Input value={spec.value} onChange={(e) => updateSpec(idx, "value", e.target.value)} className="border-none shadow-none" placeholder="e.g. Steel" /></td>
//                                     <td className="px-2 py-1"><button type="button" className="text-gray-400 hover:text-red-500"><FiTrash2 /></button></td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <Button type="button" variant="outline" onClick={addSpecification} className="w-full py-2 border-dashed border-2"><FiPlus className="mr-2" /> Add Specification</Button>
//             </section>

//             {/* Section 3: Product Variants */}
//             <section className="space-y-4">
//                 <div className="flex items-center gap-2">
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Variants</span>
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                 </div>

//                 <div className="border rounded-md overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 border-b text-gray-600">
//                             <tr>
//                                 <th className="px-4 py-3 font-semibold">SKU</th>
//                                 <th className="px-4 py-3 font-semibold">Price</th>
//                                 <th className="px-4 py-3 font-semibold">Stock</th>
//                                 <th className="px-4 py-3 font-semibold">Default</th>
//                                 <th className="px-4 py-3 font-semibold">Specifications</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y">
//                             {form.variants.map((v, i) => (
//                                 <tr key={i} className="hover:bg-gray-50">
//                                     <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
//                                     <td className="px-4 py-3">₹{Number(v.price).toLocaleString()}</td>
//                                     <td className="px-4 py-3">{v.stock}</td>
//                                     <td className="px-4 py-3">
//                                         <input type="checkbox" checked={v.isDefault} readOnly className="rounded text-blue-600" />
//                                     </td>
//                                     <td className="px-4 py-3 text-gray-500 italic text-xs">{v.specs}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <Button type="button" variant="outline" onClick={addVariant} className="w-full py-2 border-dashed border-2"><FiPlus className="mr-2" /> Add Variant</Button>
//             </section>

//             {/* Section 4: Product Images */}
//             <section className="space-y-4">
//                 <div className="flex items-center gap-2">
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                     <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Product Images</span>
//                     <div className="h-px bg-gray-200 flex-grow"></div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {form.images.map((img, i) => (
//                         <div key={i} className="group relative border rounded-lg p-2 bg-gray-50 flex flex-col items-center">
//                             <img src={img.preview} alt="preview" className="w-full h-32 object-contain mb-2 rounded" />
//                             <p className="text-[10px] font-medium text-gray-500 uppercase text-center">{img.label}</p>
//                             <button
//                                 type="button"
//                                 onClick={() => removeImage(i)}
//                                 className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                                 <FiTrash2 size={12} />
//                             </button>
//                         </div>
//                     ))}

//                     {/* Upload Button Card */}
//                     <div
//                         onClick={() => fileInputRef.current?.click()}
//                         className="border-2 border-dashed border-gray-200 rounded-lg h-44 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
//                     >
//                         <FiUpload className="text-gray-400 text-xl mb-2" />
//                         <span className="text-xs font-medium text-blue-600">Add Image</span>
//                         <input type="file" hidden ref={fileInputRef} multiple onChange={handleImageUpload} accept="image/*" />
//                     </div>
//                 </div>
//             </section>

//         </form>
//     );
// };

// export default ProductForm;













import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiUpload, FiX, FiCheck, FiInfo, FiLayers, FiSettings, FiImage } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
// Assuming you have a Textarea component, otherwise use <textarea>
// import Textarea from "@/components/ui/Textarea";

const ProductForm = ({ onSuccess, initialData, brands, categories }) => {
    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general"); // tabs: general, specs, variants, media

    // --- State Management ---
    const [product, setProduct] = useState({
        name: "",
        slug: "",
        brand_id: "",
        category_id: "",
        type: "PRODUCT",
        description: "",
        is_active: true,
        common_specifications: [{ key: "", value: "" }],
    });

    const [variants, setVariants] = useState([
        {
            sku: "",
            price: "",
            discount_price: "",
            stock_quantity: 0,
            is_default: true,
            variant_specifications: {}, // Changed to object for better JSONB handling
            images: [],
        },
    ]);

    const [globalImages, setGlobalImages] = useState([]);

    // --- Lifecycle: Load Initial Data ---
    useEffect(() => {
        if (initialData) {
            // Map JSONB object back to array for the UI rows
            const specsArray = Object.entries(initialData.common_specifications || {}).map(([key, value]) => ({ key, value }));
            setProduct({ ...initialData, common_specifications: specsArray.length ? specsArray : [{ key: "", value: "" }] });
            if (initialData.variants) setVariants(initialData.variants);
        }
    }, [initialData]);

    // --- Handlers ---
    const handleProductChange = (field, value) => {
        setProduct(prev => {
            const updated = { ...prev, [field]: value };
            if (field === "name" && !isEdit) {
                updated.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
            }
            return updated;
        });
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...product.common_specifications];
        newSpecs[index][field] = value;
        setProduct({ ...product, common_specifications: newSpecs });
    };

    const updateVariantSpec = (vIndex, key, value) => {
        const updated = [...variants];
        updated[vIndex].variant_specifications = {
            ...updated[vIndex].variant_specifications,
            [key]: value
        };
        setVariants(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        // Final JSONB preparation
        const finalCommonSpecs = product.common_specifications.reduce((acc, curr) => {
            if (curr.key.trim()) acc[curr.key] = curr.value;
            return acc;
        }, {});

        const productData = { ...product, common_specifications: finalCommonSpecs };

        formData.append("product", JSON.stringify(productData));
        formData.append("variants", JSON.stringify(variants.map(({ images, ...v }) => v)));

        // Append images logic (remains same as your ref)
        // ... call API ...
        setLoading(false);
    };

    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border overflow-hidden h-[95vh]">

            {/* --- ULTIMATE HEADER --- */}
            <div className="flex items-center justify-between px-8 py-4 border-b bg-white">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                        <FiLayers size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{isEdit ? "Update Catalog" : "New Product Entry"}</h2>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                            <span>Inventory Management</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-blue-500">Universal Schema v2.0</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-slate-500">Preview</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl shadow-lg transition-all active:scale-95">
                        {loading ? "Publishing..." : "Publish Product"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* --- SIDE NAVIGATION --- */}
                <aside className="w-64 border-r bg-slate-50/50 p-4 space-y-2">
                    <NavButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<FiInfo />} label="General Info" />
                    <NavButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')} icon={<FiSettings />} label="Specifications" />
                    <NavButton active={activeTab === 'variants'} onClick={() => setActiveTab('variants')} icon={<FiCheck />} label="Variants & Stock" />
                    <NavButton active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<FiImage />} label="Media Gallery" />
                </aside>

                {/* --- MAIN FORM AREA --- */}
                <form className="flex-1 overflow-y-auto p-10 space-y-12">

                    {/* SECTION: GENERAL INFO */}
                    {activeTab === 'general' && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Basic Information</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="col-span-2">
                                    <label className="label">Product Title</label>
                                    <Input value={product.name} onChange={(e) => handleProductChange("name", e.target.value)} placeholder="e.g. Sony WH-1000XM5 Headphones" />
                                </div>
                                <div>
                                    <label className="label">Brand</label>
                                    <select className="select-input" value={product.brand_id} onChange={e => handleProductChange("brand_id", e.target.value)}>
                                        <option value="">Select Brand</option>
                                        {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Category</label>
                                    <select className="select-input" value={product.category_id} onChange={e => handleProductChange("category_id", e.target.value)}>
                                        <option value="">Select Category</option>
                                        {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Description</label>
                                    <Input
                                        rows={6}
                                        value={product.description}
                                        onChange={e => handleProductChange("description", e.target.value)}
                                        placeholder="Write a detailed product story..."
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* SECTION: SPECIFICATIONS (Universal Key-Value) */}
                    {activeTab === 'specs' && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Technical Specifications</h3>
                                    <p className="text-sm text-slate-500">Common attributes for all variants (e.g., Material, Origin)</p>
                                </div>
                                <Button type="button" onClick={() => setProduct({ ...product, common_specifications: [...product.common_specifications, { key: "", value: "" }] })} variant="outline" size="sm">
                                    <FiPlus className="mr-2" /> Add Spec
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {product.common_specifications.map((spec, i) => (
                                    <div key={i} className="flex gap-4 p-3 bg-white border border-slate-200 rounded-xl items-center shadow-sm">
                                        <Input className="flex-1 border-none shadow-none font-semibold" placeholder="Property (e.g. Material)" value={spec.key} onChange={e => handleSpecChange(i, "key", e.target.value)} />
                                        <div className="h-6 w-px bg-slate-200"></div>
                                        <Input className="flex-1 border-none shadow-none" placeholder="Value (e.g. 100% Cotton)" value={spec.value} onChange={e => handleSpecChange(i, "value", e.target.value)} />
                                        <button type="button" onClick={() => {
                                            const filtered = product.common_specifications.filter((_, idx) => idx !== i);
                                            setProduct({ ...product, common_specifications: filtered });
                                        }} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SECTION: VARIANTS */}
                    {activeTab === 'variants' && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Product Variants</h3>
                                <Button type="button" onClick={() => setVariants([...variants, { sku: "", price: "", stock_quantity: 0, is_default: false, variant_specifications: {}, images: [] }])} className="bg-slate-800 text-white">
                                    <FiPlus className="mr-2" /> Add Variant
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {variants.map((v, i) => (
                                    <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${v.is_default ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-white'}`}>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="col-span-1">
                                                <label className="text-[10px] uppercase font-bold text-slate-400">SKU Code</label>
                                                <Input value={v.sku} onChange={e => updateVariant(i, "sku", e.target.value)} className="mt-1 h-9" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Price</label>
                                                <Input value={v.price} onChange={e => updateVariant(i, "price", e.target.value)} className="mt-1 h-9" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Stock</label>
                                                <Input type="number" value={v.stock_quantity} onChange={e => updateVariant(i, "stock_quantity", e.target.value)} className="mt-1 h-9" />
                                            </div>
                                            <div className="flex items-center justify-end gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="default_v" checked={v.is_default} onChange={() => setVariants(variants.map((item, idx) => ({ ...item, is_default: idx === i })))} />
                                                    <span className="text-xs font-bold text-slate-600">Default</span>
                                                </label>
                                                <button type="button" className="text-slate-400 hover:text-red-500"><FiTrash2 /></button>
                                            </div>
                                            <div className="col-span-4">
                                                <label className="text-[10px] uppercase font-bold text-slate-400">Variant Specs (JSONB)</label>
                                                <Input
                                                    placeholder="e.g. Color: Blue, Size: XL"
                                                    className="mt-1 bg-slate-50"
                                                    onChange={(e) => {
                                                        // Helper to turn "Color: Blue" string into object
                                                        const obj = {};
                                                        e.target.value.split(',').forEach(pair => {
                                                            const [k, val] = pair.split(':');
                                                            if (k && val) obj[k.trim()] = val.trim();
                                                        });
                                                        updateVariant(i, "variant_specifications", obj);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </form>
            </div>
        </div>
    );
};

// Simple Nav Button Sub-component
const NavButton = ({ active, onClick, icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-white text-blue-600 shadow-md border-slate-200' : 'text-slate-500 hover:bg-slate-200/50'
            }`}
    >
        {icon}
        {label}
    </button>
);

export default ProductForm;