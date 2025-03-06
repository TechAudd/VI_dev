import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CheckAuth = ({ children }) => {
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const localStorageToken = await localStorage.getItem("token");
      setToken(localStorageToken);
      if (token === "undefined" || token === null) {
        navigate('/login')
      }
    })();
  }, [token]);
  return children;
};

export default CheckAuth;



