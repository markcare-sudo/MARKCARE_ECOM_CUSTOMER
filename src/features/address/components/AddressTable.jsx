import { FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";

const AddressTable = ({ addresses, onEdit, onDelete }) => {
    return (
        <div className="w-full overflow-x-auto rounded border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Address</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Contact</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                        <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {addresses?.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                                No addresses found. Add a new one to get started.
                            </td>
                        </tr>
                    ) : (
                        addresses?.map((addr) => (
                            <tr key={addr.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-800">{addr.full_name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-slate-600 max-w-xs truncate">
                                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {addr.phone}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${addr.type === "WORK" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                        }`}>
                                        {addr.address_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => onEdit(addr)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(addr.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AddressTable;