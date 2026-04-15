import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import OtpInput from "../components/OtpInput";
import useAuth from "../useAuth";
import AuthSplitLayout from "@/components/layout/AuthSplitLayout";
import LOGOS from "@/constants/images";
import { getAccessToken } from "@/utils/sessionStorage";

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const loginData = location.state?.loginData;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const { verifyOTP, requestOTP, loading } = useAuth();
  const token = getAccessToken();

  // ================= GUARD =================
  useEffect(() => {
    // Only redirect to home if a VALID token actually exists
    // If token is "undefined" (string) or null, stay here
    if (token && token !== "undefined") {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  // ================= INITIALIZE EXPIRY =================
  useEffect(() => {
    if (loginData?.expiresAt) {
      const expiryTime = new Date(loginData.expiresAt).getTime();
      setExpiresAt(expiryTime);
    }
  }, [loginData]);

  // ================= TIMER =================
  useEffect(() => {
    if (!expiresAt) return;
    let interval;
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimer(remaining);
      if (remaining <= 0) clearInterval(interval);
    };
    updateTimer();
    interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // ================= VERIFY =================
  const handleVerify = async (code) => {
    const finalOtp = code || otp.join("");

    if (finalOtp.length < 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setError("");
      const res = await verifyOTP({
        requestId: loginData?.requestId,
        tenantId: loginData?.tenantId,
        otp: finalOtp,
      });

      // Backend returns structure: { success: true, data: { ... } }
      // Depending on your useAuth, res might be the full axios object or just the data

      navigate("/", { replace: true });

    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  // ================= RESEND =================
  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await requestOTP({
        identifier: loginData?.destination,
        channel: "EMAIL",
        tenantId: loginData?.tenantId,
      });

      if (res?.data?.data?.expiresAt) {
        setExpiresAt(new Date(res.data.data.expiresAt).getTime());
      }
      setOtp(["", "", "", "", "", ""]);
      setError("");
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        <div className="flex justify-center">
          <Link to="/">
            <img src={LOGOS.MARKCARE_LOGO} alt="IQLIMS Logo" className="h-10 mb-6 object-contain" />
          </Link>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">Enter OTP</h2>

        {loginData && (
          <p className="text-sm text-gray-600">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-medium text-gray-800">{loginData?.destination}</span>
          </p>
        )}

        <OtpInput
          length={6}
          value={otp}
          onChange={setOtp}
          error={error}
          onComplete={handleVerify}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button fullWidth loading={loading} onClick={() => handleVerify()}>
          Verify and Continue
        </Button>

        <div className="text-center text-sm mt-4">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold text-indigo-600">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-indigo-600 hover:underline font-medium"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default VerifyOtpPage;