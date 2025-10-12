import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { i18nMiddleware } from './middleware/i18n';
import { clerkAuthMiddleware } from './middleware/clerk';

// 🔹 Middleware central
export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next();

  // Ejecutar i18n primero (setea cookie si no existe)
  i18nMiddleware(request, response);

  // Luego ejecutar Clerk (protege rutas privadas)
  // Clerk usa internamente `NextResponse`, así que devolvemos su resultado
  const result = await clerkAuthMiddleware(request, event);
  return result ?? response;
}

// 🔹 Configuración del matcher
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
