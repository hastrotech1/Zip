import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../../../../helper/authenticate";

interface EmergencyContactState {
  contact_1: string;
  contact_2: string;
  contact_3: string;
}

const EmergencyContact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<EmergencyContactState>({
    contact_1: "",
    contact_2: "",
    contact_3: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDriverId = localStorage.getItem("driver_id");
    if (!storedDriverId) {
      setError("No user ID found. Please log in again.");
      return;
    }
    setUserId(storedDriverId);
  }, []);

  useEffect(() => {
    // Form is valid if at least contact_1 is filled
    setIsFormValid(!!contactInfo.contact_1.trim());
  }, [contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validatePhoneNumber = (number: string): boolean => {
    // Simple validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return number.trim() === "" || phoneRegex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user_id) {
      setError("No user ID available. Please log in again.");
      return;
    }

    if (!validatePhoneNumber(contactInfo.contact_1)) {
      setError("Primary emergency contact number is invalid.");
      return;
    }

    if (contactInfo.contact_2 && !validatePhoneNumber(contactInfo.contact_2)) {
      setError("Second emergency contact number is invalid.");
      return;
    }

    if (contactInfo.contact_3 && !validatePhoneNumber(contactInfo.contact_3)) {
      setError("Third emergency contact number is invalid.");
      return;
    }

    const URL = `https://ziplogistics.pythonanywhere.com/api/update-driver-emergency-contact/${user_id}`;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await auth.apiCall(URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Update failed with status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Update successful", responseData);
      navigate("/driver-dashboard"); // Navigate to appropriate next page
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Update failed:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-6 bg-gray-100 min-h-screen">
      {/* Left side - Image Section */}
      <div className="lg:w-1/2 flex justify-center items-center">
        <div className="relative w-full max-w-lg">
          <img
            src="/api/placeholder/600/400"
            alt="Delivery driver with package"
            className="rounded-lg shadow-xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-lg">
            <h2 className="text-white text-2xl font-bold">
              Your Safety Matters
            </h2>
            <p className="text-white/90 mt-2">
              Please provide emergency contact information so we can ensure your
              wellbeing
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form Section */}
      <div className="lg:w-1/2 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Emergency Contacts
        </h1>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md border border-red-400">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="contact_1"
              className="block text-gray-700 font-medium mb-2"
            >
              Primary Emergency Contact *
            </label>
            <input
              type="tel"
              id="contact_1"
              name="contact_1"
              value={contactInfo.contact_1}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="contact_2"
              className="block text-gray-700 font-medium mb-2"
            >
              Secondary Emergency Contact
            </label>
            <input
              type="tel"
              id="contact_2"
              name="contact_2"
              value={contactInfo.contact_2}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="contact_3"
              className="block text-gray-700 font-medium mb-2"
            >
              Additional Emergency Contact
            </label>
            <input
              type="tel"
              id="contact_3"
              name="contact_3"
              value={contactInfo.contact_3}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                By signing up and driving with Zip Logistics, you agree to
                comply with our company policies, safety standards, and all
                applicable regulations.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-all duration-300
              ${
                isSubmitting || !isFormValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Emergency Contacts"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyContact;
