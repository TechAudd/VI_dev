import React, { useEffect, useState } from "react";
import LoginCarousel from "../carousel/LoginCarousel";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import API from "../../api/axiosInstance"

const Login = () => {
  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-3 relative">
      <div className=" md:block col-span-2">
        <LoginCarousel />
      </div>
      <div className="absolute md:relative w-full h-full flex justify-center items-center bg-white bg-opacity-90 md:bg-transparent">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToken = (token) => {
    localStorage.setItem("accessToken", token);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await API.post("/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        const token = response.data.accessToken;
        handleToken(token);
        console.log("Login successful:", response.data);
      } else {
        setError(response.data.message || "An error occurred.");
      }
    } catch (err) {
      localStorage.clear();
      setError(
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-start px-8 text-[#203d5d]">
      {/* <img src={logo} alt="logo" className="max-w-40 mb-10" /> */}
      <p className=" mb-5 text-4xl font-bold ">Mahindra University</p>
      <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 text-xl right-0 pr-3 flex justify-center items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#203d5d] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
      {/* <p className="mt-2">
        If Not registerd?{" "}
        <Link to="/register" className="font-bold">
          {" "}
          Register
        </Link>
      </p> */}
    </div>
  );
};
