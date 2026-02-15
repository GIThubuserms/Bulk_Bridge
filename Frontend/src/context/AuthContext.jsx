import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // <-- import this

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (user) {
      getProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const getProfile = async () => {
    try {
      if (!user) return;

      let endpoint =
        user.role === "vendor"
          ? `${BASE_URL}/api/v1/vendor/profile`
          : `${BASE_URL}/api/v1/users/getme`;

      const res = await fetch(endpoint, {
        credentials: "include",
      });

      const data = await res.json();
      console.log("Vendor Prfoile",data.data)
      setProfile(data.data);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    }
  };
  
  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/v1/users/getme`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data.data);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ username, email, password, role }) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    setUser(data.data);
    return data;
  };

  const signIn = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    setUser(data.data);
    return data;
  };

  const signOut = async () => {
    try {
      await fetch(`${BASE_URL}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error(error + "Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        signUp,
        signIn,
        signOut,
        getProfile,
        reloadUser: loadProfile,
        reloadProfile: getProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
