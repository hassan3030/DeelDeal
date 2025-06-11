// import { NextResponse } from "next/server"
// import { validateRequiredEnv } from "./lib/env-utils"

// export function middleware(request) {
//   // Only run this in development to help catch missing environment variables
//   if (process.env.NODE_ENV === "development") {
//     try {
//       // List of required environment variables
//       validateRequiredEnv([
//         "NEXT_PUBLIC_API_URL",
//         // Add other required variables here
//       ])
//     } catch (error) {
//       console.error("\x1b[31m%s\x1b[0m", error.message)

//       // In development, we can show a helpful error page
//       if (request.nextUrl.pathname.startsWith("/_next") || request.nextUrl.pathname.includes(".")) {
//         return NextResponse.next()
//       }

//       return new NextResponse(
//         `<html>
//           <head>
//             <title>Environment Error</title>
//             <style>
//               body { font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.5; }
//               pre { background: #f1f1f1; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
//               .container { max-width: 800px; margin: 0 auto; }
//               .error { color: #e53e3e; }
//               .code { font-family: monospace; background: #f1f1f1; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <h1 class="error">Environment Configuration Error</h1>
//               <p>The application is missing required environment variables:</p>
//               <pre>${error.message}</pre>
//               <p>Please create a <span class="code">.env.local</span> file in the root of your project with the required variables.</p>
//               <p>You can copy the example from <span class="code">.env.local.example</span>.</p>
//             </div>
//           </body>
//         </html>`,
//         {
//           status: 500,
//           headers: { "Content-Type": "text/html" },
//         },
//       )
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }



// -------------------------------------------------------

// import { NextResponse } from "next/server"
// import { validateRequiredEnv } from "./lib/env-utils"

// export function middleware(request) {
//   // Only check env vars in development
//   if (process.env.NODE_ENV === "development") {
//     try {
//       validateRequiredEnv([
//         "NEXT_PUBLIC_API_URL",
//         // Add other required variables here
//       ])
//     } catch (error) {
//       console.error("\x1b[31m%s\x1b[0m", error.message)

//       // Allow Next.js internals and static files to pass through
//       if (
//         request.nextUrl.pathname.startsWith("/_next") ||
//         request.nextUrl.pathname.includes(".") ||
//         request.nextUrl.pathname.startsWith("/api")
//       ) {
//         return NextResponse.next()
//       }

//       // Show a custom error page for missing env vars
//       return new NextResponse(
//         `<html>
//           <head>
//             <title>Environment Error</title>
//             <style>
//               body { font-family: system-ui, sans-serif; padding: 2rem; line-height: 1.5; }
//               pre { background: #f1f1f1; padding: 1rem; border-radius: 0.5rem; overflow: auto; }
//               .container { max-width: 800px; margin: 0 auto; }
//               .error { color: #e53e3e; }
//               .code { font-family: monospace; background: #f1f1f1; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <h1 class="error">Environment Configuration Error</h1>
//               <p>The application is missing required environment variables:</p>
//               <pre>${error.message}</pre>
//               <p>Please create a <span class="code">.env.local</span> file in the root of your project with the required variables.</p>
//               <p>You can copy the example from <span class="code">.env.local.example</span>.</p>
//             </div>
//           </body>
//         </html>`,
//         {
//           status: 500,
//           headers: { "Content-Type": "text/html" },
//         }
//       )
//     }
//   }

//   // Always allow the request to continue if no error
//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// }


// -----------------------------------------

// middleware.js

import { getCookie } from './callAPI/utiles'; // Adjust the import path as necessary
import { NextResponse } from 'next/server';

export async function middleware(req) {

  //  const { pathname } = request.nextUrl;
 
  const token = await  getCookie()

  // Protect /admin
  if (!token && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Protect /cart
  if (!token && req.nextUrl.pathname.startsWith('/cart')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Protect /chat
  if (!token && req.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Protect /dashboard
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Protect /notifications
  if (!token && req.nextUrl.pathname.startsWith('/notifications')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Protect /profile
  if (!token && req.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Protect /swap
  if (!token && req.nextUrl.pathname.startsWith('/swap')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Protect /wishList
  if (!token && req.nextUrl.pathname.startsWith('/wishList')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: [
             '/admin/:path*', 
            '/cart/:path*',
             '/chat/:path*',
             '/notifications/:path*',
             '/swap/:path*',
             '/wishList/:path*',
           
            ],
};
