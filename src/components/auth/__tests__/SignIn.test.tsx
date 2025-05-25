import { render, screen } from '@testing-library/react';
import SignIn from '../SignIn';
import { useClerk } from '@clerk/clerk-react';

jest.mock('@clerk/clerk-react', () => ({
  useClerk: () => ({
    signIn: jest.fn().mockResolvedValue({ id: 'user_123' }),
  }),
}));

test('renders sign in form', () => {
  render(<SignIn />);
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
}); 