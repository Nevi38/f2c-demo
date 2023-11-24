import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const userAuth = JSON.parse(sessionStorage.getItem("userAuth"));

  // Check if userAuth is not null and isAuth is "true"
  if (userAuth && userAuth.isAuth === "true") {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
