import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// Replace these placeholder values with your actual Supabase Project URL and Anon Key.
// You can find these in your Supabase project's dashboard under Settings > API.
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
// --- End of configuration ---


// This check helps remind you to add your credentials.
if (supabaseUrl.includes('YOUR_SUPABASE_PROJECT_URL') || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
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

