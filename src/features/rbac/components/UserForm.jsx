import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import PhoneInput from "@/components/ui/PhoneInput";
import { postErrorHandler } from "@/components/ErrorHandler";
import { useUsers } from "@/context/UsersContext";
import { useRoles } from "@/context/RolesContext";

const UserForm = ({ onSuccess, initialData }) => {
  const { createUser, updateUser } = useUsers();
  const { roles } = useRoles();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "CUSTOMER",
    role_id: "",
    is_active: true,
    is_super_admin: false,
  });
  console.log(initialData)
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialData);

  // CRITICAL FIX: Your Select component maps 'opt' to both value and label.
  // To make role_id (the value) work, we pass the role names here, 
  // but we must handle the ID mapping in handleChange.
  const roleNames = roles.map(r => r.name);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        user_type: initialData.user_type || "CUSTOMER",
        // Extract the name so the Select component shows the correct text
        role_id: initialData.role?.name || "",
        is_active: initialData.is_active ?? true,
        is_super_admin: initialData.is_super_admin ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!form.role_id) throw new Error("Please select a Role");

      // Convert the Role Name back to an ID before sending to backend
      const selectedRole = roles.find(r => r.name === form.role_id);
      const payload = {
        ...form,
        role_id: selectedRole ? selectedRole.id : null
      };

      if (isEdit) {
        await updateUser(initialData.id, payload);
      } else {
        await createUser(payload);
      }

      // ONLY happen on success:
      onSuccess?.();
    } catch (err) {
      // If error happens, loading stops but form data stays as is
      postErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Enter user name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="user@iqlims.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={isEdit}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhoneInput
          label="Phone Number"
          value={form.phone}
          onChange={(val) => handleChange("phone", val)}
        />
        <Select
          label="Role"
          value={form.role_id}
          onChange={(e) => handleChange("role_id", e.target.value)}
          options={roleNames}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="User Type"
          value={form.user_type}
          onChange={(e) => handleChange("user_type", e.target.value)}
          options={["CUSTOMER", "PLATFORM"]}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg flex gap-8 border border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={form.is_super_admin}
            onChange={(e) => handleChange("is_super_admin", e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Super Admin</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={form.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? "Processing..." : isEdit ? "Update User" : "Invite User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;