const StatCard = ({ title, value, extra, trend, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {extra && <p className="text-sm text-gray-500">{extra}</p>}


        {trend && (
          <p className="text-green-500 text-sm mt-1">
            ↑ {trend}
          </p>
        )}
      </div>

      {Icon && (
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className="text-blue-600 text-xl" />
        </div>
      )}
    </div>
  );
};

export default StatCard;