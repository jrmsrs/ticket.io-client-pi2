import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthGoogleContext } from "../../contexts/authGoogle";

export const PrivateRoutes = () => {
  const { signed, user } = useContext(AuthGoogleContext);
  if (signed) {
    if (user.authorized) {
      return <Outlet />;
    } else {
      return <Navigate to="/complete" />;
    }
  } else {
    return <Navigate to="/login" />;
  }
};
