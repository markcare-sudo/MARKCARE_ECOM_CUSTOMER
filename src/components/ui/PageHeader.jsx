const PageHeader = ({
  title,
  subtitle,
  action,
  breadcrumb,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6">

      {/* ===== Breadcrumb (Optional) ===== */}
      {breadcrumb && (
        <div className="text-sm text-gray-500">
          {breadcrumb}
        </div>
      )}

      {/* ===== Title + Action Row ===== */}
      <div className="flex justify-between items-start">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2">
            {action}
          </div>
        )}

      </div>
    </div>
  );
};

export default PageHeader;