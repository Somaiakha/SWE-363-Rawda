// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(() => localStorage.getItem("rawda_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            authAPI.me()
                .then((data) => setUser(data.user))
                .catch(() => {
                    localStorage.removeItem("rawda_token");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await authAPI.login(email, password);
        localStorage.setItem("rawda_token", data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem("rawda_token");
        setToken(null);
        setUser(null);
    };

    const updateUser = (fields) => {
        setUser((prev) => ({ ...prev, ...fields }));
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}