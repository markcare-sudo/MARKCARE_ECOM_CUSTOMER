import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";

const AddSubscriptionModal = ({ isOpen, onClose, subscriptionData, onSave }) => {
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    // code: "",
    description: "",
    price_monthly: "",
    price_yearly: "",
    trial_days: 0,
    is_active: "Active"
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (subscriptionData) {
        setForm({
          name: subscriptionData.name || "",
          // code: subscriptionData.code || "",
          description: subscriptionData.description || "",
          price_monthly: subscriptionData.price_monthly?.toString() || "",
          price_yearly: subscriptionData.price_yearly?.toString() || "",
          trial_days: subscriptionData.trial_days || 0,
          is_active: subscriptionData.is_active === false ? "Inactive" : "Active",
        });
      } else {
        setForm(initialForm);
      }
      setErrors({});
    }
  }, [isOpen, subscriptionData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    // if (!form.code.trim()) newErrors.code = "Code is required";

    if (form.price_monthly === "" || isNaN(form.price_monthly) || Number(form.price_monthly) < 0) {
      newErrors.price_monthly = "Valid positive monthly price is required";
    }

    if (form.price_yearly === "" || isNaN(form.price_yearly) || Number(form.price_yearly) < 0) {
      newErrors.price_yearly = "Valid positive yearly price is required";
    }

    if (form.trial_days === "" || isNaN(form.trial_days) || Number(form.trial_days) < 0) {
      newErrors.trial_days = "Valid trial days must be a number >= 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading || !validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        // code: form.code.trim(),
        description: form.description.trim(),
        price_monthly: parseFloat(form.price_monthly || 0),
        price_yearly: parseFloat(form.price_yearly || 0),
        trial_days: parseInt(form.trial_days || 0, 10),
        is_active: form.is_active === "Active"
      };

      if (subscriptionData?.id) {
        // Update Mode
        await onSave(subscriptionData.id, payload);
      } else {
        // Create Mode
        await onSave(null, payload);
      }

      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!subscriptionData?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={!loading ? onClose : undefined}
      title={isEdit ? "Edit Subscription Plan" : "Add Subscription Plan"}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Plan Name"
            placeholder="e.g. Premium Plan"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
          />
          {/* <Input
            label="Plan Code"
            placeholder="e.g. PREMIUM_2026"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
            error={errors.code}
            disabled={isEdit} // Code typically shouldn't change
          /> */}

          <Input
            label="Description"
            placeholder="Brief details about the plan"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
          />
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Monthly Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price_monthly}
            onChange={(e) => handleChange("price_monthly", e.target.value)}
            error={errors.price_monthly}
          />
          <Input
            label="Yearly Price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price_yearly}
            onChange={(e) => handleChange("price_yearly", e.target.value)}
            error={errors.price_yearly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Trial Days"
            type="number"
            min="0"
            placeholder="14"
            value={form.trial_days}
            onChange={(e) => handleChange("trial_days", e.target.value)}
            error={errors.trial_days}
          />
          <Select
            label="Status"
            value={form.is_active}
            onChange={(e) => handleChange("is_active", e.target.value)}
            options={["Active", "Inactive"]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            {isEdit ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubscriptionModal;
