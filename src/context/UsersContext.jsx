import { createContext, useContext, useState, useEffect, useCallback } from "react";
import usersService from "@/services/users.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  const [error, setError] = useState(null)
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);

  /**
   * Fetch all users
   * Guarded to prevent unauthorized calls
   */
  const fetchUsers = useCallback(async (filters) => {
    if (!isAuthenticated) return;

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.getUsers(filters);

      // Ensure we extract data correctly based on your API structure
      setUsers(res.data?.data || res.data || res || []);
      setStatus(apiStatusConstants.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  }, [isAuthenticated]);

  /**
   * Fetch single user
   */
  const fetchUser = async (id) => {
    if (!isAuthenticated) return;

    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.getUser(id);
      setStatus(apiStatusConstants.SUCCESS);
      return res.data?.data || res.data || res;
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Create User
   */
  const createUser = async (data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.createUser(data);
      successHandler(res);
      await fetchUsers();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Update User
   */
  const updateUser = async (id, data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.updateUser(id, data);
      successHandler(res);
      await fetchUsers();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Delete User
   */
  const deleteUser = async (id) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await usersService.deleteUser(id);
      successHandler(res);
      await fetchUsers();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  };

  /**
   * Auto-fetch users on mount or auth change
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    } else {
      setUsers([]);
      setStatus(apiStatusConstants.INITIAL);
    }
  }, [isAuthenticated, fetchUsers]);

  return (
    <UsersContext.Provider
      value={{
        error,

        // Data and Status
        users,
        status,

        // UI Helpers
        loading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && users.length === 0,

        // CRUD Actions
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};