// E2E Supabase -> Backend test
// Loads REACT_APP_SUPABASE_* from .env.local and calls backend /api/users/profile

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const fetch = global.fetch || require('node-fetch');

(async () => {
  try {
    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing SUPABASE env vars in .env.local');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const fs = require('fs');
    const credPath = require('path').resolve(__dirname, '..', '.e2e_test_user.json');
    let testEmail;
    let testPassword;

    if (fs.existsSync(credPath)) {
      const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      testEmail = creds.email;
      testPassword = creds.password;
      console.log('Using test credentials from', credPath);
    } else {
      testEmail = `e2e_${Date.now()}@example.com`;
      testPassword = 'Test1234';

      console.log('Signing up via Supabase:', testEmail);
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email: testEmail, password: testPassword });
      console.log('signUp error:', signUpErr);
    }

    // Sign in
    console.log('Signing in...');
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email: testEmail, password: testPassword });
    console.log('signIn error:', signInErr);

    const token = signInData?.session?.access_token || null;
    if (!token) {
      console.error('Could not obtain access token from Supabase signIn.');
      process.exit(1);
    }

    console.log('Got access token, calling backend /users/profile...');
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    const body = await res.text();
    console.log('Backend status:', res.status);
    console.log('Backend body:', body);
  } catch (err) {
    console.error('E2E test error:', err);
    process.exit(1);
  }
})();
