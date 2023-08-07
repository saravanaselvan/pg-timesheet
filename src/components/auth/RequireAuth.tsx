import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../../firebase";

const RequireAuth = () => {
  const [user, setUser] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (!user && localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user") as any));
    }
  }, [user]);

  return (
    <div>
      {user || localStorage.getItem("user") ? (
        <Outlet />
      ) : (
        <Navigate to="/welcome" state={{ from: location }} replace />
      )}
    </div>
  );
};
export default RequireAuth;
