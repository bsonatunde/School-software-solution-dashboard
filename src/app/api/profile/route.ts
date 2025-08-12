import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType') || 'staff'; // staff, student, admin

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    let collection = 'staff';
    if (userType === 'student') {
      collection = 'students';
    }

    // Get user profile from appropriate collection
    let query: any = {
      $or: [
        { employeeId: userId },
        { admissionNumber: userId }
      ]
    };

    // Only add ObjectId search if userId is a valid ObjectId
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or.push({ _id: new ObjectId(userId) });
    }

    const user = await db.collection(collection).findOne(query);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Remove sensitive information
    const { ...profile } = user;
    delete profile.password;

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile._id,
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          phone: profile.phoneNumber,
          address: profile.address,
          dateOfBirth: profile.dateOfBirth,
          employeeId: profile.employeeId || profile.admissionNumber,
          department: profile.department || profile.classId,
          position: profile.position || 'Student',
          joinDate: profile.dateOfHire || profile.enrollmentDate,
          profilePhoto: profile.profileImage,
          emergencyContact: profile.emergencyContact,
          gender: profile.gender,
          nationality: profile.nationality,
          stateOfOrigin: profile.stateOfOrigin,
          qualification: profile.qualification,
          specialization: profile.specialization,
          status: profile.status
        }
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile'
    }, { status: 500 });
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', updates } = body;

    if (!userId || !updates) {
      return NextResponse.json({
        success: false,
        error: 'User ID and updates are required'
      }, { status: 400 });
    }

    let collection = 'staff';
    if (userType === 'student') {
      collection = 'students';
    }

    // Prepare update object
    const updateFields: any = {};
    
    if (updates.name) {
      const [firstName, ...lastNameParts] = updates.name.split(' ');
      updateFields.firstName = firstName;
      updateFields.lastName = lastNameParts.join(' ');
    }
    
    if (updates.email) updateFields.email = updates.email;
    if (updates.phone) updateFields.phoneNumber = updates.phone;
    if (updates.address) updateFields.address = updates.address;
    if (updates.dateOfBirth) updateFields.dateOfBirth = new Date(updates.dateOfBirth);
    if (updates.profilePhoto) updateFields.profileImage = updates.profilePhoto;
    if (updates.emergencyContact) updateFields.emergencyContact = updates.emergencyContact;
    if (updates.department) updateFields.department = updates.department;
    if (updates.position) updateFields.position = updates.position;
    if (updates.qualification) updateFields.qualification = updates.qualification;
    if (updates.specialization) updateFields.specialization = updates.specialization;

    // Add updated timestamp
    updateFields.updatedAt = new Date();

    // Update the user profile
    let updateQuery: any = {
      $or: [
        { employeeId: userId },
        { admissionNumber: userId }
      ]
    };

    // Only add ObjectId search if userId is a valid ObjectId
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      updateQuery.$or.push({ _id: new ObjectId(userId) });
    }

    const result = await db.collection(collection).updateOne(
      updateQuery,
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 });
  }
}

// POST /api/profile/password - Change user password  
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { userId, userType = 'staff', currentPassword, newPassword } = body;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'All password fields are required'
      }, { status: 400 });
    }

    let collection = 'staff';
    if (userType === 'student') {
      collection = 'students';
    }

    // For now, we'll just update the password directly
    // In a real implementation, you'd verify the current password first
    const result = await db.collection(collection).updateOne(
      {
        $or: [
          { _id: new ObjectId(userId) },
          { employeeId: userId },
          { admissionNumber: userId }
        ]
      },
      { 
        $set: { 
          password: newPassword, // In production, hash this password
          updatedAt: new Date(),
          passwordChangedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to change password'
    }, { status: 500 });
  }
}
