import apiClient from "@/utils/api";

const getSubscriptions = async (params = {}) => {
  return await apiClient.get("/subscriptions", { params });
};

const getSubscriptionById = async (id) => {
  return await apiClient.get(`/subscriptions/${id}`);
};

const createSubscription = async (data) => {
  return await apiClient.post("/subscriptions", data);
};

const updateSubscription = async (id, data) => {
  return await apiClient.put(`/subscriptions/${id}`, data);
};

const getSubscriptionStats = async () => {
  return await apiClient.get("/subscriptions/stats");
};

const deleteSubscription = async (id) => {
  return await apiClient.delete(`/subscriptions/${id}`);
};

const subscriptionService = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  getSubscriptionStats,
  deleteSubscription,
};

export default subscriptionService;
