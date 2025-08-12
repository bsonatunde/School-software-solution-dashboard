import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/students/[id] - Get single student by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    let student;
    
    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      student = await db.collection('students').findOne({ _id: new ObjectId(id) });
    }
    
    // If not found, try to find by studentId (custom ID)
    if (!student) {
      student = await db.collection('students').findOne({ studentId: id });
    }
    
    // If still not found, try to find by the legacy id field
    if (!student) {
      student = await db.collection('students').findOne({ id: id });
    }
    
    if (!student) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student fetched successfully'
    });

  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch student'
    }, { status: 500 });
  }
}

// PUT /api/students/[id] - Update student
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
      updateResult = await db.collection('students').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: body },
        { returnDocument: 'after' }
      );
    }
    
    // If not found, try to update by studentId
    if (!updateResult?.value) {
      updateResult = await db.collection('students').findOneAndUpdate(
        { studentId: id },
        { $set: body },
        { returnDocument: 'after' }
      );
    }
    
    if (!updateResult?.value) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updateResult.value,
      message: 'Student updated successfully'
    });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update student'
    }, { status: 500 });
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    
    let deleteResult;
    
    // Try to delete by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      deleteResult = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    }
    
    // If not found, try to delete by studentId
    if (deleteResult?.deletedCount === 0) {
      deleteResult = await db.collection('students').deleteOne({ studentId: id });
    }
    
    if (deleteResult?.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete student'
    }, { status: 500 });
  }
}
