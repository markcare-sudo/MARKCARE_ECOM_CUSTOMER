import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#6C7CF3", "#EC5A8E", "#8B5CF6"];

const SubscriptionsStats = ({ subscriptionStats }) => {

  const data = subscriptionStats
    ? [
        { name: "Paid", value: subscriptionStats.paid || 0 },
        { name: "Trial", value: subscriptionStats.trial || 0 },
        { name: "Expired", value: subscriptionStats.expired || 0 }
      ]
    : [];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg p-6 shadow flex flex-col md:flex-row items-center justify-between gap-6">

      {/* Chart */}
      <div className="relative w-full md:w-1/2 h-64">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-gray-800">
          {total}
        </div>

      </div>

      {/* Legend */}
      <div className="space-y-3 w-full md:w-40">

        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></span>

              <span className="text-gray-600">{item.name}</span>
            </div>

            <span className="font-semibold">{item.value}</span>
          </div>
        ))}

      </div>

    </div>
  );
};

export default SubscriptionsStats;