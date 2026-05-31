import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {

    const [user, setUser] =
      useState(null);

    const [loading, setLoading] =
      useState(true);

    /**
     * Load Current User
     */
    const loadUser =
      async () => {

        try {

          const res =
            await api.get(
              "/auth/me"
            );

          setUser(
            res.data.data
          );

        } catch {

          localStorage.removeItem(
            "token"
          );

          setUser(null);
        }

        setLoading(false);
      };

    useEffect(() => {

      const token =
        localStorage.getItem(
          "token"
        );

      if (token) {

        loadUser();

      } else {

        setLoading(false);
      }

    }, []);

    const logout = () => {

      localStorage.removeItem(
        "token"
      );

      setUser(null);
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          loading,
          loadUser,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth =
  () => useContext(
    AuthContext
  );