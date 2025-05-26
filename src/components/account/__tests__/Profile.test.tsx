
import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../Profile';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

test('loads and displays user profile', async () => {
  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [{ username: 'testuser', full_name: 'Test User' }],
      error: null,
    }),
  });

  render(<Profile userId="test-user-id" />);
  await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());
}); 
