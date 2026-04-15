import { useState, useEffect, useMemo } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuth from "@/features/auth/useAuth";
import { postErrorHandler } from "@/components/ErrorHandler";
import { useRoles } from "@/context/RolesContext";
import PermissionTree from "./PermissionTree";
import { useModules } from "@/context/ModulesContext";

const RoleForm = ({ onSuccess, initialData }) => {
  const { user } = useAuth();
  const { updateRole, createRole } = useRoles();
  const { tree } = useModules();

  // --- ADDED: Error State ---
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    tenantId: user?.tenantId || null,
    name: "",
    description: "",
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialData);

  const initialDataKey = initialData?.id || "new";

  useEffect(() => {
    if (initialData) {
      const rawPermissions = initialData.RolePermissions || initialData.permissions || [];
      const permissionIds = rawPermissions.map((p) => {
        if (typeof p === "object") return p.permission_id || p.id;
        return p;
      });

      setForm({
        tenantId: initialData.tenantId || user?.tenantId || null,
        name: initialData.name || "",
        description: initialData.description || "",
        permissions: [...new Set(permissionIds)],
      });
    } else {
      setForm({
        tenantId: user?.tenantId || null,
        name: "",
        description: "",
        permissions: [],
      });
    }
    // Reset errors when data changes
    setErrors({});
  }, [initialDataKey, user?.tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- ADDED: Validation Logic ---
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Role name is required";
    if (form.permissions.length === 0) newErrors.permissions = "Select at least one permission";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // Clear UI errors
      
      const payload = {
        name: form.name.trim(),
        description: form.description,
        permissions: form.permissions,
        tenantId: Number(form.tenantId) || user?.tenantId 
      };

      if (isEdit) {
        await updateRole(initialData.id, payload);
      } else {
        await createRole(payload);
      }
      onSuccess?.();
    } catch (err) {
      postErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Role Name
            </label>
            <Input
              value={form.name}
              placeholder="e.g. Lab Technician"
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null }); // Clear error while typing
              }}
              // --- ADDED: Visual Error State ---
              className={errors.name ? "border-red-500 ring-red-100" : ""}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Description
            </label>
            <Input
              value={form.description}
              placeholder="Access level details..."
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-[#063C66] uppercase tracking-tighter">
              Permission Matrix
            </h3>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                errors.permissions 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-blue-50 text-blue-600 border-blue-100"
              }`}>
                {form.permissions.length} Selected
              </span>
              {errors.permissions && <p className="text-[10px] text-red-500 mt-1 font-medium">{errors.permissions}</p>}
            </div>
          </div>
          
          <PermissionTree
            tree={tree}
            permissions={form.permissions}
            setPermissions={(newPerms) => {
              setForm((prev) => ({ ...prev, permissions: newPerms }));
              if (errors.permissions) setErrors({ ...errors, permissions: null });
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t bg-white">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onSuccess} 
          disabled={loading}
          className="px-6"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#063C66] hover:bg-[#052e4f] px-10 text-white shadow-lg shadow-blue-900/10"
        >
          {loading ? "Saving..." : isEdit ? "Update Changes" : "Create Role"}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;