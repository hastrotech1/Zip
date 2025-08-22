import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import auth from "../../../../utils/auth";
import ziplugsLogo from "../../../../src/assets/Ziplugs-04.png";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";
import SignUpImage from "../../../../src/assets/google.svg";

const Login = () => {
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
        "https://ziplogistics.pythonanywhere.com/api/google-user-login/customer",
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
        userId: response.data["userId"],
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

      const user_id = response.data["user_id"] || response.data["userId"];

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
        userId: user_id,
        userMail: email,
        firstName: name,
        picture: picture,
      });

      if (!user_id) {
        throw new Error("User ID not received from server");
      }

      if (!accessTokenFromServer) {
        throw new Error("Access token not received from server");
      }

      // Store tokens with fallback values
      auth.storeTokens(
        accessTokenFromServer,
        refresh_token || "", // Provide empty string if undefined
        user_id,
        null, // driver_id
        email || userInfo.email, // Use Google email as fallback
        name || userInfo.given_name, // Use Google name as fallback
        picture || userInfo.picture // Use Google picture as fallback
      );

      console.log("Final stored values check:");
      console.log({
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
        user_id: localStorage.getItem("user_id"),
        user_mail: localStorage.getItem("user_mail"),
        first_name: localStorage.getItem("first_name"),
        picture: localStorage.getItem("picture"),
      });

      navigate("/place-order");
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

          <Button
            size="lg"
            onClick={() => loginWithGoogle()}
            disabled={isLoading}
            className="w-full text-black border border-grey rounded-full bg-transparent py-4 font-medium hover:text-white hover:border-transparent hover:bg-[#00187A]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <img src={SignUpImage} alt="Google" className="w-5 h-5" />
                Sign up with Google
              </>
            )}
          </Button>

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
