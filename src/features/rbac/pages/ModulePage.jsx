// import { useState } from "react";
// import { useSearchParams } from "react-router-dom"; // 1. Import useSearchParams

// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import Modal from "@/components/ui/Modal";
// import PageHeader from "@/components/ui/PageHeader";

// import ModuleForm from "../components/ModuleForm";
// import ModulesTable from "../components/ModulesTable";
// import FeatureForm from "../components/FeatureForm";
// import FeaturesTable from "../components/FeaturesTable";

// import { useModules } from "@/context/ModulesContext";
// import { useFeatures } from "@/context/FeatureContext";

// import ApiEmpty from "@/components/ui/ApiEmpty";
// import ApiFailure from "@/components/ui/ApiFailure";
// import { Loader } from "@/components/Loader";

// const ModulePage = () => {
//     const {
//         modules = [], fetchModules, fetchModule,
//         loading: modulesLoading, isError: modulesError,
//         error: moduleError
//     } = useModules();

//     const {
//         features = [], fetchFeatures, fetchFeature,
//         loading: featuresLoading, isError: featuresError,
//         error: featureError
//     } = useFeatures();

//     // 2. Initialize Search Params
//     const [searchParams, setSearchParams] = useSearchParams();

//     // 3. Derived State: Get the tab from URL, default to "modules"
//     const tab = searchParams.get("tab") || "modules";

//     const [search, setSearch] = useState("");
//     const [openModuleModal, setOpenModuleModal] = useState(false);
//     const [selectedModule, setSelectedModule] = useState(null);

//     const [openFeatureModal, setOpenFeatureModal] = useState(false);
//     const [selectedFeature, setSelectedFeature] = useState(null);

//     // Filter Logic
//     const filteredModules = modules.filter(m => m?.name?.toLowerCase().includes(search.toLowerCase()));
//     const filteredFeatures = features.filter(f => f?.name?.toLowerCase().includes(search.toLowerCase()));

//     /**
//      * URL HANDLER: Updates the URL instead of local state
//      */
//     const handleTabChange = (newTab) => {
//         setSearchParams({ tab: newTab });
//         setSearch(""); // Clear search when switching tabs
//     };

//     const renderTabContent = () => {
//         if (tab === "modules") {
//             switch (true) {
//                 case modulesLoading: return <Loader />;
//                 case modulesError: return <ApiFailure error={moduleError} message="Error loading modules" onRetry={fetchModules} />;
//                 case filteredModules.length === 0: return <ApiEmpty message={search ? "No modules match your search" : "No modules available"} />;
//                 default: return <ModulesTable modules={filteredModules} openModulePopup={openModulePopup} />;
//             }
//         }

//         if (tab === "features") {
//             switch (true) {
//                 case featuresLoading: return <Loader />;
//                 case featuresError: return <ApiFailure error={featureError} message="Error loading features" onRetry={fetchFeatures} />;
//                 case filteredFeatures.length === 0: return <ApiEmpty message={search ? "No features match your search" : "No features available"} />;
//                 default: return <FeaturesTable features={filteredFeatures} openFeaturePopup={openFeaturePopup} />;
//             }
//         }
//     };

//     // Modal handlers...
//     const openModulePopup = async (module = null) => {
//         if (module?.id) {
//             const fullModule = await fetchModule(module?.id);
//             setSelectedModule(fullModule);
//         } else {
//             setSelectedModule(null);
//         }
//         setOpenModuleModal(true);
//     };

//     const openFeaturePopup = async (feature = null) => {
//         setOpenFeatureModal(true);
//         if (feature?.id) {
//             const fullFeature = await fetchFeature(feature?.id);
//             setSelectedFeature(fullFeature);
//         } else {
//             setSelectedFeature(null);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <PageHeader title="Modules & Features" subtitle="Manage system modules and their features" />

