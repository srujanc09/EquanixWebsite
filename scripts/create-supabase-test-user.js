/* Create or retrieve a Supabase test user using the service role key in backend/.env

Usage: node scripts/create-supabase-test-user.js

This script reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from backend/.env and creates a test user with a valid email that Supabase will accept.
It prints JSON with { email, password } on success.
*/

require('dotenv').config({ path: require('path').resolve(__dirname, '..', 'backend', '.env') });
const { createClient } = require('@supabase/supabase-js');

(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Use a clearly valid email to avoid Supabase email validation rules
    const timestamp = Date.now();
    const testEmail = `dev.test+${timestamp}@example.com`;
    const testPassword = 'Test1234';

    console.log('Creating or retrieving user:', testEmail);

    // Try to get user by email via admin API
    const { data: users, error: listErr } = await supabase.auth.admin.listUsers({ query: testEmail });
    if (listErr) {
      console.error('Error listing users:', listErr);
    }

    if (users && users.length > 0) {
      console.log('User already exists, returning the email/password');
      const creds = { email: testEmail, password: testPassword };
      // write creds to disk for e2e script
      try {
        const fs = require('fs');
        const outPath = require('path').resolve(__dirname, '..', '.e2e_test_user.json');
        fs.writeFileSync(outPath, JSON.stringify(creds, null, 2));
        console.log('Wrote credentials to', outPath);
      } catch (err) {
        console.error('Could not write credentials file:', err);
      }
      console.log(JSON.stringify(creds));
      process.exit(0);
    }

    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (error) {
      console.error('Error creating user:', error);
      process.exit(1);
    }

    console.log('Created user successfully');
    const creds = { email: testEmail, password: testPassword };
    try {
      const fs = require('fs');
      const outPath = require('path').resolve(__dirname, '..', '.e2e_test_user.json');
      fs.writeFileSync(outPath, JSON.stringify(creds, null, 2));
      console.log('Wrote credentials to', outPath);
    } catch (err) {
      console.error('Could not write credentials file:', err);
    }

    console.log(JSON.stringify(creds));
  } catch (err) {
    console.error('Script error:', err);
    process.exit(1);
  }
})();
