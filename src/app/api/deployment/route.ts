import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get deployment info from Vercel environment variables
    const deploymentUrl = process.env.VERCEL_URL;
    const deploymentId = process.env.VERCEL_GIT_COMMIT_SHA;
    const deploymentTimestamp = process.env.VERCEL_DEPLOYMENT_TIMESTAMP;
    
    // Debug: Log available environment variables (remove in production)
    console.log('Available Vercel env vars:', {
      VERCEL_URL: deploymentUrl,
      VERCEL_GIT_COMMIT_SHA: deploymentId,
      VERCEL_DEPLOYMENT_TIMESTAMP: deploymentTimestamp,
      NODE_ENV: process.env.NODE_ENV,
      // Check for other possible timestamp env vars
      VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
      VERCEL_GIT_REPO_OWNER: process.env.VERCEL_GIT_REPO_OWNER,
      VERCEL_GIT_REPO_SLUG: process.env.VERCEL_GIT_REPO_SLUG
    });
    
    // If we're in development, return current time
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        lastUpdated: new Date().toISOString(),
        deploymentId: 'development',
        environment: 'development'
      });
    }

    // For production, use Vercel's deployment timestamp
    if (deploymentTimestamp) {
      // Convert UNIX timestamp to ISO string
      const deploymentDate = new Date(Number(deploymentTimestamp) * 1000);
      const lastUpdated = deploymentDate.toISOString();
      
      return NextResponse.json({
        lastUpdated,
        deploymentId,
        environment: 'production',
        url: deploymentUrl,
        timestamp: deploymentTimestamp
      });
    }

    // Fallback: try to get build time from other Vercel env vars
    if (deploymentId) {
      // If VERCEL_DEPLOYMENT_TIMESTAMP is not available, 
      // we'll use a fallback approach
      const lastUpdated = new Date().toISOString();
      
      return NextResponse.json({
        lastUpdated,
        deploymentId,
        environment: 'production',
        url: deploymentUrl,
        note: 'Using fallback timestamp - VERCEL_DEPLOYMENT_TIMESTAMP not available'
      });
    }

    // Final fallback
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      deploymentId: 'unknown',
      environment: 'production',
      note: 'No deployment info available'
    });

  } catch (error) {
    console.error('Error fetching deployment info:', error);
    
    // Return current time as fallback
    return NextResponse.json({
      lastUpdated: new Date().toISOString(),
      deploymentId: 'error',
      environment: 'production',
      error: 'API error occurred'
    });
  }
}
