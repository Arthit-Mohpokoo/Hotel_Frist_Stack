import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("token");
  const load = useSelector((state) => state.user.loading);

  if (!token || !user) {
    return <Navigate to="/Singin" replace />;
  }
  if (load) {
    return <div>Loading...</div>;
  }
  if (user.role == null) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default UserRoutes;
