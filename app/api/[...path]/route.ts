import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

async function handler(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/', '');
    const targetUrl = `${BACKEND_URL}${path}${url.search}`;

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

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
            },
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
