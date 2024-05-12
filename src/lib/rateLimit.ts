import {RateLimiterMemory} from 'rate-limiter-flexible';

const opts = {
    points: 7, // 5 points
    duration: 1, // Per second
};

export const rateLimiter = new RateLimiterMemory(opts);

export const getIpAddr = (req: Request) => {
    return req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || '0';
}