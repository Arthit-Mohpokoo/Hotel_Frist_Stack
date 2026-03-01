import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const UserRoutes = ({ children }) => {

  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  if (!token || !user) {
    return <Navigate to="/Singin" replace />;
  }
  if (user.role !== "customer") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default UserRoutes;