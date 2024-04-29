import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Middleware({ children }) {
  const navigate = useNavigate();
  const urlPath = window.location.href;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      token &&
      (urlPath.includes("/login") ||
        urlPath.includes("/signup") ||
        urlPath.includes("/forgot-password"))
    )
      navigate("/home");
  }, [urlPath]);
  return <>{children}</>;
}

export default Middleware;
