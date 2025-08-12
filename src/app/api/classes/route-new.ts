import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/classes - Get all classes
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const classesCollection = db.collection('classes');
    
    const classes = await classesCollection.find({}).toArray();

    return NextResponse.json({
      success: true,
      data: classes
    });

  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

// POST /api/classes - Create class
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const classesCollection = db.collection('classes');
    
    const body = await request.json();
    const newClass = {
      ...body,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await classesCollection.insertOne(newClass);

    return NextResponse.json({
      success: true,
      data: { ...newClass, _id: result.insertedId },
      message: 'Class created successfully'
    });

  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
