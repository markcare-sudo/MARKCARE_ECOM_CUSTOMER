import { useState, useRef } from "react";
import { FiEdit2, FiSave, FiCamera } from "react-icons/fi";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import useAuth from "@/features/auth/useAuth";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: "CUSTOMER",
  });

  const [original, setOriginal] = useState(form);
  const [errors, setErrors] = useState({});
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  // ===== FIELD CONFIGURATION =====
  const fields = [
    { key: "name", label: "Name", editable: true },
    { key: "email", label: "Email", editable: true },
    { key: "phone", label: "Phone", editable: true },
    { key: "role", label: "Role", editable: false },
  ];

  // ===== Avatar Upload =====
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return alert("Invalid image");
    if (file.size > 2 * 1024 * 1024)
      return alert("Image must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  //   const validate = () => {
  //     const err = {};

  //     if (!form.name) err.name = "Name required";
  //     if (!form.email) err.email = "Email required";
  //     if (!form.phone) err.phone = "Phone number required";

  //     return err;
  // };


  // ===== Save Handler =====
  const handleSave = async () => {
    try {
      setLoading(true);

      if (!form.name) {
        setErrors({ name: "Name is required" });
        return;
      }

      setErrors({});

      if (form.email !== original.email) {
        setShowEmailOtp(true);
        return;
      }

      if (form.phone !== original.phone) {
        setShowPhoneOtp(true);
        return;
      }

      await updateProfile();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    console.log("Update profile API");
    setOriginal(form);
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <PageHeader
        title="Profile"
        subtitle="Manage your personal information"
        // breadcrumb="Settings / Profile"
        action={
          !editing ? (
            <Button
              variant="outline"
              leftIcon={<FiEdit2 size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={loading}
              leftIcon={<FiSave size={16} />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== LEFT CARD ===== */}
        <Card className="text-center">
          <div className="flex flex-col items-center space-y-4">

            <div className="relative group cursor-pointer">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Avatar name={form.name} size={12} />
              )}

              {editing && (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <FiCamera className="text-white text-xl" />
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            <h2 className="text-lg font-semibold">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
            <Badge text="Active" variant="green" />

          </div>
        </Card>

        {/* ===== RIGHT SIDE ===== */}
        <div className="lg:col-span-2 space-y-6">

          <Card>
            <SectionHeader title="Personal Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  placeholder={field.label}
                  value={form[field.key]}
                  disabled={!editing || !field.editable}
                  error={errors[field.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field.key]: e.target.value,
                    })
                  }
                />
              ))}
            </div>

            {editing && (
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  loading={loading}
                  leftIcon={<FiSave size={16} />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ===== EMAIL OTP MODAL ===== */}
      {showEmailOtp && (
        <OtpModal
          title="Verify Email"
          otp={emailOtp}
          setOtp={setEmailOtp}
          onVerify={updateProfile}
          onClose={() => setShowEmailOtp(false)}
        />
      )}

      {/* ===== PHONE OTP MODAL ===== */}
      {showPhoneOtp && (
        <OtpModal
          title="Verify Phone"
          otp={phoneOtp}
          setOtp={setPhoneOtp}
          onVerify={updateProfile}
          onClose={() => setShowPhoneOtp(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;


/* ===== REUSABLE OTP MODAL ===== */
const OtpModal = ({ title, otp, setOtp, onVerify, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <Input
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" onClick={onVerify}>
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
};