import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const addressSelect = "id,address1,address2,city,postalCode,stateId,countryId,state(name,stateCode),country(name,ISO2,ISO3),lastUpdated,createdAt";
