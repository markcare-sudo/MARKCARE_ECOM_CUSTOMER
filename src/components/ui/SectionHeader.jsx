const SectionHeader = ({ title, subtitle, linkText = "View All", onLinkClick }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
    </div>
    <button onClick={onLinkClick} className="text-blue-600 font-bold text-sm hover:underline decoration-2 underline-offset-4">
      {linkText} →
    </button>
  </div>
);

export default SectionHeader;