import { createContext } from "react";
import type { AuthState } from "./authentication";

export const AuthContext = createContext<AuthState|null>(null);