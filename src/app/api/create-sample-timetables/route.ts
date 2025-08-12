import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Timetable, Student, Class, Subject } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get some active classes
    const classes = await Class.find({ status: 'Active' }).limit(3);
    if (classes.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active classes found. Please create classes first.'
      }, { status: 404 });
    }

    // Days of the week
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Common Nigerian school subjects with periods
    const subjects = [
      { id: 'SUB001', name: 'Mathematics', teacher: 'Mr. Adebayo Ibrahim' },
      { id: 'SUB002', name: 'English Language', teacher: 'Mrs. Sarah Johnson' },
      { id: 'SUB003', name: 'Basic Science', teacher: 'Dr. Chinedu Okwu' },
      { id: 'SUB004', name: 'Social Studies', teacher: 'Mr. Ahmed Hassan' },
      { id: 'SUB005', name: 'French', teacher: 'Mme. Fatima Bello' },
      { id: 'SUB006', name: 'Computer Studies', teacher: 'Mr. Kola Adeyemi' },
      { id: 'SUB007', name: 'Christian Religious Studies', teacher: 'Rev. David Adebola' },
      { id: 'SUB008', name: 'Hausa', teacher: 'Mal. Usman Bello' },
      { id: 'SUB009', name: 'History', teacher: 'Mrs. Blessing Eze' },
      { id: 'SUB010', name: 'Creative Arts', teacher: 'Mr. Victor Okafor' },
      { id: 'SUB011', name: 'Physical Education', teacher: 'Coach Emeka Nwachukwu' },
      { id: 'SUB012', name: 'Business Studies', teacher: 'Mrs. Funmi Adesola' }
    ];

    // Common school venues
    const venues = [
      'Room 101', 'Room 102', 'Room 103', 'Science Lab 1', 'Science Lab 2',
      'Computer Lab', 'Language Lab', 'Arts Room', 'Sports Field', 'Library',
      'Music Room', 'Assembly Hall'
    ];

    const createdTimetables = [];

    // Create timetables for each class and day
    for (const classItem of classes) {
      for (const day of daysOfWeek) {
        // Generate periods for the day
        const periods = [];
        
        // Period 1: 08:00-08:40
        periods.push({
          periodNumber: 1,
          startTime: '08:00',
          endTime: '08:40',
          subjectId: subjects[0].id,
          subjectName: subjects[0].name,
          teacherId: 'TCH001',
          teacherName: subjects[0].teacher,
          venue: venues[Math.floor(Math.random() * 3)], // Use first 3 rooms
          duration: 40,
          isBreak: false
        });

        // Period 2: 08:40-09:20
        periods.push({
          periodNumber: 2,
          startTime: '08:40',
          endTime: '09:20',
          subjectId: subjects[1].id,
          subjectName: subjects[1].name,
          teacherId: 'TCH002',
          teacherName: subjects[1].teacher,
          venue: venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Period 3: 09:20-10:00
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        periods.push({
          periodNumber: 3,
          startTime: '09:20',
          endTime: '10:00',
          subjectId: randomSubject.id,
          subjectName: randomSubject.name,
          teacherId: 'TCH003',
          teacherName: randomSubject.teacher,
          venue: randomSubject.name.includes('Science') ? 'Science Lab 1' : venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Break: 10:00-10:20
        periods.push({
          periodNumber: 4,
          startTime: '10:00',
          endTime: '10:20',
          subjectId: 'BREAK',
          subjectName: 'Morning Break',
          teacherId: '',
          teacherName: '',
          venue: 'Playground',
          duration: 20,
          isBreak: true
        });

        // Period 5: 10:20-11:00
        const randomSubject2 = subjects[Math.floor(Math.random() * subjects.length)];
        periods.push({
          periodNumber: 5,
          startTime: '10:20',
          endTime: '11:00',
          subjectId: randomSubject2.id,
          subjectName: randomSubject2.name,
          teacherId: 'TCH004',
          teacherName: randomSubject2.teacher,
          venue: randomSubject2.name.includes('Computer') ? 'Computer Lab' : venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Period 6: 11:00-11:40
        const randomSubject3 = subjects[Math.floor(Math.random() * subjects.length)];
        periods.push({
          periodNumber: 6,
          startTime: '11:00',
          endTime: '11:40',
          subjectId: randomSubject3.id,
          subjectName: randomSubject3.name,
          teacherId: 'TCH005',
          teacherName: randomSubject3.teacher,
          venue: randomSubject3.name.includes('Physical') ? 'Sports Field' : venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Period 7: 11:40-12:20
        const randomSubject4 = subjects[Math.floor(Math.random() * subjects.length)];
        periods.push({
          periodNumber: 7,
          startTime: '11:40',
          endTime: '12:20',
          subjectId: randomSubject4.id,
          subjectName: randomSubject4.name,
          teacherId: 'TCH006',
          teacherName: randomSubject4.teacher,
          venue: randomSubject4.name.includes('Arts') ? 'Arts Room' : venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Lunch: 12:20-13:00
        periods.push({
          periodNumber: 8,
          startTime: '12:20',
          endTime: '13:00',
          subjectId: 'LUNCH',
          subjectName: 'Lunch Break',
          teacherId: '',
          teacherName: '',
          venue: 'Cafeteria',
          duration: 40,
          isBreak: true
        });

        // Period 9: 13:00-13:40
        const randomSubject5 = subjects[Math.floor(Math.random() * subjects.length)];
        periods.push({
          periodNumber: 9,
          startTime: '13:00',
          endTime: '13:40',
          subjectId: randomSubject5.id,
          subjectName: randomSubject5.name,
          teacherId: 'TCH007',
          teacherName: randomSubject5.teacher,
          venue: venues[Math.floor(Math.random() * 3)],
          duration: 40,
          isBreak: false
        });

        // Check if timetable already exists
        const existingTimetable = await Timetable.findOne({
          classId: classItem.classId || classItem._id,
          dayOfWeek: day,
          term: 'First',
          academicYear: '2024/2025',
          status: 'Active'
        });

        if (!existingTimetable) {
          const timetable = new Timetable({
            classId: classItem.classId || classItem._id,
            className: classItem.className || classItem.name,
            term: 'First',
            academicYear: '2024/2025',
            dayOfWeek: day,
            periods,
            createdBy: 'admin001',
            status: 'Active'
          });

          await timetable.save();
          createdTimetables.push(timetable);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: createdTimetables,
      message: `Created ${createdTimetables.length} sample timetables successfully`
    });

  } catch (error: any) {
    console.error('Error creating sample timetables:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create sample timetables'
    }, { status: 500 });
  }
}
