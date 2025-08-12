
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { StudentDB } from '@/lib/database-new';
import type { ApiResponse, Student, UpdateStudentRequest } from '@/types';

// GET /api/students/[id] - Get single student by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    console.log('[Student API] Fetching student with id:', id, 'ObjectId.isValid:', ObjectId.isValid(id));
    let student;

    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      student = await db.collection('students').findOne({ _id: new ObjectId(id) });
      console.log('[Student API] Lookup by _id result:', student);
    }

    // If not found, try to find by studentId (custom ID)
    if (!student) {
      student = await db.collection('students').findOne({ studentId: id });
      console.log('[Student API] Lookup by studentId result:', student);
    }

    // If still not found, try to find by the legacy id field
    if (!student) {
      student = await db.collection('students').findOne({ id: id });
      console.log('[Student API] Lookup by id result:', student);
    }

    if (!student) {
      console.warn('[Student API] Student not found for id:', id);
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

    const body: UpdateStudentRequest = await request.json();
    // Convert date string to Date object if needed
    const updateData = {
      ...body,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined
    };
    const updatedStudent = await StudentDB.update(id, updateData);
    if (!updatedStudent) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: updatedStudent,
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
    
    console.log('[Student API] Deleting student with id:', id, 'ObjectId.isValid:', ObjectId.isValid(id));
    let deleteResult;
    
    // Try to delete by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      deleteResult = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
      console.log('[Student API] Delete by _id result:', deleteResult);
    }
    
    // If not found, try to delete by studentId
    if (deleteResult?.deletedCount === 0) {
      deleteResult = await db.collection('students').deleteOne({ studentId: id });
      console.log('[Student API] Delete by studentId result:', deleteResult);
    }
    
    // If still not found, try to delete by the legacy id field
    if (deleteResult?.deletedCount === 0) {
      deleteResult = await db.collection('students').deleteOne({ id: id });
      console.log('[Student API] Delete by id result:', deleteResult);
    }
    
    if (deleteResult?.deletedCount === 0) {
      console.warn('[Student API] Student not found for deletion, id:', id);
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }
    
    console.log('[Student API] Student deleted successfully, id:', id);
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
