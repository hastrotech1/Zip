import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import auth from "../../../../utils/auth";
import ziplugsLogo from "../../../../src/assets/Ziplugs-04.png";
import { Loader2 } from "lucide-react";
// import SignUpImage from "../../../../src/assets/google.svg";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.post("https://ziplugs.geniusexcel.tech/auth/google", {
        oauth_provider: "google",
        user_type: "customer",
        google_id_token: idToken,
      });
      
      const {
        id: driver_id,
        email,
        first_name,
        last_name,
        profile_image,
        access_token: accessToken,
        refresh_token: refreshToken,
      } = response.data.data;

      if (!driver_id) throw new Error("User ID not received from server");
      if (!accessToken) throw new Error("Access token not received from server");

      const isNewDriver = response.data["is_new_driver"] ?? false;
      
      navigate(isNewDriver ? "/document-upload" : "/deliveries");
    
      console.log("Driver status:", isNewDriver ? "New" : "Existing");

      auth.storeTokens(
        accessToken,
        refreshToken || "",
        null, // user_id
        driver_id,
        email,
        `${first_name} ${last_name}`,
        profile_image
      );


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
    <div className="min-h-screen bg-[#1320d8] flex flex-col max-auto">
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

export default DriverLogin;
