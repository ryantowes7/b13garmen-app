// app/api/[[...path]]/route.js
import { NextResponse } from 'next/server';

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }));
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params;
  const route = `/${path.join('/')}`;
  const method = request.method;

  try {
    // Root endpoint
    if ((route === '/root' || route === '/') && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: "B13 Garment API",
        status: "active",
        version: "1.0.0"
      }));
    }

    // Health check endpoint
    if (route === '/health' && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        status: "healthy",
        timestamp: new Date().toISOString()
      }));
    }

    // API not found
    return handleCORS(NextResponse.json(
      { error: 'API endpoint not found', route },
      { status: 404 }
    ));
  } catch (error) {
    console.error('API Error:', error);
    return handleCORS(NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    ));
  }
}

// Export handlers
export const GET = handleRoute;
export const POST = handleRoute;
export const PUT = handleRoute;
export const DELETE = handleRoute;
export const PATCH = handleRoute;