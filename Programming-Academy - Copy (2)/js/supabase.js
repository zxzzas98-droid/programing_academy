


// const SUPABASE_URL = "https://tqyigopjqqsghdpvtjvn.supabase.com";

// const SUPABASE_ANON_KEY = "sb_publishable_vwhUFY1WSTxbA-IocuRVrA_fQgpS1eU";

// const supabase = window.supabase.createClient(
//     SUPABASE_URL,
//     SUPABASE_ANON_KEY
// );

// console.log(window.supabase);
// console.log(supabase);



const SUPABASE_URL = "https://tqyigopjqqsghdpvtjvn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vwhUFY1WSTxbA-IocuRVrA_fQgpS1eU";

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
