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

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Block direct access to `/admin`
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
