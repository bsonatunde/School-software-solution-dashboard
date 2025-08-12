import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/teachers/[id] - Get single teacher by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    let teacher;
    
    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      teacher = await db.collection('teachers').findOne({ _id: new ObjectId(id) });
    }
    
    // If not found, try to find by employeeId
    if (!teacher) {
      teacher = await db.collection('teachers').findOne({ employeeId: id });
    }
    
    // If still not found, try to find by the legacy id field
    if (!teacher) {
      teacher = await db.collection('teachers').findOne({ id: id });
    }
    
    if (!teacher) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: teacher,
      message: 'Teacher fetched successfully'
    });

  } catch (error) {
    console.error('Get teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch teacher'
    }, { status: 500 });
  }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const body = await request.json();
    
    // Remove sensitive fields that shouldn't be updated directly
    delete body._id;
    delete body.createdAt;
    
    // Add updated timestamp
    body.updatedAt = new Date().toISOString();
    
    let updateResult;
    
    // Try to update by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      updateResult = await db.collection('teachers').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: body },
        { returnDocument: 'after' }
      );
    }
    
    // If not found, try to update by employeeId
    if (!updateResult?.value) {
      updateResult = await db.collection('teachers').findOneAndUpdate(
        { employeeId: id },
        { $set: body },
        { returnDocument: 'after' }
      );
    }
    
    if (!updateResult?.value) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updateResult.value,
      message: 'Teacher updated successfully'
    });

  } catch (error) {
    console.error('Update teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update teacher'
    }, { status: 500 });
  }
}

// DELETE /api/teachers/[id] - Delete teacher
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    let deleteResult;
    
    // Try to delete by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      deleteResult = await db.collection('teachers').deleteOne({ _id: new ObjectId(id) });
    }
    
    // If not found, try to delete by employeeId
    if (deleteResult?.deletedCount === 0) {
      deleteResult = await db.collection('teachers').deleteOne({ employeeId: id });
    }
    
    if (deleteResult?.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Teacher not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Teacher deleted successfully'
    });

  } catch (error) {
    console.error('Delete teacher error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete teacher'
    }, { status: 500 });
  }
}
