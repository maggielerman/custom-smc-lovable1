
export interface AuthContextType {
  session: any | null;
  user: any | null;
  userId: string | null;
  loading: boolean;
  isLoaded: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
