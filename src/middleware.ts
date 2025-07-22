import { NextResponse, NextRequest } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token= await getToken({req:request})
    const url=request.nextUrl
    

    return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    ]
}