//             {/* 4. Updated Tabs to call handleTabChange */}
//             <div className="flex gap-6 border-b text-sm font-medium">
//                 <button
//                     onClick={() => handleTabChange("modules")}
//                     className={`pb-2 cursor-pointer transition-colors ${tab === "modules" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
//                 >
//                     MODULES
//                 </button>
//                 <button
//                     onClick={() => handleTabChange("features")}
//                     className={`pb-2 cursor-pointer transition-colors ${tab === "features" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
//                 >
//                     FEATURES
//                 </button>
//             </div>

//             {/* Search & Actions */}
//             <div className="flex justify-between items-center">
//                 <Input
//                     placeholder={`Search ${tab}...`}
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-64"
//                 />
//                 <Button variant="primary" onClick={tab === "modules" ? () => openModulePopup() : () => openFeaturePopup()}>
//                     + Create {tab === "modules" ? "Module" : "Feature"}
//                 </Button>
//             </div>

//             <div className="min-h-[400px]">
//                 {renderTabContent()}
//             </div>

//             {/* Modals */}
//             <Modal isOpen={openModuleModal} onClose={() => setOpenModuleModal(false)} title={selectedModule ? "Edit Module" : "Create Module"}>
//                 <ModuleForm initialData={selectedModule} onSuccess={() => { setOpenModuleModal(false); fetchModules(); }} />
//             </Modal>

//             <Modal isOpen={openFeatureModal} onClose={() => setOpenFeatureModal(false)} title={selectedFeature?.id ? "Edit Feature" : "Create Feature"}>
//                 <FeatureForm initialData={selectedFeature} modules={modules} onSuccess={() => { setOpenFeatureModal(false); fetchFeatures(); }} />
//             </Modal>
//         </div>
//     );
// };

// export default ModulePage;








import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import ModuleForm from "../components/ModuleForm";
import ModulesTable from "../components/ModulesTable";
import { useModules } from "@/context/ModulesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import ModuleFilters from "../components/ModuleFilters";

const ModulesPage = () => {
    // Note: 'modules' should now represent the API-filtered list from context
    const { modules = [], fetchModules, fetchModule, loading, isError, error } = useModules();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. PARSE FILTERS FROM URL
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || ""
    }), [searchParams]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedModule, setSelectedModule] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
    // This calls the backend whenever the URL parameters change
    useEffect(() => {
        fetchModules(filters);
    }, [filters, fetchModules]);

    // ✅ 3. SYNC MODAL DATA BASED ON URL ID
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchModule(editId);
                setSelectedModule(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedModule(null); // ✅ Corrected reference
        }
    }, [modalType, editId]);

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
            else params.delete(key);
        });
        setSearchParams(params, { replace: true });
    };

    const openModulePopup = (module = null) => {
        const params = new URLSearchParams(searchParams);
        if (module?.id) {
            params.set("modal", "edit");
            params.set("id", module.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeModulePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    /** ERROR STATE **/
    if (isError) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure error={error} message="Error loading modules" onRetry={() => fetchModules(filters)} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="System Modules"
                subtitle="Manage high-level platform modules"
                breadcrumb="RBAC / Modules Management"
                action={
                    <>
                        <Button variant="outline" onClick={() => fetchModules(filters)} disabled={loading} className="flex items-center gap-2">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openModulePopup()}>
                            + Create Module
                        </Button>
                    </>
                }
            />

            <ModuleFilters filters={filters} onFilterChange={updateFilters} />

            <div className="min-h-[400px] relative">
                {/* Overlay Loader for background API refreshes */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {modules.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty message={filters.search ? "No modules match your search" : "No modules available"} />
                    </div>
                ) : (
                    <ModulesTable modules={modules} openModulePopup={openModulePopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeModulePopup}
                title={modalType === "edit" ? "Edit Module" : "Create Module"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 flex justify-center"><Loader size="sm" /></div>
                ) : (
                    <ModuleForm
                        initialData={selectedModule}
                        onSuccess={() => {
                            closeModulePopup();
                            fetchModules(filters);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ModulesPage;