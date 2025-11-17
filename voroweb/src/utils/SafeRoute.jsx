import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import LoadingScreen from '../screens/core/LoadingScreen';

function SafeRoute({ children }) {
  const { token, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      logout();
      navigate("/login", { replace: true });
    }
  }, [token, loading, logout, navigate]);

  if (loading) {
    return <LoadingScreen />; 
  }

  return children;
}

export default SafeRoute;