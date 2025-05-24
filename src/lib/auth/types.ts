
export interface AuthContextType {
  session: { user: any } | null;
  user: any | null;
  userId: string | null;
  loading: boolean;
  isLoaded: boolean;
  getToken: (options?: { template?: string }) => Promise<string | null>;
  refreshSupabaseSession: () => Promise<void>;
  signUp: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
