import api from "@/interceptor/api";
import { AuthContextProp, UserData } from "@/types/auth/authContextProp";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

const AuthContext = createContext<AuthContextProp | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { t } = useTranslation();

  const loadAuth = async (): Promise<void> => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (refreshToken && accessToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        const isValidSession = await validateSession();
        setIsAuthenticated(isValidSession);
        try {
          const response = await api.get("/auth/me");
          const userData = response.data.data.user;
          setUserData({
            username: userData.username,
            email: userData.email,
          });
        } catch {
          throw new Error("Hiba történt a beazonosítás alatt!");
        }
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      if (!accessToken || !refreshToken) return false;
      const response = await api.get("/auth/valid");
      return response.status === 200;
    } catch {
      await logout();
      return false;
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      const responseAPI = response.data;

      const tokens = {
        access: responseAPI.accessToken,
        refresh: responseAPI.refreshToken,
      };

      if (tokens && tokens.access && tokens.refresh) {
        await SecureStore.setItemAsync("accessToken", String(tokens.access));
        await SecureStore.setItemAsync("refreshToken", String(tokens.refresh));
        setUserData(responseAPI.userData);
        setAccessToken(String(tokens.access));
        setRefreshToken(String(tokens.refresh));
        setIsAuthenticated(true);
      } else {
        throw new Error("Hiányzó bejelentkezési token");
      }
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registration = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean | undefined> => {
    try {
      const response = await api.post("/auth/registration", {
        email,
        username,
        password,
      });
      if (
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        return await login({
          email,
          password,
        });
      } else {
        const message = response.data?.message;
        const error = Array.isArray(message) ? message[0] : String(message);
        throw new Error(error);
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      if (error?.response?.status === 400) {
        return;
      }
      return error?.message ?? error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      setAccessToken(null);
      setRefreshToken(null);
      setUserData(null);
      setIsAuthenticated(false);
      router.replace("/(notauth)/auth/login");
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordChange = async ({ password }: { password: string }): Promise<boolean> => {
    try {
      const response = await api.post("/auth/passwordChange", { password });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data?.message || "Ismeretlen hiba");
      }
      router.back();
      return true;
    } catch {
      Alert.alert(t("auth.passwordChange.error"), t("auth.passwordChange.errorTitle"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        login,
        loadAuth,
        registration,
        userData,
        logout,
        isAuthenticated,
        passwordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
