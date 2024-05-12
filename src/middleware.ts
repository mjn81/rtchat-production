import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getIpAddr, rateLimiter } from './lib/rateLimit';
const sensitiveRoutes = ['/dashboard', '/chat'];

export default withAuth(
	async function middleware(req) {
		const pathname = req.nextUrl.pathname;
		const ip = getIpAddr(req);
		try {
			await rateLimiter.consume(ip, 1);
		} catch (resRej) {
			return new NextResponse('Too many request.', { status: 429 });
		}
		const isAuth = await getToken({ req });
		const isLoginPage = pathname.startsWith('/login');

		const isAccessSensitiveRoute = sensitiveRoutes.some((route) =>
			pathname.startsWith(route)
		);
		if (isLoginPage) {
			if (isAuth) {
				return NextResponse.redirect(new URL('/chat', req.url));
			}

			return NextResponse.next();
		}

		if (!isAuth && isAccessSensitiveRoute) {
			return NextResponse.redirect(new URL('/login', req.url));
		}
		if (isAuth && pathname === '/')
			return NextResponse.redirect(new URL('/chat', req.url));
	},
	{
		callbacks: {
			async authorized() {
				return true;
			},
		},
	}
);

export const config = {
	matcher: ['/', '/login', '/dashboard/:path*', '/chat/:path*'],
};
