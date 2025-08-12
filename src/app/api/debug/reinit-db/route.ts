import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/database';

export async function POST() {
  try {
    console.log('Reinitializing database...');
    await initializeDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database reinitialized successfully'
    });
  } catch (error) {
    console.error('Database reinitialization error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reinitialize database'
    }, { status: 500 });
  }
}
