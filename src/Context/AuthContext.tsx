import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api";
import axios from "axios";

// User type
interface User {
  userID: string;
  emailID: string;
  userName: string;
  // token: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (emailID: string, password: string) => Promise<void>;
  register: (userData: { name: string; userName: string; emailID: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook for easy usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (emailID: string, password: string) => {
    const response = await loginUser({ emailID, password });
    setUser({ userID: response.user.userID, emailID: response.user.emailID, userName: response.user.userName });
    localStorage.setItem("user", JSON.stringify(response.user));
    navigate(`/${response.user.userName}/main`);
  };

  // Register function
  const register = async (userData: { name: string; userName: string; emailID: string; password: string }) => {
    const response = await registerUser(userData);
    setUser({ userID: response.user.userID, emailID: response.user.emailID, userName: response.user.userName });
    localStorage.setItem("user", JSON.stringify(response.user));
    navigate(`/${response.user.userName}/main`);
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("activeSection");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
