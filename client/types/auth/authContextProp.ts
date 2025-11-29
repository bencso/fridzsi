export interface UserData {
  username: string;
  email: string;
}

export type AuthContextProp = {
  isLoading: boolean;
  login: (params: { email: string; password: string }) => Promise<boolean>;
  registration: (params: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean | undefined>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userData: UserData | null;
  passwordChange: (params: {
    password: string;
    repassword: string;
  }) => Promise<boolean>;
};
