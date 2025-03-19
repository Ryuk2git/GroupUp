import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";
import SettingsPage from "./Pages/SettingsPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={user ? <Navigate to={`/${user.userName}/home`} /> : <LoginPage />} />

      {/* Protected Routes */}
      <Route path="/:userName/:section" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Default Route */}
      <Route path="*" element={<Navigate to={user ? `/${user.userName}/home` : "/login"} />} />
    </Routes>
  );
};

const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const { userName } = useParams<{ userName: string; section: string }>();

  // Fallback to sessionStorage if no username in params
  const storedUserName = sessionStorage.getItem("userName") || "";
  
  if (!user || (!userName && !storedUserName) ) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <MainPage section="section"/>
    </div>
  );
};

export default App;
