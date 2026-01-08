import { useState } from "react";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null, // "user" | "admin"
  });

  const handleLogin = (role) => {
    setAuth({ isAuthenticated: true, role });
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: null });
  };

  if (!auth.isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (auth.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <UserDashboard onLogout={handleLogout} />;
}
