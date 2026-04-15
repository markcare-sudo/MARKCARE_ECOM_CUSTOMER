import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useModules } from "@/context/ModulesContext";
import { useFeatures } from "@/context/FeatureContext";

const FeatureForm = ({ onSuccess, initialData }) => {
  const { createFeature, updateFeature } = useFeatures();
  const { modules } = useModules();

  const [form, setForm] = useState({
    name: "",
    module_id: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        module_id: initialData.module_id || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        // Wait for the update to complete
        await updateFeature(initialData.id, form);
      } else {
        // Wait for the creation to complete
        await createFeature(form);
      }

      // 🏆 If we reached here, the API call was successful.
      // Now it's safe to close the form.
      if (onSuccess) onSuccess();

    } catch (error) {
      // ❌ If an error occurs (like 'Feature already exists'), 
      // the catch block captures it. 
      // We do NOT call onSuccess(), so the form stays open.
      console.error("Submission failed:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Feature Name */}
      <div>
        <label className="text-sm font-medium">Feature Name</label>
        <Input
          value={form.name}
          placeholder="e.g. Patients"
          onChange={(e) => handleChange("name", e.target.value)}
          disabled={loading}
          required
        />
      </div>

      {/* Module Select */}
      <div>
        <label className="text-sm font-medium">Module</label>
        <select
          value={form.module_id}
          onChange={(e) => handleChange("module_id", e.target.value)}
          className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          disabled={loading}
          required
        >
          <option value="">Select Module</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={form.description}
          placeholder="Patients management"
          onChange={(e) => handleChange("description", e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Feature" : "Create Feature"}
        </Button>
      </div>
    </form>
  );
};

export default FeatureForm;