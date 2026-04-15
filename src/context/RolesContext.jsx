import { createContext, useContext, useState, useEffect, useCallback } from "react";
import rolesService from "@/services/roles.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  const [error, setError] = useState(null)
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);

  /**
   * Fetch all roles
   * Guarded to prevent 401 errors when not logged in
   */
  const fetchRoles = useCallback(async (filters) => {
    if (!isAuthenticated) return;

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.getRoles(filters);
      setRoles(res.data.data.data || []);
      setStatus(apiStatusConstants.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  }, [isAuthenticated]);

  /**
   * Fetch a single role
   */
  const fetchRole = async (id) => {
    if (!isAuthenticated) return;

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.getRole(id);
      setStatus(apiStatusConstants.SUCCESS);
      return res.data.data;
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Create Role
   */
  const createRole = async (data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.createRole(data);
      successHandler(res);
      await fetchRoles();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Update Role
   */
  const updateRole = async (id, data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.updateRole(id, data);
      successHandler(res);
      await fetchRoles();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Delete Role
   */
  const deleteRole = async (id) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await rolesService.deleteRole(id);
      successHandler(res);
      await fetchRoles();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Auto-fetch roles only when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchRoles();
    } else {
      // Clear state on logout
      setRoles([]);
      setStatus(apiStatusConstants.INITIAL);
    }
  }, [isAuthenticated, fetchRoles]);

  return (
    <RolesContext.Provider
      value={{
        error,

        // Data and Status
        roles,
        status,

        // UI Helpers
        loading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && roles.length === 0,

        // Actions
        fetchRoles,
        fetchRole,
        createRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};