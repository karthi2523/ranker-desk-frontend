import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const RAW_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, ''); // strip trailing slashes

async function handler(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/+/, '');
    let targetUrl = `${BACKEND_URL}/${path}${url.search}`;
    targetUrl = targetUrl.replace(/([^:]\/)\/+/g, "$1");

    // Extract headers as a plain object
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        // Omit host header. Axios will generate the correct Host header based on the target URL.
        // Drop x-forwarded-* headers injected by Next.js. Ngrok throws ERR_NGROK_8012 if it sees
        // x-forwarded-host: localhost:3000!
        if (
            lowerKey !== 'host' &&
            lowerKey !== 'connection' &&
            !lowerKey.startsWith('x-forwarded-')
        ) {
            headers[lowerKey] = value;
        }
    });

    // Add required ngrok headers to prevent Ngrok from serving the HTML warning page
    headers['ngrok-skip-browser-warning'] = 'true';

    console.log(`\n[PROXY AXIOS DEBUG] Target URL: ${targetUrl}`);

    try {
        let data: any;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const text = await request.text();
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }
            }
        }

        // We use axios because Next.js patches global `fetch` to forward the `Host` 
        // header (localhost:3000) exactly as it was received, which breaks Ngrok.
        const response = await axios({
            url: targetUrl,
            method: request.method,
            headers,
            data,
            responseType: 'arraybuffer', // Crucial for getting raw PDFs and files properly
            validateStatus: () => true, // Don't throw on 4xx/5xx status codes
            timeout: 15000,
        });

        const responseHeaders = new Headers();

        // Forward critical headers
        if (response.headers['content-type']) {
            responseHeaders.set('Content-Type', response.headers['content-type'] as string);
        }
        if (response.headers['content-disposition']) {
            responseHeaders.set('Content-Disposition', response.headers['content-disposition'] as string);
        }

        return new NextResponse(response.data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error(`Proxy [Axios] error [${request.method} ${path}]:`, error.message);
        return NextResponse.json(
            { error: 'Backend unreachable via proxy', details: error.message },
            { status: 502 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
