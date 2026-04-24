import { createContext, useContext, useState, useEffect, useCallback } from "react";
import modulesService from "@/services/modules.service";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";
import useAuth from "@/features/auth/useAuth";

const ModulesContext = createContext();

export const ModulesProvider = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    const { user } = useAuth();

    const [error, setError] = useState(null);
    const [modules, setModules] = useState([]);
    const [tree, setTree] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const fetchModules = useCallback(async (filters) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getModules(filters);
            setModules(res.data.data.data || []);
            setStatus(apiStatusConstants.SUCCESS);
        } catch (err) {
            setError(err);
            setStatus(apiStatusConstants.FAILURE);
        }
    }, [isAuthenticated]);

    const fetchModule = async (id) => {
        if (!isAuthenticated) return;
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.getModule(id);
            setStatus(apiStatusConstants.SUCCESS);
            return res.data.data;
        } catch (err) {
            setError(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err; // Re-throw for specific UI fetch needs
        }
    };

    /**
     * Create Module
     */
    const createModule = async (data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.createModule(data);
            successHandler(res);
            await Promise.all([fetchModules()]);
            return res.data;
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err; // 🔥 CRITICAL: Re-throw so the Form doesn't close
        }
    };

    /**
     * Update Module
     */
    const updateModule = async (id, data) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.updateModule(id, data);
            successHandler(res);
            await Promise.all([fetchModules()]);
            return res.data;
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err; // 🔥 CRITICAL: Re-throw so the Form doesn't close
        }
    };

    /**
     * Delete Module
     */
    const deleteModule = async (id) => {
        try {
            setStatus(apiStatusConstants.IN_PROGRESS);
            const res = await modulesService.deleteModule(id);
            successHandler(res);
            await Promise.all([fetchModules()]);
        } catch (err) {
            postErrorHandler(err);
            setStatus(apiStatusConstants.FAILURE);
            throw err; // Re-throw so UI can handle failure
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchModules();
        } else {
            setModules([]);
            setTree([]);
            setStatus(apiStatusConstants.INITIAL);
        }
    }, [isAuthenticated, fetchModules]);

    return (
        <ModulesContext.Provider
            value={{
                error,
                modules,
                tree,
                status,
                loading: status === apiStatusConstants.IN_PROGRESS,
                isError: status === apiStatusConstants.FAILURE,
                isEmpty: status === apiStatusConstants.SUCCESS && modules.length === 0,

                fetchModules,
                fetchModule,
                createModule,
                updateModule,
                deleteModule,
            }}
        >
            {children}
        </ModulesContext.Provider>
    );
};

export const useModules = () => {
    const context = useContext(ModulesContext);
    if (!context) {
        throw new Error("useModules must be used within a ModulesProvider");
    }
    return context;
};