import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import ApplicationDetail from "./components/ApplicationDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="container">
      {user ? (
        <Header user={user} onLogout={handleLogout} />
      ) : (
        <h1>Intellectual Property Management</h1>
      )}
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes for any logged-in user */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/submit" element={<ApplicationForm user={user} />} />
        </Route>

        {/* Protected Routes for REVIEWER role only */}
        <Route
          element={<ProtectedRoute user={user} allowedRoles={["REVIEWER"]} />}
        >
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? user.role === "REVIEWER"
                    ? "/applications"
                    : "/submit"
                  : "/login"
              }
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
