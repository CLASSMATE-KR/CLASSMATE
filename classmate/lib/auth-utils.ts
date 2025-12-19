import { supabase } from './supabase'

export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  } catch {
    return null
  }
}

