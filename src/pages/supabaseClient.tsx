import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Replace these placeholder values with your actual Supabase Project URL and Anon Key.
// You can find these in your Supabase project's dashboard under Settings > API.
const supabaseUrl = 'https://ytjnonkfkhcpkijhvlqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE';
// --- End of configuration ---


// This check helps remind you to add your credentials.
if (supabaseUrl.includes('https://ytjnonkfkhcpkijhvlqi.supabase.co') || supabaseAnonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0am5vbmtma2hjcGtpamh2bHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTAzMjgsImV4cCI6MjA3Mjk4NjMyOH0.4TrFHEY-r1YMrqfG8adBmjgnVKYCnUC34rvnwsZfehE')) {
    console.warn(
        `******************************************************************
* WARNING: Supabase client is not configured.                    *
* Please replace the placeholder values in src/supabaseClient.ts *
* with your actual Supabase URL and Anon Key.                    *
******************************************************************`
    );
}

// Initialize the Supabase client with your project credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

