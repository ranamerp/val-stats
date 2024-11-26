import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function GET() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/webfonts/v1/webfonts?key=${env.GOOGLE_FONTS_API_KEY}`
        );
        const data = await response.json();
        const fonts = data.items.map((font: any) => ({
            family: font.family,
            category: font.category
        }));
        
        return json({
            status: 200,
            fonts: fonts
        });
    } catch (error) {
        console.error('Error fetching fonts:', error);
        
        // Fallback to some basic fonts
        const fonts = [
            { family: 'Arial', category: 'sans-serif' }, 
            { family: 'Times New Roman', category: 'serif' }, 
            { family: 'Georgia', category: 'serif' }
        ]

        return json({
            status: 500,
            fonts: fonts,
            error: 'Failed to fetch Google Fonts'
        });
    }
}