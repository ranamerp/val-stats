import { redirect } from "@sveltejs/kit"
import { env } from '$env/dynamic/private';
import { dev } from "$app/environment"

export const GET = async ({ url, cookies }) => {
    console.log('=== RIOT OAUTH DEBUG ===')
    console.log('RIOT_CLIENT_ID:', env.RIOT_CLIENT_ID)
    console.log('RIOT_CLIENT_SECRET exists:', !!env.RIOT_CLIENT_SECRET)
    console.log('URL origin:', url.origin)

    // Force HTTPS for redirect URI
    let redirectUri: string
    const httpsOrigin = url.origin.replace('http://', 'https://')
    redirectUri = `${httpsOrigin}/auth/callback`
    
    // Generate state and PKCE parameters for security
    const state = crypto.randomUUID()
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)
    
    // Store PKCE verifier and state in secure cookies
    cookies.set('riot_state', state, {
        path: '/',
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        maxAge: 600 // 10 minutes
    })
    
    cookies.set('riot_code_verifier', codeVerifier, {
        path: '/',
        httpOnly: true,
        secure: !dev,
        sameSite: 'lax',
        maxAge: 600 // 10 minutes
    })
    
    // Build Riot OAuth URL
    const params = new URLSearchParams({
        client_id: env.RIOT_CLIENT_ID!,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: 'openid email profile',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    })
    
    const authUrl = `https://auth.riotgames.com/authorize?${params}`
    
    redirect(307, authUrl)
}

function generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}