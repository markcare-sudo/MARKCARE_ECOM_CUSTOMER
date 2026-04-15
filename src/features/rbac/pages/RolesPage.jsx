// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";

// import Button from "@/components/ui/Button";
// import Input from "@/components/ui/Input";
// import Modal from "@/components/ui/Modal";
// import PageHeader from "@/components/ui/PageHeader";

// import RoleForm from "../components/RoleForm";
// import RolesTable from "../components/RolesTable";
// import UsersTable from "../components/UsersTable";
// import UserForm from "../components/UserForm";

// import { useRoles } from "@/context/RolesContext";
// import { useUsers } from "@/context/UsersContext";

// // API State Components
// import ApiEmpty from "@/components/ui/ApiEmpty";
// import ApiFailure from "@/components/ui/ApiFailure";
// import { Loader } from "@/components/Loader";

// const RolesPage = () => {
//   // Destructure states and loading/error flags
//   const { 
//     roles = [], fetchRoles, fetchRole, 
//     loading: rolesLoading, isError: rolesError,
//     error,
//   } = useRoles();

//   const { 
//     users = [], fetchUsers, fetchUser, 
//     loading: usersLoading, isError: usersError 
//   } = useUsers();

//   const [searchParams, setSearchParams] = useSearchParams();
//   const activeTab = searchParams.get("tab") || "roles";

//   const [search, setSearch] = useState("");
//   const [statusTab, setStatusTab] = useState("active");

//   const [openRoleModal, setOpenRoleModal] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);

//   const [openUserModal, setOpenUserModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const changeTab = (tab) => {
//     setSearchParams({ tab });
//     setSearch(""); // Reset search on tab change
//   };

//   // Filter Logic
//   const filteredRoles = roles.filter((role) => {
//     const name = role?.name?.toLowerCase() || "";
//     if (statusTab === "active" && !role.is_active) return false;
//     if (statusTab === "blocked" && role.is_active) return false;
//     return !search || name.includes(search.toLowerCase());
//   });

//   const filteredUsers = users.filter((user) => {
//     const name = user?.name?.toLowerCase() || "";
//     return !search || name.includes(search.toLowerCase());
//   });

//   /**
//    * SWITCH CASE: Dynamic Table Content
//    */
//   const renderTableContent = () => {
//     if (activeTab === "roles") {
//       switch (true) {
//         case rolesLoading:
//           return <Loader />;
//         case rolesError:
//           return <ApiFailure error={error} message="Failed to load roles" onRetry={fetchRoles} />;
//         case filteredRoles.length === 0:
//           return <ApiEmpty message={search ? `No roles found for "${search}"` : "No roles available"} />;
//         default:
//           return <RolesTable roles={filteredRoles} openRolePopup={openRolePopup} />;
//       }
//     }

//     if (activeTab === "users") {
//       switch (true) {
//         case usersLoading:
//           return <Loader />;
//         case usersError:
//           return <ApiFailure error={error} message="Failed to load users" onRetry={fetchUsers} />;
//         case filteredUsers.length === 0:
//           return <ApiEmpty message={search ? `No users found for "${search}"` : "No users available"} />;
//         default:
//           return <UsersTable users={filteredUsers} openUserPopup={openUserPopup} />;
//       }
//     }
//   };

//   // Modal Handlers
//   const openRolePopup = async (role = null) => {
//     if (role?.id) {
//       const fullRole = await fetchRole(role.id);
//       setSelectedRole(fullRole);
//     } else {
//       setSelectedRole(null);
//     }
//     setOpenRoleModal(true);
//   };

//   const openUserPopup = async (user = null) => {
//     if (user?.id) {
//       const fullUser = await fetchUser(user.id);
//       setSelectedUser(fullUser);
//     } else {
//       setSelectedUser(null);
//     }
//     setOpenUserModal(true);
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader title="Access Management" subtitle="Manage platform roles and users" />

//       {/* Main Tabs */}
//       <div className="flex gap-6 border-b text-sm font-medium">
//         <button
//           onClick={() => changeTab("roles")}
//           className={`pb-2 ${activeTab === "roles" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
//         >
//           ROLES
//         </button>
//         <button
//           onClick={() => changeTab("users")}
//           className={`pb-2 ${activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
//         >
//           USERS
//         </button>
//       </div>

//       {/* Search & Action Bar */}
//       <div className="flex justify-between items-center">
//         <Input
//           placeholder={`Search ${activeTab}...`}
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-64"
//         />
//         <Button variant="primary" onClick={activeTab === "roles" ? () => openRolePopup() : () => openUserPopup()}>
//           + Create {activeTab === "roles" ? "Role" : "User"}
//         </Button>
//       </div>

