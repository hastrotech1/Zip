import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import auth from "../../../../utils/auth";
import ziplugsLogo from "../../../../src/assets/Ziplugs-04.png";
import { Loader2 } from "lucide-react";
// import SignUpImage from "../../../../src/assets/google.svg";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      setIsLoading(true);
      setErrorMessage("");

      // Send ID token to backend
      const response = await axios.post(
        "https://ziplugs.geniusexcel.tech/api/auth/google",
        { 
          oauth_provider: "google",
          user_type: "customer",
          google_id_token: idToken, }
      );

      console.log("Full Server Response:", response.data);

      // Extract backend response fields with fallbacks
      const accessToken =
        response.data["access-token"] ||
        response.data["access_token"] ||
        response.data["accessToken"];

      const refreshToken =
        response.data["refresh-token"] ||
        response.data["refresh_token"] ||
        response.data["refreshToken"];

      const userId = response.data["user_id"] || response.data["userId"];
      const email =
        response.data["email"] || response.data["user_email"] || "";
      const name =
        response.data["name"] ||
        response.data["user_name"] ||
        response.data["first_name"] ||
        response.data["given_name"] ||
        "";
      const picture = response.data["picture"] || "";

      if (!userId) throw new Error("User ID not received from server");
      if (!accessToken) throw new Error("Access token not received from server");

      // Store values in local storage via your auth helper
      auth.storeTokens(
        accessToken,
        refreshToken || "",
        userId,
        null, // driver_id (not available here)
        email,
        name,
        picture
      );

      console.log("Final stored values check:", {
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
        user_id: localStorage.getItem("user_id"),
        user_mail: localStorage.getItem("user_mail"),
        first_name: localStorage.getItem("first_name"),
        picture: localStorage.getItem("picture"),
      });

      // Navigate to place order page
      navigate("/place-order");
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = (error: unknown) => {
    console.error("Google Login Error:", error);
    setErrorMessage("Google login failed. Please try again.");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#00187A] flex flex-col max-auto">
      {/* Top blue logo section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center space-y-4">
          <img
            src={ziplugsLogo}
            alt="Ziplugs Logo"
            className="w-[280px] h-auto mx-auto transform transition-all duration-1000 ease-out animate-fade-in-up"
          />
          <div className="animate-scale-in">
            <p className="text-white/90 text-lg font-medium">
              Seamless Shipping Solutions
            </p>
            <p className="text-white/70 text-sm mt-1">
              Fast • Reliable • Global
            </p>
          </div>
        </div>
      </div>

      {/* Bottom white section */}
      <div className="bg-white rounded-t-[2rem] px-6 py-8 shadow-card-elegant animate-scale-in">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
            <p className="text-black leading-relaxed">
              Experience seamless, fast, and reliable shipping with an account
              tailored to your logistics needs
            </p>
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => handleGoogleLoginError(undefined)}
              shape="pill"
              width="100%"
              size="large"
              theme="outline"
              logo_alignment="left"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center mt-3">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Signing in...</span>
            </div>
          )}

          {errorMessage && (
            <div className="text-destructive text-sm text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              {errorMessage}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
