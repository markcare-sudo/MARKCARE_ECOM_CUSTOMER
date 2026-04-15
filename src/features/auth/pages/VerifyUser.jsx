import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

const VerifyUserPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { verifyUser } = useAuth(); // Using context method

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let timeoutId; // To clean up timer if user leaves page early

    const triggerVerification = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token found in the link.");
        return;
      }

      try {
        // If verifyUser is from context, it likely returns the response data directly
        // or throws an error caught by the catch block
        const response = await verifyUser(token);
        
        if (response?.status === "success" || response?.data?.status === "success") {
          setStatus("success");
          
          timeoutId = setTimeout(() => {
            navigate("/login");
          }, 3000);
        } 
      } catch (err) {
        setStatus("error");
        // Extracting message from backend error response
        setErrorMessage(
          err.response?.data?.message || 
          err.message || 
          "Verification failed. Please contact support."
        );
      }
    };

    triggerVerification();

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, navigate, verifyUser]); // Added verifyUser to dependency array

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        
        {status === "loading" && (
          <div className="space-y-4 py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-800">Verifying Identity</h2>
            <p className="text-gray-500">Confirming your email and lab access...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verified Successfully!</h2>
            <p className="text-gray-600">Account and phone number confirmed. Your lab portal is now ready.</p>
            <div className="pt-4">
               <p className="text-sm text-indigo-500 font-medium animate-pulse">Redirecting to login...</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
              {errorMessage}
            </div>
            <button 
              onClick={() => navigate("/login")}
              className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUserPage;