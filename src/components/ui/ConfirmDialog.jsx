import Button from "./Button";

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded shadow-lg w-full max-w-md p-6 z-10">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

       <div className="w-full">
            <p className="text-sm text-gray-600 mb-6 whitespace-normal break-all sm:break-words leading-relaxed">
              {message}
            </p>
          </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;