import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import featuresService from "@/services/feature.service";
import { useModules } from "./ModulesContext";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";

const FeaturesContext = createContext();

export const FeaturesProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const { fetchModulesFeaturesPermissions } = useModules();

  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.INITIAL);

  const fetchFeatures = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.getFeatures(filters);
      setFeatures(res.data.data.data || []);
      fetchModulesFeaturesPermissions();
      setStatus(apiStatusConstants.SUCCESS);
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
    }
  }, [isAuthenticated, fetchModulesFeaturesPermissions]);

  const fetchFeature = async (id) => {
    if (!isAuthenticated) return;
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.getFeature(id);
      setStatus(apiStatusConstants.SUCCESS);
      return res.data.data;
    } catch (err) {
      setError(err);
      setStatus(apiStatusConstants.FAILURE);
      throw err; // Re-throw so the caller knows it failed
    }
  };

  const createFeature = async (data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.createFeature(data);
      successHandler(res);
      await fetchFeatures();
      return res.data; // Return data on success
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
      throw err; // 🔥 CRITICAL: Re-throw so the Form doesn't call onSuccess()
    }
  };

  const updateFeature = async (id, data) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.updateFeature(id, data);
      successHandler(res);
      await fetchFeatures();
      return res.data;
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
      throw err; // 🔥 CRITICAL: Re-throw so the Form doesn't call onSuccess()
    }
  };

  const deleteFeature = async (id) => {
    try {
      setStatus(apiStatusConstants.IN_PROGRESS);
      const res = await featuresService.deleteFeature(id);
      successHandler(res);
      await fetchFeatures();
    } catch (err) {
      postErrorHandler(err);
      setStatus(apiStatusConstants.FAILURE);
      throw err; // Re-throw for UI feedback
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeatures();
    } else {
      setFeatures([]);
      setStatus(apiStatusConstants.INITIAL);
    }
  }, [isAuthenticated, fetchFeatures]);

  return (
    <FeaturesContext.Provider
      value={{
        error,
        features,
        status,
        loading: status === apiStatusConstants.IN_PROGRESS,
        isError: status === apiStatusConstants.FAILURE,
        isEmpty: status === apiStatusConstants.SUCCESS && features.length === 0,
        fetchFeatures,
        fetchFeature,
        createFeature,
        updateFeature,
        deleteFeature,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
};