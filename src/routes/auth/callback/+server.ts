import { redirect, type Cookies } from "@sveltejs/kit"
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types'
import type { SupabaseClient, User } from '@supabase/supabase-js';

export const GET: RequestHandler = async ({ url, cookies, locals: { supabase } }) => {
    console.log(url.toString())
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const error = url.searchParams.get('error')
    
    if (error) {
        console.error('OAuth error:', error)
        redirect(307, '/auth/error?message=' + encodeURIComponent(error))
    }
    
    // Check if this is a Riot callback
    const storedRiotState = cookies.get('riot_state')
    if (code && state && storedRiotState && state === storedRiotState) {
        return handleRiotCallback({ url, cookies, supabase })
    }
    
    // Otherwise, handle Supabase OAuth (Discord)
    const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(url.searchParams.toString())
    
    if (supabaseError) {
        console.error('Supabase auth error:', supabaseError)
        redirect(307, '/auth/error?message=auth_failed')
    }
    
    // Get return URL if provided
    const returnUrl = url.searchParams.get('returnUrl') || '/'
    redirect(307, returnUrl)
}

async function handleRiotCallback({ url, cookies, supabase }: { url: URL, cookies: Cookies, supabase: SupabaseClient }) {
    const code = url.searchParams.get('code')!
    const state = url.searchParams.get('state')!
    const codeVerifier = cookies.get('riot_code_verifier')
    
    // Clear temporary cookies
    cookies.delete('riot_state', { path: '/' })
    cookies.delete('riot_code_verifier', { path: '/' })

    let redirectUri: string
    const httpsOrigin = url.origin.replace('http://', 'https://')
    redirectUri = `${httpsOrigin}/auth/callback`
    
    if (!codeVerifier) {
        redirect(307, "/auth/error?message=missing_verifier")
    }
    
    try {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch('https://auth.riotgames.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: env.RIOT_CLIENT_ID!,
                client_secret: env.RIOT_CLIENT_SECRET!,
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier
            })
        })
        
        if (!tokenResponse.ok) {
            throw new Error('Token exchange failed')
        }
        
        const tokens = await tokenResponse.json()
        
        // Get user info from Riot
        const userResponse: Response = await fetch('https://auth.riotgames.com/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokens.access_token}`
            }
        })
        
        if (!userResponse.ok) {
            throw new Error('Failed to fetch user info')
        }
        
        const riotUser = await userResponse.json()
        let existingUser: User | undefined
        
        // Try to create user in Supabase
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email: riotUser.email,
            email_confirm: false,
            user_metadata: {
                provider: 'riot',
                riot_puuid: riotUser.sub,
                riot_username: riotUser.preferred_username || riotUser.name,
                full_name: riotUser.name,
                avatar_url: null
            }
        })
        
        if (createError) {
            // User might already exist, try to find them
            const { data: existingUsers } = await supabase.auth.admin.listUsers()
            const existingUser = existingUsers.users.find(u => 
                u.email === riotUser.email || 
                u.user_metadata?.riot_puuid === riotUser.sub
            )
            
            if (existingUser) {
                // Update existing user with Riot data
                await supabase.auth.admin.updateUserById(existingUser.id, {
                    user_metadata: {
                        ...existingUser.user_metadata,
                        riot_puuid: riotUser.sub,
                        riot_username: riotUser.preferred_username || riotUser.name
                    }
                })
            } else {
                throw createError
            }
        }
        
        // Store Riot tokens in database
        // Gonna see if we actually need this
        // const userId = userData?.user?.id || existingUser?.id
        // if (userId) {
        //     await supabase
        //         .from('user_accounts')
        //         .upsert({
        //             user_id: userId,
        //             provider: 'riot',
        //             provider_id: riotUser.sub,
        //             access_token: tokens.access_token,
        //             refresh_token: tokens.refresh_token,
        //             expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
        //         })
        // }
        
        redirect(307, "/")
        
    } catch (err) {
        console.error('Riot OAuth error:', err)
        redirect(307, "/auth/error?message=riot_oauth_failed")
    }
}