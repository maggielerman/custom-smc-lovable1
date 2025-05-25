
import '@testing-library/jest-dom';

// Mock Clerk
jest.mock('@clerk/clerk-react', () => ({
  useClerk: () => ({
    signIn: jest.fn().mockResolvedValue({ id: 'user_123' }),
    signOut: jest.fn().mockResolvedValue({}),
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    getToken: jest.fn().mockResolvedValue('mock-token'),
  }),
  useUser: () => ({
    isLoaded: true,
    user: {
      id: 'user_123',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
  SignIn: (props: any) => React.createElement('div', { 'data-testid': 'clerk-sign-in' }, props.children),
  SignUp: (props: any) => React.createElement('div', { 'data-testid': 'clerk-sign-up' }, props.children),
}));

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      insert: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      update: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
      delete: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    })),
  },
}));
