import apiClient from "../utils/api";

const getTenants = async (filters) => {
    const res = await apiClient.get("/tenants", { params: filters });
    return res;
};

const getTenant = async (id) => {
    const res = await apiClient.get(`/tenants/${id}`);
    return res;
};

const createTenant = async (payload) => {
    const res = await apiClient.post(`/tenants/create-tenant-user`, payload);
    return res;
};

const updateTenant = async (id) => {
    const res = await apiClient.put(`/tenants/${id}`);
    return res;
};

const deleteTenant = async (id) => {
    const res = await apiClient.delete(`/tenants/${id}`);
    return res;
};

const tenantService = {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
};

export default tenantService