import { FiUsers, FiDollarSign } from "react-icons/fi";
import useDashboard from "../hooks/useDashboard";
import StatCard from "../components/ui/StatCard";

const Dashboard = () => {
  const { data, loading } = useDashboard();

  if (loading) return <div>Loading...</div>;

  const statCards = [
    {
      title: "Total Tenants",
      value: data.totalTenants,
      icon: FiUsers,
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
      icon: FiDollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default Dashboard;