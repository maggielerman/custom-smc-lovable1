
import { render } from '@testing-library/react';
import SignIn from '../SignIn';
import { useClerk } from '@clerk/clerk-react';

jest.mock('@clerk/clerk-react', () => ({
  useClerk: () => ({
    signIn: jest.fn().mockResolvedValue({ id: 'user_123' }),
  }),
}));

test('renders sign in form', () => {
  const { container } = render(<SignIn />);
  const signInText = container.textContent;
  expect(signInText).toContain('Sign In');
}); 
