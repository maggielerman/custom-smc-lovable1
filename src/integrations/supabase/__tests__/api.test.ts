import { createClient } from '@supabase/supabase-js';

test('fetches user data with Clerk JWT', async () => {
  // Mock Clerk JWT
  const jwt = 'test-jwt';
  const supabase = createClient('http://localhost:54321', 'anon-key', {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data, error } = await supabase.from('profiles').select('*');
  expect(error).toBeNull();
  expect(data).toBeDefined();
}); 