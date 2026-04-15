import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";

import FeatureForm from "../components/FeatureForm";
import FeaturesTable from "../components/FeaturesTable";
import { useFeatures } from "@/context/FeatureContext";
import { useModules } from "@/context/ModulesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import FeatureFilters from "../components/FeaturesFilters";

const FeaturesPage = () => {
    // Note: features now comes directly from context, presumably updated by fetchFeatures
    const { features = [], fetchFeatures, fetchFeature, loading, isError, error } = useFeatures();
    const { modules = [] } = useModules();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. PARSE FILTERS FROM URL
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        moduleId: searchParams.get("moduleId") || "",
        status: searchParams.get("status") || "",
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || ""
    }), [searchParams]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. API CALL ON FILTER CHANGE
    // Whenever 'filters' changes (via URL), we re-fetch from the server
    useEffect(() => {
        fetchFeatures(filters);
    }, [filters, fetchFeatures]);

    // ✅ 3. SYNC MODAL DATA
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchFeature(editId);
                setSelectedFeature(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedFeature(null);
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

    const openFeaturePopup = (feature = null) => {
        const params = new URLSearchParams(searchParams);
        if (feature?.id) {
            params.set("modal", "edit");
            params.set("id", feature.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeFeaturePopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    if (isError) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure error={error} message="Error loading features" onRetry={() => fetchFeatures(filters)} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Features"
                subtitle="Manage specific functionalities within modules"
                breadcrumb="RBAC / Features Management"
                action={
                    <>
                        <Button variant="outline" onClick={() => fetchFeatures(filters)} disabled={loading} className="flex items-center gap-2">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openFeaturePopup()}>
                            + Create Feature
                        </Button>
                    </>
                }
            />

            <FeatureFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="min-h-[400px] relative">
                {/* Show loader as overlay or centered while re-fetching API data */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {features.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty message={filters.search ? "No features match your search" : "No features available"} />
                    </div>
                ) : (
                    <FeaturesTable features={features} openFeaturePopup={openFeaturePopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeFeaturePopup}
                title={modalType === "edit" ? "Edit Feature" : "Create Feature"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 text-center"><Loader size="sm" /></div>
                ) : (
                    <FeatureForm
                        initialData={selectedFeature}
                        modules={modules}
                        onSuccess={() => {
                            closeFeaturePopup();
                            fetchFeatures(filters);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default FeaturesPage;