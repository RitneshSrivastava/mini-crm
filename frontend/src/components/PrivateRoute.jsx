import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
