import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="text-center max-w-md">
        {/* Subtle decorative element */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-9xl font-extrabold text-blue-600 tracking-tight">
          404
        </h1>
        
        <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
          Page not found
        </h2>
        
        <p className="mt-4 text-base text-gray-500 leading-7">
          Sorry, we couldn’t find the page you’re looking for. It might have been 
          moved, deleted, or never existed in the first place.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5"
          >
            Go Back
          </Button>

          <Link to="/">
            <Button
              variant="primary"
              className="px-6 py-2.5"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-400">
            If you believe this is a technical error, please contact 
            <a href="mailto:support@yourcompany.com" className="ml-1 text-blue-500 hover:underline">
              Support
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;