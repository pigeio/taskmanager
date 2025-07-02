import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


const SignUp = () => {
  const [profilepic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Form validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual signup API call
      // const response = await authService.signUp({ profilepic, fullName, email, password, adminInviteToken });
      console.log({ profilepic, fullName, email, password, adminInviteToken });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect after successful signup
      navigate('/verify-email'); // or '/dashboard' depending on your flow
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto p-6 md:p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Create an Account</h3>
          <p className="text-sm text-gray-600 mt-2">
            Join us today by entering your details below.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <ProfilePhotoSelector image={profilepic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              required
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
              required
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
              required
            />

            <Input
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              label="Invite Token (Optional)"
              placeholder="Enter admin invite code"
              type="text"
            />
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
                Creating account...
              </>
            ) : "SIGN UP"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
