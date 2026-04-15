import React, { useEffect } from "react";
import { useProducts } from "@/context/ProductContext";
import { FiTool, FiCheckCircle, FiSettings, FiZap, FiActivity } from "react-icons/fi";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";

const HomePage = () => {
    const { products = [], loading, fetchCatalog } = useProducts();

    // MarkCare Logic: Filter by your type ENUM
    // Using the data you provided: "PRODUCT" for the unit, "SERVICE" for AMC/Repair
    const featuredProducts = products.filter(p => p.type === "PRODUCT").slice(0, 8);
    const serviceItems = products.filter(p => p.type === "SERVICE").slice(0, 4);

    useEffect(() => {
        fetchCatalog(); // always load default
    }, [fetchCatalog]);

    return (
        <div className="pb-20 bg-white">
            {/* --- HERO SECTION: Multi-Utility Focus --- */}
            <section className="bg-slate-900 py-24 px-4 mb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-6 border border-blue-600/30">
                            Lifts • RO • AC • Home Solutions
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mt-2 mb-6 tracking-tighter leading-tight">
                            Expert Sales. <br />
                            <span className="text-blue-500 text-6xl md:text-8xl">Elite Service.</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
                            From high-speed elevators to pure drinking water—we provide premium products and 24/7 maintenance support for your facility.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95">
                                Browse Products
                            </button>
                            <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all active:scale-95">
                                Book Maintenance
                            </button>
                        </div>
                    </div>

                    {/* Visual Stats */}
                    <div className="hidden lg:grid grid-cols-2 gap-4 flex-1 max-w-md">
                        {[
                            { label: "AMC Contracts", val: "2,500+" },
                            { label: "Lift Installs", val: "450+" },
                            { label: "Service Techs", val: "80+" },
                            { label: "Response Time", val: "< 2Hrs" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <p className="text-blue-500 text-2xl font-black">{stat.val}</p>
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Tech Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </section>

            <div className="max-w-7xl mx-auto px-4 space-y-24">

                {/* --- QUICK SERVICE CATEGORIES --- */}
                <section>
                    <SectionHeader
                        title="Facility Maintenance"
                        subtitle="Professional AMC and on-call repair services for all your utility systems."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Service Card 1: Lift/Elevator */}
                        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500 cursor-pointer">
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <FiSettings size={32} />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-white">Lift & Elevator AMC</h3>
                            <p className="mt-3 text-sm text-slate-600 group-hover:text-blue-100">Scheduled safety checks and parts replacement for all elevator brands.</p>
                            <button className="mt-6 font-bold text-blue-600 group-hover:text-white underline underline-offset-4">Get Quote</button>
                        </div>

                        {/* Service Card 2: RO/Water */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500 cursor-pointer">
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <FiActivity size={32} />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-white">RO & Water Purifier</h3>
                            <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-400">Regular filter changes and TDS monitoring to ensure pure water.</p>
                            <button className="mt-6 font-bold text-blue-600 group-hover:text-blue-400 underline underline-offset-4">Book Service</button>
                        </div>

                        {/* Service Card 3: HVAC/AC */}
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500 cursor-pointer">
                            <div className="bg-white p-4 rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <FiZap size={32} />
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-white">AC & HVAC Solutions</h3>
                            <p className="mt-3 text-sm text-slate-600 group-hover:text-slate-400">Industrial and residential cooling system repair and gas charging.</p>
                            <button className="mt-6 font-bold text-blue-600 group-hover:text-blue-400 underline underline-offset-4">Request Tech</button>
                        </div>
                    </div>
                </section>

                {/* --- PRODUCTS GRID (Filtered by "PRODUCT") --- */}
                <section>
                    <SectionHeader
                        title="Premium Equipment"
                        subtitle="Buy certified high-performance units from trusted brands with full warranty."
                        linkText="View Catalog"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-10">
                        {loading ? (
                            [1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-slate-50 rounded-2xl animate-pulse" />)
                        ) : (
                            featuredProducts.map(prod => <ProductCard key={prod.id} product={prod} />)
                        )}
                    </div>
                </section>

                {/* --- SERVICES GRID (Filtered by "SERVICE" - e.g. AMC Packages) --- */}
                <section>
                    <SectionHeader
                        title="Service Packages & AMC"
                        subtitle="Pre-paid maintenance plans for peace of mind."
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-10">
                        {serviceItems.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </section>

                {/* --- TRUST BAR --- */}
                <section className="py-12 border-y border-slate-100 flex flex-wrap justify-center gap-10 opacity-60">
                    {['Genuine Spare Parts', 'Qualified Technicians', '24/7 Emergency Line', 'Transparent Pricing'].map((badge) => (
                        <div key={badge} className="flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <FiCheckCircle className="text-blue-600" /> {badge}
                        </div>
                    ))}
                </section>

                {/* --- FINAL CTA --- */}
                <section className="relative rounded-[40px] bg-slate-900 p-12 overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-white text-center lg:text-left">
                            <h2 className="text-4xl font-black">Managing a Commercial Space?</h2>
                            <p className="text-slate-400 mt-3 text-lg max-w-xl">
                                Contact us for customized Multi-Utility AMC contracts for apartments, hospitals, and offices.
                            </p>
                        </div>
                        <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20 active:scale-95">
                            Get Custom Quote
                        </button>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <FiTool size={300} className="rotate-12 translate-x-20 translate-y-20 text-white" />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;