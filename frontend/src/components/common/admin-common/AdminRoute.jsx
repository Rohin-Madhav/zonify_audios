import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If they are admin, let them through
  return <Outlet />;
};

export default AdminRoute