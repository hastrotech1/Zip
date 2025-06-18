import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import auth from "../../../../utils/auth";
import SignUpImage from "../../../../src/assets/google.svg";
// import Logo from "../../../../src/assets/ziplugs-04.png";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async (tokenResponse: {
    access_token: string;
  }) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear any previous errors

      const accessToken = tokenResponse.access_token;
      console.log("Google Access Token:", accessToken);

      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );

      const userInfo = userInfoResponse.data;
      console.log("Google User Info:", userInfo);

      const response = await axios.post(
        "https://ziplogistics.pythonanywhere.com/api/google-user-login/driver",
        {
          token: accessToken,
          email: userInfo.email,
          name: userInfo.given_name,
        }
      );

      console.log("Full Server Response:", response.data);
      console.log("Response Keys:", Object.keys(response.data));

      // Debug: Log each possible field from server response
      console.log("Server Response Fields:", {
        "access-token": response.data["access-token"],
        access_token: response.data["access_token"],
        accessToken: response.data["accessToken"],
        "refresh-token": response.data["refresh-token"],
        refresh_token: response.data["refresh_token"],
        refreshToken: response.data["refreshToken"],
        user_id: response.data["user_id"],
        driverId: response.data["driverId"],
        email: response.data["email"],
        user_email: response.data["user_email"],
        name: response.data["name"],
        user_name: response.data["user_name"],
        first_name: response.data["first_name"],
        given_name: response.data["given_name"],
        picture: response.data["picture"],
      });

      // Try to extract tokens with different possible field names
      const accessTokenFromServer =
        response.data["access-token"] ||
        response.data["access_token"] ||
        response.data["accessToken"];

      const refresh_token =
        response.data["refresh-token"] ||
        response.data["refresh_token"] ||
        response.data["refreshToken"];

      const driver_id = response.data["user_id"] || response.data["driverId"];

      const email =
        response.data["email"] || response.data["user_email"] || userInfo.email; // Fallback to Google user info

      const name =
        response.data["name"] ||
        response.data["user_name"] ||
        response.data["first_name"] ||
        response.data["given_name"] ||
        userInfo.given_name; // Fallback to Google user info

      const picture = response.data["picture"] || userInfo.picture; // Fallback to Google user info

      console.log("Extracted Values:", {
        accessToken: accessTokenFromServer,
        refreshToken: refresh_token,
        driverId: driver_id,
        userMail: email,
        firstName: name,
        picture: picture,
      });

      if (!driver_id) {
        throw new Error("User ID not received from server");
      }

      if (!accessTokenFromServer) {
        throw new Error("Access token not received from server");
      }

      // Store tokens with fallback values
      auth.storeTokens(
        accessTokenFromServer,
        refresh_token || "", // Provide empty string if undefined
        null, //user_id,
        driver_id,
        email || userInfo.email, // Use Google email as fallback
        name || userInfo.given_name, // Use Google name as fallback
        picture || userInfo.picture // Use Google picture as fallback
      );

      console.log("Final stored values check:");
      console.log({
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
        driver_id: localStorage.getItem("driver_id"),
        user_mail: localStorage.getItem("user_mail"),
        first_name: localStorage.getItem("first_name"),
        picture: localStorage.getItem("picture"),
      });

      const isNewDriver = response.data["is_new_driver"] ?? false;

      console.log("Driver status:", isNewDriver ? "New" : "Existing");

      // Navigate accordingly
      navigate(isNewDriver ? "/document-upload" : "/deliveries");
    } catch (error) {
      console.error("Google OAuth Error:", error);
      setErrorMessage("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInError = (error: unknown) => {
    console.error("Google OAuth Error:", error);
    setErrorMessage("Google login failed. Please try again.");
    setIsLoading(false);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSignIn,
    onError: handleGoogleSignInError,
    flow: "implicit",
  });

  return (
    <div className="min-h-screen bg-[#1320d8] flex flex-col justify-between">
      {/* Top blue logo section */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="../../../assets/Ziplugs-04.png"
          alt="Ziplugs Logo"
          className="w-[250px] h-auto transform transition-all duration-1000 ease-out animate-fade-in-up"
        />
      </div>

      {/* Bottom white section */}
      <div className="h-1/2 w-full bg-white rounded-t-3xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-center">Welcome!</h2>
        <p className="text-sm text-gray-600 text-center mt-2">
          Stay in control, track every delivery, and drive with confidence all
          from one platform.
        </p>

        <button
          className="flex items-center justify-center mt-6 w-full border border-black rounded-full py-3 hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              Signing in...
            </>
          ) : (
            <>
              <img src={SignUpImage} alt="Google" className="w-5 h-5 mr-2" />
              Sign up with Google
            </>
          )}
        </button>

        {errorMessage && (
          <div className="text-red-500 text-sm text-center mt-3 p-2 bg-red-50 rounded-md">
            {errorMessage}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default DriverLogin;
