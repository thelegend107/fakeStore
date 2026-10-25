import { createClient } from '@supabase/supabase-js'
import { normalizeSupabaseProjectUrl } from './supabaseUrls'

const supabaseUrl = normalizeSupabaseProjectUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseProjectUrl = supabaseUrl

// All data access uses the anon key. Privileged RPCs (e.g. delete_storage_object) run only on the server/DB side.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
    },
})

export const addressSelect = "id,address1,address2,city,postalCode,stateId,countryId,state(name,stateCode),country(name,ISO2,ISO3),lastUpdated,createdAt";
