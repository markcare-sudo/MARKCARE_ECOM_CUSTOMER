import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import tenantService from "@/services/tenant.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  // Data States
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);

  // Pagination & Filter States
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    plan: "",
    page: 1,
    limit: 10,
  });

  /**
   * Fetch Tenants
   * Uses the current filters state to query the backend
   */
  const fetchTenants = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);

      const res = await tenantService.getTenants(filters);

      // Standardizing extraction based on your backend return { rows, pagination }
      if (res.data.data.data && res.data.data.data.rows) {
        setTenants(res.data.data.data.rows);
        setPagination(res.data.data.data.pagination || { totalPages: 1 });
      } else {
        // Fallback for simple array responses
        setTenants(Array.isArray(res.data.data.data) ? res.data.data.data : []);
      }

      if (res.data.data.stats) setStats(res.data.data.stats);

      setStatus(apiStatusConstants.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
      console.error("Tenant Fetch Error:", err);
    }
  }, [isAuthenticated, filters]);

  /**
   * Filter Update Helper
   * Merges new filters and resets page to 1 unless page is explicitly changed
   */
  const updateFilters = useCallback((newParams) => {
    setFilters((prev) => ({
      ...prev,
      ...newParams,
      // If we are changing search/status, go back to page 1.
      // If we are just changing the page, keep the new page.
      page: newParams.page || (newParams.search !== undefined || newParams.status !== undefined ? 1 : prev.page)
    }));
  }, []);



  /**
   * CRUD Actions
   */

  const getTenant = async (id) => {
    try {
      const res = await tenantService.getTenant(id);
      return res.data.data;
    } catch (err) {
      postErrorHandler(err);
      throw err;
    }
  };

  const addTenant = async (data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await tenantService.createTenant(data);
      successHandler(res);
      await fetchTenants(); // Refresh list
      return res;
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
      throw err;
    }
  };

  const editTenant = async (id, data) => {
    try {
      const res = await tenantService.updateTenant(id, data);
      successHandler(res);
      await fetchTenants();
      return res;
    } catch (err) {
      postErrorHandler(err);
      throw err;
    }
  };

  const removeTenant = async (id) => {
    try {
      const res = await tenantService.deleteTenant(id);
      successHandler(res);
      await fetchTenants();
    } catch (err) {
      postErrorHandler(err);
    }
  };

  /**
   * Side Effect: Trigger fetch when filters or auth change
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
    } else {
      setTenants([]);
      setStats(null);
      setStatus(apiStatusConstants.INITIAL);
    }
  }, [isAuthenticated, fetchTenants]);

  return (
    <TenantContext.Provider
      value={{
        // Data
        tenants,
        stats,
        error,
        status,

        // Filtering & Pagination
        filters,
        pagination,
        updateFilters,

        // UI Helpers
        isLoading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && tenants.length === 0,

        // Actions
        getTenant,
        addTenant,
        removeTenant,
        editTenant,
        refresh: fetchTenants,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};