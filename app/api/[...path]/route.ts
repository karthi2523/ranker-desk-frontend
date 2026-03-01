import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function handler(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const path = url.pathname.replace(/^\/api\/+/, '');

        // Always fetch the freshest environment variable inside the function scope to prevent undefined on Vercel cold starts
        let BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';
        BACKEND_URL = BACKEND_URL.replace(/\/+$/, '');

        let targetUrl = `${BACKEND_URL}/${path}${url.search}`;
        targetUrl = targetUrl.replace(/([^:]\/)\/+/g, "$1");

        const headers: Record<string, string> = {};

        // Vercel Edge/Serverless prohibits these headers manually being passed
        const forbiddenHeaders = [
            'host', 'connection', 'keep-alive', 'content-length', 'content-encoding',
            'transfer-encoding', 'expect', 'upgrade'
        ];

        request.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            // Completely drop Next.js proxy headers that trigger Ngrok 8012 blocks
            if (!forbiddenHeaders.includes(lowerKey) && !lowerKey.startsWith('x-forwarded-')) {
                headers[lowerKey] = value;
            }
        });

        // Ensure ngrok doesn't send the gross HTML warning page
        headers['ngrok-skip-browser-warning'] = 'true';

        // Read payload as ArrayBuffer to protect binary streams like PDFs
        let bodyBuffer: ArrayBuffer | undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            bodyBuffer = await request.arrayBuffer();
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body: bodyBuffer,
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeout);

        const responseHeaders = new Headers();

        if (response.headers.get('content-type')) {
            responseHeaders.set('content-type', response.headers.get('content-type')!);
        }
        if (response.headers.get('content-disposition')) {
            responseHeaders.set('content-disposition', response.headers.get('content-disposition')!);
        }

        // Return the exact binary stream from Ngrok
        const data = await response.arrayBuffer();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

    } catch (e: any) {
        console.error("PROXY FATAL EXCEPTION:", e);
        // We return a 500 JSON response so Vercel doesn't hide the crash behind a generic HTML 500 error!
        return NextResponse.json({
            error: "Vercel Proxy Execution Crash",
            message: e.message || "Unknown proxy error",
            cause: e.cause || null,
            stack: e.stack || null
        }, { status: 500 });
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
