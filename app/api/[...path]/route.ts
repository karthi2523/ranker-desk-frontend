import { NextRequest, NextResponse } from 'next/server';

const RAW_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';
const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, ''); // strip trailing slashes

async function handler(request: NextRequest) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/+/, '');
    let targetUrl = `${BACKEND_URL}/${path}${url.search}`;
    targetUrl = targetUrl.replace(/([^:]\/)\/+/g, "$1");

    // Reconstruct headers perfectly for fetch to bypass Ngrok host validation errors
    const customHeaders = new Headers();

    // Vercel Serverless / Edge `fetch` strictly enforces forbidden headers. 
    // Passing these will cause a fatal 500 TypeError.
    const forbiddenHeaders = [
        'host', 'connection', 'keep-alive', 'content-length', 'content-encoding',
        'transfer-encoding', 'expect', 'upgrade'
    ];

    request.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();

        // Ngrok checks `Host` and `X-Forwarded-*` to route traffic. If it sees Vercel URL
        // or localhost here, it instantly throws ERR_NGROK_8012. 
        if (
            !forbiddenHeaders.includes(lowerKey) &&
            !lowerKey.startsWith('x-forwarded-')
        ) {
            customHeaders.set(key, value);
        }
    });

    customHeaders.set('ngrok-skip-browser-warning', 'true');

    console.log(`\n[PROXY FETCH DEBUG] Target URL: ${targetUrl}`);

    try {
        let body: string | undefined;
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            body = await request.text();
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: customHeaders,
            body,
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeout);

        const data = await response.arrayBuffer();

        // Forward important response headers from backend
        const responseHeaders = new Headers();
        const contentType = response.headers.get('Content-Type');
        if (contentType) responseHeaders.set('Content-Type', contentType);
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error(`Proxy [Fetch] error [${request.method} ${path}]:`, error.cause || error.message);
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
