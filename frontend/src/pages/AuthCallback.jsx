import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore.js";
import { Loader } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithOAuth, signUpWithOAuth } = useAuthStore();

 useEffect(() => {
  const handleCallback = async () => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    if (!token) {
      toast.error('Authentication failed. No token provided.');
      navigate('/login');
      return;
    }
    try {
      const action = type === 'signup' ? signUpWithOAuth : loginWithOAuth;
      const userDetails = await action(token);
      if (userDetails.role.name === 'ADMIN') {
        toast.success('Welcome Admin!');
        navigate('/admin');
      } else {
        toast.success(`Welcome, ${userDetails.username}`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed.');
      navigate('/login');
    }
  };
  handleCallback();
}, [searchParams, loginWithOAuth, signUpWithOAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center">
        <Loader className="h-8 w-8 text-cyan-400 animate-spin" aria-hidden="true" />
        <p className="text-white mt-4">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;