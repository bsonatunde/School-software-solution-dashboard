import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/models';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      database: process.env.DATABASE_NAME || 'pacey-school-db',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      deployment: {
        platform: 'Render',
        region: process.env.RENDER_REGION || 'unknown',
        service: process.env.RENDER_SERVICE_NAME || 'pacey-school-solution'
      }
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      },
      { status: 500 }
    );
  }
}