//       {/* Role-Specific Sub-Tabs */}
//       {activeTab === "roles" && !rolesError && !rolesLoading && (
//         <div className="flex gap-6 border-b text-xs font-semibold">
//           <button
//             onClick={() => setStatusTab("active")}
//             className={`pb-2 ${statusTab === "active" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
//           >
//             ACTIVE ({roles.filter((r) => r.is_active).length})
//           </button>
//           <button
//             onClick={() => setStatusTab("blocked")}
//             className={`pb-2 ${statusTab === "blocked" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-400"}`}
//           >
//             BLOCKED ({roles.filter((r) => !r.is_active).length})
//           </button>
//         </div>
//       )}

//       {/* Dynamic Content Rendering */}
//       <div className="min-h-[400px]">
//         {renderTableContent()}
//       </div>

//       {/* Modals */}
//       <Modal isOpen={openRoleModal} onClose={() => setOpenRoleModal(false)} title={selectedRole?.id ? "Edit Role" : "Create Role"}>
//         <RoleForm initialData={selectedRole} onSuccess={() => { setOpenRoleModal(false); fetchRoles(); }} />
//       </Modal>

//       <Modal isOpen={openUserModal} onClose={() => setOpenUserModal(false)} title={selectedUser?.id ? "Edit User" : "Create User"}>
//         <UserForm initialData={selectedUser} onSuccess={() => { setOpenUserModal(false); fetchUsers(); }} />
//       </Modal>
//     </div>
//   );
// };

// export default RolesPage;















import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import RoleForm from "../components/RoleForm";
import RolesTable from "../components/RolesTable";
import { useRoles } from "@/context/RolesContext";

import ApiEmpty from "@/components/ui/ApiEmpty";
import ApiFailure from "@/components/ui/ApiFailure";
import { Loader } from "@/components/Loader";
import { FiRefreshCw } from "react-icons/fi";
import RolesFilters from "../components/RolesFilters";

const RolesPage = () => {
  // roles now represents the server-filtered list from context
  const { roles = [], fetchRoles, fetchRole, loading, isError, error } = useRoles();

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

  const [selectedRole, setSelectedRole] = useState(null);
  const [isFetchingSelected, setIsFetchingSelected] = useState(false);

  // ✅ 2. TRIGGER API FETCH ON FILTER CHANGE
  // This calls the backend whenever searchParams change
  useEffect(() => {
    fetchRoles(filters);
  }, [filters, fetchRoles]);

  // ✅ 3. SYNC MODAL DATA BASED ON URL ID
  useEffect(() => {
    if (modalType === "edit" && editId) {
      const loadData = async () => {
        setIsFetchingSelected(true);
        const data = await fetchRole(editId);
        setSelectedRole(data);
        setIsFetchingSelected(false);
      };
      loadData();
    } else {
      setSelectedRole(null);
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

  const openRolePopup = (role = null) => {
    const params = new URLSearchParams(searchParams);
    if (role?.id) {
      params.set("modal", "edit");
      params.set("id", role.id);
    } else {
      params.set("modal", "create");
    }
    setSearchParams(params);
  };

  const closeRolePopup = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("modal");
    params.delete("id");
    setSearchParams(params);
  };

  if (isError) return (
    <div className="h-[70vh] flex items-center justify-center">
      <ApiFailure error={error} message="Failed to load roles" onRetry={() => fetchRoles(filters)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles Management"
        subtitle="Manage user roles and permissions"
        breadcrumb="RBAC / Roles Management"
        action={
          <>
            <Button variant="outline" onClick={() => fetchRoles(filters)} disabled={loading} className="flex items-center gap-2">
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
            <Button variant="primary" onClick={() => openRolePopup()}>
              + Create Role
            </Button>
          </>
        }
      />

      <RolesFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      <div className="min-h-[400px] relative">
        {/* Loader overlay for better UX during background API fetches */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {roles.length === 0 && !loading ? (
          <div className="h-[50vh] flex items-center justify-center">
            <ApiEmpty
              message={filters.search ? `No roles found for "${filters.search}"` : "No roles available"}
            />
          </div>
        ) : (
          <RolesTable roles={roles} openRolePopup={openRolePopup} />
        )}
      </div>

      <Modal
        isOpen={!!modalType}
        onClose={closeRolePopup}
        title={modalType === "edit" ? "Edit Role" : "Create Role"}
      >
        {isFetchingSelected ? (
          <div className="py-10 text-center"><Loader size="sm" /></div>
        ) : (
          <RoleForm
            initialData={selectedRole}
            onSuccess={() => {
              closeRolePopup();
              fetchRoles(filters); // Re-fetch current view after edit
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default RolesPage;