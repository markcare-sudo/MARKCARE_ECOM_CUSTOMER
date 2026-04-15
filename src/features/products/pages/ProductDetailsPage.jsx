import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import {
    FiShoppingCart,
    FiCalendar,
    FiChevronRight,
    FiShield,
    FiTruck,
    FiHeart,
    FiShare2,
    FiRepeat,
    FiCheckCircle,
} from "react-icons/fi";

const Section = ({ title, children, className = "" }) => (
    <section className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}>
        <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
    </section>
);

const ImageGallery = ({ images = [] }) => {
    const primary = images.find((i) => i.is_primary) ?? images[0];
    const [activeUrl, setActiveUrl] = useState(primary?.url ?? primary?.image_url ?? "");

    return (
        <div className="flex flex-col lg:flex-row-reverse gap-3">
            <div className="flex-1 bg-white rounded-2xl overflow-hidden aspect-square flex items-center justify-center border border-gray-100 relative group">
                <img
                    src={activeUrl}
                    alt="Product"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => {
                    const url = img.url ?? img.image_url;
                    return (
                        <button
                            key={i}
                            onClick={() => setActiveUrl(url)}
                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeUrl === url ? "border-blue-500 shadow-sm" : "border-transparent bg-gray-50"
                                }`}
                        >
                            <img src={url} alt="Thumbnail" className="w-full h-full object-contain" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const ProductServiceDetailsPage = () => {
    const { slug } = useParams();
    const { products } = useProducts();
    const [isLiked, setIsLiked] = useState(false);

    const product = products.find((p) => p.slug === slug);

    if (!product) return <div className="p-20 text-center text-gray-500">Product not found</div>;

    const isService = product.type === "SERVICE";
    const specs = product.specifications ?? product.common_specifications ?? {};

    // Share Handler
    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                url: window.location.href,
            });
        } catch (err) {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24 lg:pb-12">
            {/* Breadcrumb */}
            <nav className="max-w-7xl mx-auto px-5 py-4 flex items-center gap-1.5 text-xs text-gray-400">
                <span>Home</span> <FiChevronRight /> <span>{isService ? "Services" : "Shop"}</span>
                <FiChevronRight /> <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </nav>

            <main className="max-w-7xl mx-auto px-5 grid lg:grid-cols-12 gap-10">
                {/* Left: Images */}
                <div className="lg:col-span-7">
                    <ImageGallery images={product.images} />
                </div>

                {/* Right: Actions */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded mb-2">
                                    <FiCheckCircle /> In Stock
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                                <p className="text-sm text-blue-600 font-medium mt-1">{product.brand?.name}</p>
                            </div>

                            {/* Interaction Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`p-2.5 rounded-full border transition-all ${isLiked ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-400 hover:text-gray-600"}`}
                                >
                                    <FiHeart className={isLiked ? "fill-current" : ""} size={20} />
                                </button>
                                <button onClick={handleShare} className="p-2.5 rounded-full border border-gray-100 bg-white text-gray-400 hover:text-gray-600 transition-all">
                                    <FiShare2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-gray-900">₹{product.price?.toLocaleString()}</span>
                                {product.discount_price && (
                                    <span className="text-lg text-gray-400 line-through">₹{product.discount_price.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Free Shipping Included</p>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                            <FiTruck className="text-blue-500" />
                            <span className="text-xs font-semibold text-gray-700">Express Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-50 shadow-sm">
                            <FiShield className="text-blue-500" />
                            <span className="text-xs font-semibold text-gray-700">Secure Checkout</span>
                        </div>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:block space-y-3">
                        <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-transform active:scale-95 ${isService ? "bg-blue-600 text-white" : "bg-gray-900 text-white"}`}>
                            {isService ? <FiCalendar /> : <FiShoppingCart />}
                            {isService ? "Book Service Now" : "Add to Shopping Cart"}
                        </button>

                        {/* Secondary Actions */}
                        <button className="w-full py-3 text-sm font-semibold text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <FiRepeat /> Compare with similar items
                        </button>
                    </div>
                </div>

                {/* Details Sections */}
                <div className="lg:col-span-12 grid lg:grid-cols-2 gap-8 mt-4">
                    <Section title="Description">
                        <p className="text-sm text-gray-500 leading-relaxed italic">
                            {product.description || "No description provided for this item."}
                        </p>
                    </Section>

                    {!isService && Object.keys(specs).length > 0 && (
                        <Section title="Specifications">
                            <div className="grid grid-cols-1 gap-1">
                                {Object.entries(specs).map(([key, val]) => (
                                    <div key={key} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                                        <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-semibold text-gray-700">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 flex items-center gap-4 z-50">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                    <span className="text-xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                </div>
                <button className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white ${isService ? "bg-blue-600" : "bg-black"}`}>
                    {isService ? "Book Now" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

export default ProductServiceDetailsPage;