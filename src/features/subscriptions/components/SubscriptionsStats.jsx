import StatCard from "@/components/ui/StatCard";
import { FiLayout, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const SubscriptionsStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
                title="Total Plans"
                value={stats?.total || 0}
                icon={FiLayout}
            />

            <StatCard
                title="Active Plans"
                value={stats?.active || 0}
                icon={FiCheckCircle}
            />

            <StatCard
                title="Trial Enabled"
                value={stats?.trial || 0}
                icon={FiClock}
            />

            <StatCard
                title="Inactive Plans"
                value={stats?.inactive || 0}
                icon={FiXCircle}
            />
        </div>
    );
};

export default SubscriptionsStats;
