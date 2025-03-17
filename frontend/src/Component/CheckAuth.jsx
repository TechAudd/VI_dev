import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/axiosInstance";

const CheckAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("No Access Token");
        }

        // Decode token to check expiry
        const decoded = jwtDecode(accessToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          // Refresh token if expired
          const { data } = await API.get("/auth/refreshToken", { withCredentials: true });
          console.log(data, "data");
          localStorage.setItem("accessToken", data.accessToken);
        }

        // Test protected route
        await API.get("/auth/protected-route");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication Failed:", error);
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    };

    verifyToken();
  }, []);
  return isAuthenticated ? children : null;
};

export default CheckAuth;



