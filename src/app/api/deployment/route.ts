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

    // For production, try to get commit date from GitHub API
    if (deploymentId) {
      try {
        // Try to fetch commit date from GitHub API
        const githubResponse = await fetch(
          `https://api.github.com/repos/ilyshaxa/shaxa.dev/commits/${deploymentId}`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'shaxa.dev-portfolio'
            }
          }
        );
        
        if (githubResponse.ok) {
          const commitData = await githubResponse.json();
          const commitDate = commitData.commit.committer.date;
          
          return NextResponse.json({
            lastUpdated: commitDate,
            deploymentId,
            environment: 'production',
            url: deploymentUrl,
            source: 'github-api',
            committer: commitData.commit.committer.name,
            message: commitData.commit.message.split('\n')[0] // First line of commit message
          });
        }
      } catch (githubError) {
        console.log('GitHub API failed, using fallback:', githubError);
      }
      
      // Fallback: use current time if GitHub API fails
      const lastUpdated = new Date().toISOString();
      
      return NextResponse.json({
        lastUpdated,
        deploymentId,
        environment: 'production',
        url: deploymentUrl,
        note: 'Using fallback timestamp - GitHub API unavailable',
        source: 'fallback'
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
