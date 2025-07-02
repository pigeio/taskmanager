import React, { useContext, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password) {
      setError("Please enter your password");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    setError(null);
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login submitted with:", email , password);
    
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login raw response :", response);

      const { token, role: backendRole, user } = response;
      const role = backendRole === "member" ? "user" : backendRole;

      // Destructure response data

      if (token) {
        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", role);

        updateUser({user, token , role});
        
        
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        throw new Error("Authentication failed: No token received");
      }
    } catch (err) {
      // Handle API errors
      console.error("Login error:", err);

      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Invalid email or password. Please try again.";
      setError(errorMessage);
      
      // Clear password field on error (security best practice)
      setPassword("");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto p-6 md:p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
          <p className="text-sm text-gray-600 mt-2">
            Please enter your details to log in
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            autoComplete="username"
            required
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
            autoComplete="current-password"
            required
          />

          <div className="flex justify-end text-sm mb-2">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-md transition duration-200 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : "LOGIN"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

