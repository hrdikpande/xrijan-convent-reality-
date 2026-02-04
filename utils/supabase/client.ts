
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document !== 'undefined') {
            const cookie = document.cookie
              .split('; ')
              .find(row => row.startsWith(`${name}=`))
            return cookie ? cookie.split('=')[1] : null
          }
          return null
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          if (typeof document !== 'undefined') {
            let cookie = `${name}=${value}`
            if (options?.maxAge) cookie += `; max-age=${options.maxAge}`
            if (options?.path) cookie += `; path=${options.path}`
            if (options?.domain) cookie += `; domain=${options.domain}`
            if (options?.sameSite) cookie += `; samesite=${options.sameSite}`
            if (options?.secure) cookie += '; secure'
            document.cookie = cookie
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          if (typeof document !== 'undefined') {
            let cookie = `${name}=; max-age=0`
            if (options?.path) cookie += `; path=${options.path}`
            document.cookie = cookie
          }
        },
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )
}
