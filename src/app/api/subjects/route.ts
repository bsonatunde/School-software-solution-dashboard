import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Subject } from '@/lib/models';

// Mock subjects data for Nigerian schools
const mockSubjects = [
  // Junior Secondary School (JSS) Subjects
  {
    id: 'SUB001',
    name: 'Mathematics',
    code: 'MTH',
    category: 'Core',
    level: 'JSS',
    teacher: 'Mr. Adebayo Ibrahim',
    description: 'Basic mathematics including algebra, geometry, and arithmetic'
  },
  {
    id: 'SUB002',
    name: 'English Language',
    code: 'ENG',
    category: 'Core',
    level: 'JSS',
    teacher: 'Mrs. Sarah Johnson',
    description: 'English grammar, comprehension, and composition'
  },
  {
    id: 'SUB003',
    name: 'Basic Science',
    code: 'BSC',
    category: 'Core',
    level: 'JSS',
    teacher: 'Dr. Chinedu Okwu',
    description: 'Introduction to physics, chemistry, and biology'
  },
  {
    id: 'SUB004',
    name: 'Social Studies',
    code: 'SOS',
    category: 'Core',
    level: 'JSS',
    teacher: 'Mr. Ahmed Hassan',
    description: 'Nigerian history, geography, and civic education'
  },
  {
    id: 'SUB005',
    name: 'French',
    code: 'FRE',
    category: 'Language',
    level: 'JSS',
    teacher: 'Mme. Fatima Bello',
    description: 'Basic French language and communication'
  },
  {
    id: 'SUB006',
    name: 'Yoruba',
    code: 'YOR',
    category: 'Language',
    level: 'JSS',
    teacher: 'Mr. Olusegun Ajayi',
    description: 'Yoruba language and literature'
  },
  {
    id: 'SUB007',
    name: 'Hausa',
    code: 'HAU',
    category: 'Language',
    level: 'JSS',
    teacher: 'Mallam Usman Garba',
    description: 'Hausa language and literature'
  },
  {
    id: 'SUB008',
    name: 'Igbo',
    code: 'IGB',
    category: 'Language',
    level: 'JSS',
    teacher: 'Mr. Emeka Nwosu',
    description: 'Igbo language and literature'
  },
  {
    id: 'SUB009',
    name: 'Basic Technology',
    code: 'BTE',
    category: 'Practical',
    level: 'JSS',
    teacher: 'Mr. Peter Okafor',
    description: 'Introduction to technology and technical drawing'
  },
  {
    id: 'SUB010',
    name: 'Home Economics',
    code: 'HEC',
    category: 'Practical',
    level: 'JSS',
    teacher: 'Mrs. Grace Adamu',
    description: 'Food and nutrition, clothing and textiles'
  },
  {
    id: 'SUB011',
    name: 'Agricultural Science',
    code: 'AGR',
    category: 'Practical',
    level: 'JSS',
    teacher: 'Mr. Joseph Tunde',
    description: 'Basic principles of agriculture and farming'
  },
  {
    id: 'SUB012',
    name: 'Business Studies',
    code: 'BUS',
    category: 'Commercial',
    level: 'JSS',
    teacher: 'Mrs. Kemi Oladapo',
    description: 'Introduction to business and entrepreneurship'
  },
  {
    id: 'SUB013',
    name: 'Christian Religious Studies',
    code: 'CRS',
    category: 'Religious',
    level: 'JSS',
    teacher: 'Pastor David Okon',
    description: 'Christian teachings and biblical studies'
  },
  {
    id: 'SUB014',
    name: 'Islamic Religious Studies',
    code: 'IRS',
    category: 'Religious',
    level: 'JSS',
    teacher: 'Sheikh Abdul Rahman',
    description: 'Islamic teachings and Quranic studies'
  },
  {
    id: 'SUB015',
    name: 'Physical Education',
    code: 'PHE',
    category: 'Practical',
    level: 'JSS',
    teacher: 'Coach Mike Oduya',
    description: 'Physical fitness and sports activities'
  },

  // Senior Secondary School (SS) Subjects
  {
    id: 'SUB016',
    name: 'Mathematics',
    code: 'MTH',
    category: 'Core',
    level: 'SS',
    teacher: 'Dr. Bolaji Adeyemi',
    description: 'Advanced mathematics including calculus and statistics'
  },
  {
    id: 'SUB017',
    name: 'English Language',
    code: 'ENG',
    category: 'Core',
    level: 'SS',
    teacher: 'Mrs. Elizabeth Nkem',
    description: 'Advanced English language and literature'
  },
  {
    id: 'SUB018',
    name: 'Physics',
    code: 'PHY',
    category: 'Science',
    level: 'SS',
    teacher: 'Dr. Michael Eze',
    description: 'Mechanics, electricity, and modern physics'
  },
  {
    id: 'SUB019',
    name: 'Chemistry',
    code: 'CHE',
    category: 'Science',
    level: 'SS',
    teacher: 'Dr. Amina Yusuf',
    description: 'Organic, inorganic, and physical chemistry'
  },
  {
    id: 'SUB020',
    name: 'Biology',
    code: 'BIO',
    category: 'Science',
    level: 'SS',
    teacher: 'Dr. Funmi Ogundimu',
    description: 'Life processes, genetics, and ecology'
  },
  {
    id: 'SUB021',
    name: 'Economics',
    code: 'ECO',
    category: 'Commercial',
    level: 'SS',
    teacher: 'Mr. Sani Musa',
    description: 'Microeconomics, macroeconomics, and development economics'
  },
  {
    id: 'SUB022',
    name: 'Accounting',
    code: 'ACC',
    category: 'Commercial',
    level: 'SS',
    teacher: 'Mrs. Folake Oni',
    description: 'Financial accounting and cost accounting'
  },
  {
    id: 'SUB023',
    name: 'Government',
    code: 'GOV',
    category: 'Arts',
    level: 'SS',
    teacher: 'Mr. Tunde Bakare',
    description: 'Political science and Nigerian government'
  },
  {
    id: 'SUB024',
    name: 'Literature in English',
    code: 'LIT',
    category: 'Arts',
    level: 'SS',
    teacher: 'Mrs. Chioma Okeke',
    description: 'Poetry, prose, and drama analysis'
  },
  {
    id: 'SUB025',
    name: 'Geography',
    code: 'GEO',
    category: 'Arts',
    level: 'SS',
    teacher: 'Mr. Yakubu Danjuma',
    description: 'Physical and human geography'
  },
  {
    id: 'SUB026',
    name: 'History',
    code: 'HIS',
    category: 'Arts',
    level: 'SS',
    teacher: 'Dr. Adaora Ibe',
    description: 'Nigerian and world history'
  },
  {
    id: 'SUB027',
    name: 'Further Mathematics',
    code: 'FMA',
    category: 'Science',
    level: 'SS',
    teacher: 'Dr. Rasheed Alabi',
    description: 'Advanced mathematics and applied mathematics'
  },
  {
    id: 'SUB028',
    name: 'Technical Drawing',
    code: 'TDR',
    category: 'Technical',
    level: 'SS',
    teacher: 'Mr. Collins Obi',
    description: 'Engineering drawing and technical design'
  },
  {
    id: 'SUB029',
    name: 'Food and Nutrition',
    code: 'FAN',
    category: 'Practical',
    level: 'SS',
    teacher: 'Mrs. Blessing Amos',
    description: 'Advanced nutrition and food science'
  },
  {
    id: 'SUB030',
    name: 'Computer Science',
    code: 'CSC',
    category: 'Technical',
    level: 'SS',
    teacher: 'Mr. Daniel Adebisi',
    description: 'Programming, algorithms, and computer systems'
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // JSS or SS
    const category = searchParams.get('category');
    const classLevel = searchParams.get('class');

    let query: any = {};

    // Filter by level (determine from class if provided)
    if (classLevel) {
      const isJSS = classLevel.startsWith('JSS');
      query.level = isJSS ? 'JSS' : 'SS';
    } else if (level) {
      query.level = level;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    const subjects = await Subject.find(query).sort({ name: 1 });

    // If no subjects found in database, return mock data for demonstration
    if (subjects.length === 0) {
      const filteredMockSubjects = mockSubjects.filter(subject => {
        if (classLevel) {
          const isJSS = classLevel.startsWith('JSS');
          return isJSS ? subject.level === 'JSS' : subject.level === 'SS';
        }
        if (level) return subject.level === level;
        if (category) return subject.category === category;
        return true;
      });

      return NextResponse.json({
        success: true,
        subjects: filteredMockSubjects,
        count: filteredMockSubjects.length,
        message: 'Subjects fetched successfully (using mock data)'
      });
    }

    return NextResponse.json({
      success: true,
      subjects: subjects,
      count: subjects.length,
      message: 'Subjects fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, category, level, teacher, description } = body;

    // Validate required fields
    if (!name || !code || !category || !level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if subject code already exists
    const existingSubject = mockSubjects.find(subject => subject.code === code && subject.level === level);
    if (existingSubject) {
      return NextResponse.json(
        { success: false, error: 'Subject code already exists for this level' },
        { status: 400 }
      );
    }

    // Create new subject
    const newSubject = {
      id: `SUB${String(mockSubjects.length + 1).padStart(3, '0')}`,
      name,
      code: code.toUpperCase(),
      category,
      level,
      teacher: teacher || 'TBA',
      description: description || ''
    };

    mockSubjects.push(newSubject);

    return NextResponse.json({
      success: true,
      data: newSubject,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
