import { NextRequest, NextResponse } from 'next/server';

const RAW_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, ''); // strip trailing slashes

async function handler(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/+/, ''); // strip leading /api/ with any number of slashes
    const targetUrl = `${BACKEND_URL}/${path}${url.search}`;
    console.log(`[Proxy] ${request.method} ${url.pathname} -> ${targetUrl}`);

    // Build clean headers
    const headers: Record<string, string> = {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'ngrok-skip-browser-warning': 'true',
    };

    // Forward auth token if present
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }

    try {
        let body: string | undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            body = await request.text();
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await response.arrayBuffer();

        // Forward important response headers from backend
        const responseHeaders = new Headers();
        const contentType = response.headers.get('Content-Type');
        if (contentType) responseHeaders.set('Content-Type', contentType);
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) responseHeaders.set('Content-Length', contentLength);

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error(`Proxy error [${request.method} ${path}]:`, error.cause || error.message);
        return NextResponse.json(
            { error: 'Backend unreachable', details: error.message },
            { status: 502 }
        );
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
