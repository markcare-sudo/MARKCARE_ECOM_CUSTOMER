// import { useEffect } from "react";
// import { FiX } from "react-icons/fi";

// const Modal = ({ isOpen, onClose, title, children }) => {
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "auto";
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed p-4 inset-0 z-50 flex items-center justify-center">

//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative bg-white w-full max-w-2xl rounded shadow-lg p-6 z-10">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <button onClick={onClose}>
//             <FiX className="text-gray-500 hover:text-gray-700" />
//           </button>
//         </div>

//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;






import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic width based on size prop
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative bg-white w-full ${sizeClasses[size]} rounded shadow-2xl z-10 flex flex-col max-h-[90vh]`}
      >
        {/* Fixed Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <FiX className="text-slate-500 hover:text-slate-800" size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;