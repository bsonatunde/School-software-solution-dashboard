import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/classes/[id] - Get single class
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const classesCollection = db.collection('classes');
    
    // Try to find by ObjectId first, then by string id
    let classData;
    if (ObjectId.isValid(id)) {
      classData = await classesCollection.findOne({ _id: new ObjectId(id) });
    } else {
      classData = await classesCollection.findOne({ $or: [{ classId: id }, { name: id }] });
    }

    if (!classData) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classData
    });

  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

// PUT /api/classes/[id] - Update class
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const classesCollection = db.collection('classes');
    
    // Try to update by ObjectId first, then by string id
    let result;
    if (ObjectId.isValid(id)) {
      result = await classesCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    } else {
      result = await classesCollection.findOneAndUpdate(
        { $or: [{ classId: id }, { name: id }] },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
    }

    if (!result || !result.value) {
      return NextResponse.json(
        { success: false, error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.value,
      message: 'Class updated successfully'
    });

  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update class' },
      { status: 500 }
    );
  }
}
