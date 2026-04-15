import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import UsersTable from "../components/UsersTable";
import UserForm from "../components/UserForm";
import { useUsers } from "@/context/UsersContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import UserFilters from "../components/UserFilters";

const UsersPage = () => {
    // Note: 'users' now represents the server-filtered list from context
    const { users = [], fetchUsers, fetchUser, loading, isError, error } = useUsers();

    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 1. READ FILTERS FROM URL
    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        status: searchParams.get("status") || "",
        startDate: searchParams.get("startDate") || "",
        endDate: searchParams.get("endDate") || ""
    }), [searchParams]);

    const modalType = searchParams.get("modal");
    const editId = searchParams.get("id");

    const [selectedUser, setSelectedUser] = useState(null);
    const [isFetchingSelected, setIsFetchingSelected] = useState(false);

    // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
    // Re-fetches data from the server whenever filters update
    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers]);

    // ✅ 3. SYNC MODAL DATA BASED ON URL ID
    useEffect(() => {
        if (modalType === "edit" && editId) {
            const loadData = async () => {
                setIsFetchingSelected(true);
                const data = await fetchUser(editId);
                setSelectedUser(data);
                setIsFetchingSelected(false);
            };
            loadData();
        } else {
            setSelectedUser(null);
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

    const openUserPopup = (user = null) => {
        const params = new URLSearchParams(searchParams);
        if (user?.id) {
            params.set("modal", "edit");
            params.set("id", user.id);
        } else {
            params.set("modal", "create");
        }
        setSearchParams(params);
    };

    const closeUserPopup = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("modal");
        params.delete("id");
        setSearchParams(params);
    };

    /** ERROR STATE **/
    if (isError) return (
        <div className="h-[70vh] flex items-center justify-center">
            <ApiFailure error={error} message="Failed to load users" onRetry={() => fetchUsers(filters)} />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="User Management"
                subtitle="Manage user accounts and permissions"
                breadcrumb="RBAC / User Management"
                action={
                    <>
                        <Button variant="outline" onClick={() => fetchUsers(filters)} disabled={loading} className="flex items-center gap-2">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Button variant="primary" onClick={() => openUserPopup()}>
                            + Create User
                        </Button>
                    </>
                }
            />

            <UserFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            <div className="min-h-[400px] relative">
                {/* ✅ LOADING OVERLAY (UX improvement for API filtering) */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                {users.length === 0 && !loading ? (
                    <div className="h-[50vh] flex items-center justify-center">
                        <ApiEmpty
                            message={filters.search ? `No users found for "${filters.search}"` : "No users currently in the system"}
                        />
                    </div>
                ) : (
                    <UsersTable users={users} openUserPopup={openUserPopup} />
                )}
            </div>

            <Modal
                isOpen={!!modalType}
                onClose={closeUserPopup}
                title={modalType === "edit" ? "Edit User" : "Create User"}
            >
                {isFetchingSelected ? (
                    <div className="py-10 text-center"><Loader size="sm" /></div>
                ) : (
                    <UserForm
                        initialData={selectedUser}
                        onSuccess={() => {
                            closeUserPopup();
                            fetchUsers(filters); // Refresh current filtered view
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default UsersPage;