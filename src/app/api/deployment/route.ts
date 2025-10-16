import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get deployment info from Vercel environment variables
    const deploymentUrl = process.env.VERCEL_URL;
    const deploymentId = process.env.VERCEL_GIT_COMMIT_SHA;
    const deploymentTime = process.env.VERCEL_GIT_COMMIT_REF;
    
    // If we're in development, return current time
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        lastUpdated: new Date().toISOString(),
        deploymentId: 'development',
        environment: 'development'
      });
    }

    // For production, try to get deployment info from Vercel API
    if (deploymentId) {
      // Use the commit SHA as a fallback for deployment time
      // In a real scenario, you might want to fetch from Vercel API
      const lastUpdated = new Date().toISOString(); // This will be the build time
      
      return NextResponse.json({
        lastUpdated,
        deploymentId,
        environment: 'production',
        url: deploymentUrl
      });
    }

    // Fallback to current time if no deployment info is available
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      deploymentId: 'unknown',
      environment: 'production'
    });

  } catch (error) {
    console.error('Error fetching deployment info:', error);
    
    // Return current time as fallback
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      deploymentId: 'error',
      environment: 'production'
    });
  }
}
