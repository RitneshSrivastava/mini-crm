import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../services/api";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);

      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectPath);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p className="p-10 text-lg">Logging you in...</p>;
};

export default AuthCallback;
