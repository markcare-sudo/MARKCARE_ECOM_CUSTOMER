const ApiEmpty = ({
  message = "No data available",
  className = ""
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-white rounded shadow text-gray-500 ${className}`}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ApiEmpty;