
'use client';
import { useState, useEffect, use } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useRouter, useParams } from 'next/navigation';

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  class: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  dateOfAdmission: string;
  status: string;
  nationality: string;
  stateOfOrigin: string;
  bloodGroup?: string;
  medicalConditions?: string;
}

export default function StudentDetailsPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [activeTab, setActiveTab] = useState('academic');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const router = useRouter();

  // Handler functions for report card actions
  const handleDownloadReportCard = async () => {
    if (!student) {
      alert('❌ Student data not available. Please refresh the page and try again.');
      return;
    }

    setIsDownloading(true);
    try {
      // Simulate API call to generate PDF
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const studentName = `${student.firstName} ${student.lastName}` || 'Student';
      
      // Create a downloadable HTML report card that can be saved as PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Academic Report - ${studentName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
        .school-name { color: #0ea5e9; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .report-title { color: #64748b; font-size: 20px; margin-bottom: 5px; }
        .term-info { color: #64748b; font-size: 14px; }
        .student-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .info-label { font-weight: bold; color: #374151; }
        .info-value { color: #6b7280; }
        .performance-summary { background: linear-gradient(135deg, #dbeafe, #dcfce7); padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; }
        .summary-item { background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-value { font-size: 24px; font-weight: bold; color: #0ea5e9; }
        .summary-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .grades-table th { background: #0ea5e9; color: white; padding: 12px; text-align: left; font-size: 12px; }
        .grades-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .grades-table tr:nth-child(even) { background: #f9fafb; }
        .grade-a { color: #059669; font-weight: bold; }
        .grade-b { color: #0891b2; font-weight: bold; }
        .comments { margin-top: 30px; }
        .comment-section { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 20px; }
        .comment-title { font-weight: bold; color: #92400e; margin-bottom: 10px; }
        .comment-text { font-style: italic; color: #78350f; margin-bottom: 10px; }
        .comment-author { font-weight: bold; color: #92400e; font-size: 14px; }
        .signature-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 50px; }
        .signature-box { text-align: center; }
        .signature-line { border-bottom: 1px solid #374151; margin-bottom: 5px; height: 40px; }
        .signature-label { font-size: 12px; color: #6b7280; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="school-name">🏫 PACEY SCHOOL</div>
        <div class="report-title">Academic Report Card</div>
        <div class="term-info">First Term 2024/25 Academic Session</div>
    </div>
    
    <div class="student-info">
        <h3 style="margin-top: 0; color: #374151;">Student Information</h3>
        <div class="info-row">
            <span class="info-label">Full Name:</span>
            <span class="info-value">${studentName}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Admission Number:</span>
            <span class="info-value">${student.studentId || 'PSS/STD/001'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Class:</span>
            <span class="info-value">${student.class || 'SS2A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Term:</span>
            <span class="info-value">First Term 2024/25</span>
        </div>
    </div>
    
    <div class="performance-summary">
        <h3 style="margin-top: 0; text-align: center; color: #374151;">Performance Summary</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-value">86%</div>
                <div class="summary-label">Overall Average</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #059669;">A</div>
                <div class="summary-label">Grade</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #7c3aed;">3rd</div>
                <div class="summary-label">Class Position</div>
            </div>
            <div class="summary-item">
                <div class="summary-value" style="color: #ea580c;">35</div>
                <div class="summary-label">Total Students</div>
            </div>
        </div>
    </div>
    
    <h3 style="color: #374151;">📚 Subject-wise Performance</h3>
    <table class="grades-table">
        <thead>
            <tr>
                <th>Subject</th>
                <th>CA Score (40%)</th>
                <th>Exam Score (60%)</th>
                <th>Total (100%)</th>
                <th>Grade</th>
                <th>Position</th>
                <th>Remark</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Mathematics</td>
                <td>35/40</td>
                <td>50/60</td>
                <td><strong>85/100</strong></td>
                <td class="grade-a">A</td>
                <td>2nd</td>
                <td class="grade-a">Excellent</td>
            </tr>
            <tr>
                <td>English Language</td>
                <td>32/40</td>
                <td>46/60</td>
                <td><strong>78/100</strong></td>
                <td class="grade-b">B+</td>
                <td>5th</td>
                <td class="grade-b">Very Good</td>
            </tr>
            <tr>
                <td>Physics</td>
                <td>38/40</td>
                <td>54/60</td>
                <td><strong>92/100</strong></td>
                <td class="grade-a">A+</td>
                <td>1st</td>
                <td class="grade-a">Outstanding</td>
            </tr>
            <tr>
                <td>Chemistry</td>
                <td>36/40</td>
                <td>53/60</td>
                <td><strong>89/100</strong></td>
                <td class="grade-a">A</td>
                <td>3rd</td>
                <td class="grade-a">Excellent</td>
            </tr>
            <tr>
                <td>Biology</td>
                <td>34/40</td>
                <td>47/60</td>
                <td><strong>81/100</strong></td>
                <td class="grade-a">A-</td>
                <td>4th</td>
                <td class="grade-b">Very Good</td>
            </tr>
            <tr>
                <td>Geography</td>
                <td>33/40</td>
                <td>51/60</td>
                <td><strong>84/100</strong></td>
                <td class="grade-a">A</td>
                <td>2nd</td>
                <td class="grade-a">Excellent</td>
            </tr>
        </tbody>
    </table>
    
    <div class="comments">
        <div class="comment-section">
            <div class="comment-title">👨‍🏫 Class Teacher's Comments</div>
            <div class="comment-text">"${studentName} has shown exceptional performance this term, particularly in Physics where they achieved the highest score in class. Their consistent effort in Mathematics and Chemistry is commendable. However, there's room for improvement in English Language. I encourage continued dedication to maintain this excellent academic trajectory."</div>
            <div class="comment-author">Mrs. Sarah Johnson - Class Teacher, SS2A</div>
        </div>
        
        <div class="comment-section" style="background: #eff6ff; border-left-color: #3b82f6;">
            <div class="comment-title" style="color: #1e40af;">🎓 Principal's Remarks</div>
            <div class="comment-text" style="color: #1e3a8a;">"An outstanding student with consistent academic excellence. Keep up the good work and continue to be a role model for other students."</div>
            <div class="comment-author" style="color: #1e40af;">Dr. Michael Adebayo - Principal</div>
        </div>
    </div>
    
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Class Teacher's Signature</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Principal's Signature</div>
        </div>
        <div class="signature-box">
            <div class="signature-line"></div>
            <div class="signature-label">Parent's Signature</div>
        </div>
    </div>
    
    <div class="footer">
        <strong>Next Term Resumption:</strong> January 15, 2025 | <strong>School Fees:</strong> ₦45,000 (Due: January 10, 2025)<br>
        <em>Pacey School - Nurturing Excellence in Education</em>
    </div>
    
    <div class="no-print" style="margin-top: 30px; text-align: center; background: #f3f4f6; padding: 15px; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280;"><strong>Instructions:</strong> To save as PDF, press Ctrl+P and select "Save as PDF" as the destination.</p>
    </div>
</body>
</html>`;
      
      // Create and download HTML file that can be opened and saved as PDF
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${studentName}_Report_Card_First_Term_2024-25.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`📄 Report card downloaded successfully for ${studentName}! \n\nThe file has been saved as an HTML document. To convert to PDF:\n1. Open the downloaded HTML file in your browser\n2. Press Ctrl+P to print\n3. Select "Save as PDF" as the destination`);
    } catch (error) {
      alert('❌ Failed to download report card. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailToParent = async () => {
    if (!student) {
      alert('❌ Student data not available. Please refresh the page and try again.');
      return;
    }

    setIsEmailing(true);
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const studentName = `${student.firstName} ${student.lastName}` || 'Student';
      const parentEmail = `parent.${student.email}` || 'parent@example.com';
      
      // Mock email sending logic
      const emailData = {
        to: parentEmail,
        subject: `Academic Report - ${studentName} - First Term 2024/25`,
        body: `
Dear Parent/Guardian,

Please find attached the academic report for ${studentName} for the First Term of 2024/25 academic session.

Performance Summary:
- Overall Average: 86%
- Grade: A
- Class Position: 3rd out of 35 students

Your child has shown excellent performance this term. Please review the detailed report and contact us if you have any questions.

Best regards,
Pacey School Administration
        `
      };
      
      console.log('Email sent:', emailData);
      alert(`📧 Report card emailed successfully to ${studentName}'s parent!`);
    } catch (error) {
      alert('❌ Failed to send email. Please try again.');
    } finally {
      setIsEmailing(false);
    }
  };

  const handlePrintResults = async () => {
    if (!student) {
      alert('❌ Student data not available. Please refresh the page and try again.');
      return;
    }

    setIsPrinting(true);
    try {
      // Simulate preparation for printing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a printable version of the results
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const studentName = `${student.firstName} ${student.lastName}` || 'Student';
        const studentId = student.studentId || 'N/A';
        const studentClass = student.class || 'N/A';
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Academic Report - ${studentName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .student-info { margin-bottom: 30px; }
              .grades-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .grades-table th, .grades-table td { border: 1px solid #333; padding: 8px; text-align: left; }
              .grades-table th { background-color: #f0f0f0; }
              .comments { margin-top: 30px; }
              .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏫 PACEY SCHOOL</h1>
              <h2>Academic Report Card</h2>
              <p>First Term 2024/25 Academic Session</p>
            </div>
            
            <div class="student-info">
              <h3>Student Information</h3>
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Student ID:</strong> ${studentId}</p>
              <p><strong>Class:</strong> ${studentClass}</p>
              <p><strong>Term:</strong> First Term 2024/25</p>
            </div>
            
            <div class="performance-summary">
              <h3>Performance Summary</h3>
              <p><strong>Overall Average:</strong> 86%</p>
              <p><strong>Grade:</strong> A</p>
              <p><strong>Class Position:</strong> 3rd out of 35 students</p>
            </div>
            
            <table class="grades-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>CA Score (40%)</th>
                  <th>Exam Score (60%)</th>
                  <th>Total (100%)</th>
                  <th>Grade</th>
                  <th>Position</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mathematics</td>
                  <td>35/40</td>
                  <td>50/60</td>
                  <td>85/100</td>
                  <td>A</td>
                  <td>2nd</td>
                  <td>Excellent</td>
                </tr>
                <tr>
                  <td>English Language</td>
                  <td>32/40</td>
                  <td>46/60</td>
                  <td>78/100</td>
                  <td>B+</td>
                  <td>5th</td>
                  <td>Very Good</td>
                </tr>
                <tr>
                  <td>Physics</td>
                  <td>38/40</td>
                  <td>54/60</td>
                  <td>92/100</td>
                  <td>A+</td>
                  <td>1st</td>
                  <td>Outstanding</td>
                </tr>
                <tr>
                  <td>Chemistry</td>
                  <td>36/40</td>
                  <td>53/60</td>
                  <td>89/100</td>
                  <td>A</td>
                  <td>3rd</td>
                  <td>Excellent</td>
                </tr>
                <tr>
                  <td>Biology</td>
                  <td>34/40</td>
                  <td>47/60</td>
                  <td>81/100</td>
                  <td>A-</td>
                  <td>4th</td>
                  <td>Very Good</td>
                </tr>
                <tr>
                  <td>Geography</td>
                  <td>33/40</td>
                  <td>51/60</td>
                  <td>84/100</td>
                  <td>A</td>
                  <td>2nd</td>
                  <td>Excellent</td>
                </tr>
              </tbody>
            </table>
            
            <div class="comments">
              <h3>Teacher's Comments</h3>
              <p><em>"${studentName} has shown exceptional performance this term, particularly in Physics where they achieved the highest score in class. Their consistent effort in Mathematics and Chemistry is commendable. However, there's room for improvement in English Language. I encourage continued dedication to maintain this excellent academic trajectory."</em></p>
              <p><strong>Mrs. Sarah Johnson</strong> - Class Teacher, SS2A</p>
              
              <h3>Principal's Remarks</h3>
              <p><em>"An outstanding student with consistent academic excellence. Keep up the good work and continue to be a role model for other students."</em></p>
              <p><strong>Dr. Michael Adebayo</strong> - Principal</p>
            </div>
            
            <div class="signature-section">
              <div>
                <p>_________________________</p>
                <p>Class Teacher's Signature</p>
              </div>
              <div>
                <p>_________________________</p>
                <p>Principal's Signature</p>
              </div>
              <div>
                <p>_________________________</p>
                <p>Parent's Signature</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
              <p>Next Term Resumption: January 15, 2025 | School Fees: ₦45,000 (Due: January 10, 2025)</p>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Auto print after a short delay
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    } catch (error) {
      alert('❌ Failed to prepare results for printing. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/students/${id}`);
        const data = await response.json();
        if (!data.success) {
          setError(data.error || 'Failed to fetch student');
        } else {
          setStudent({ ...data.data, _id: data.data._id || data.data.id });
          setFormData(data.data);
        }
      } catch (err) {
        setError('Failed to fetch student');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Map frontend fields to backend expected fields
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        classId: formData.class,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        localGovernment: (formData as any).localGovernment,
        medicalConditions: formData.medicalConditions,
        status: formData.status,
      };
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update student');
      }
      setStudent(data.data);
      setIsEditing(false);
      alert('Student updated successfully!');
    } catch (err) {
      console.error('Error updating student:', err);
      alert(err instanceof Error ? err.message : 'Failed to update student');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete student');
      }
      
      alert('Student deleted successfully!');
      router.push('/students');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout userRole="admin">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading student</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || 'Student not found'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/students')}
                  className="bg-red-100 px-3 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Back to Students
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600">Student ID: {student.studentId}</p>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(student);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Edit Student
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Student
                </button>
              </>
            )}
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{student.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{student.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{student.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{student.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{student.gender}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                ) : (
                  <p className="text-gray-900">{student.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">{student.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admission Date:</span>
                  <span className="font-medium">{new Date(student.dateOfAdmission).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nationality:</span>
                  <span className="font-medium">{student.nationality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State of Origin:</span>
                  <span className="font-medium">{student.stateOfOrigin}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{student.parentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{student.parentPhone}</p>
                </div>
                {student.parentEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{student.parentEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for additional information */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button 
                onClick={() => setActiveTab('academic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'academic' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📚 Academic Records
              </button>
              <button 
                onClick={() => setActiveTab('attendance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'attendance' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Attendance
              </button>
              <button 
                onClick={() => setActiveTab('fees')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'fees' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                💰 Fee Records
              </button>
              <button 
                onClick={() => setActiveTab('disciplinary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'disciplinary' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚖️ Disciplinary
              </button>
            </nav>
          </div>
          <div className="p-6">
            {/* Academic Records Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">📚</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Academic Records</h3>
                  <p className="text-gray-500 mb-4">View student&apos;s academic performance and results.</p>
                  <button 
                    onClick={() => setShowResultsModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Results
                  </button>
                </div>
                
                {/* Sample Academic Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">📊 Current Term Grades</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Mathematics</span>
                        <span className="text-sm font-medium text-green-600">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">English Language</span>
                        <span className="text-sm font-medium text-green-600">78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Physics</span>
                        <span className="text-sm font-medium text-blue-600">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Chemistry</span>
                        <span className="text-sm font-medium text-green-600">89%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">🎯 Performance Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overall Average</span>
                        <span className="text-sm font-medium text-blue-600">86%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Class Position</span>
                        <span className="text-sm font-medium">3rd of 35</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Grade</span>
                        <span className="text-sm font-medium text-green-600">A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Term</span>
                        <span className="text-sm font-medium">First Term 2024/25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">📋</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Attendance Records</h3>
                  <p className="text-gray-500 mb-4">Track student attendance and punctuality.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-gray-600">Overall Attendance</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">47</div>
                    <div className="text-sm text-gray-600">Days Present</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-gray-600">Days Absent</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">📅 Recent Attendance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">August 5, 2025</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Present</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">August 4, 2025</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Present</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">August 3, 2025</span>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Absent</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">August 2, 2025</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Present</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fee Records Tab */}
            {activeTab === 'fees' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">💰</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Fee Records</h3>
                  <p className="text-gray-500 mb-4">View payment history and outstanding fees.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">💳 Payment Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">School Fees (Term 1)</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Paid</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Development Levy</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Paid</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sports Fee</span>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">PTA Dues</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Paid</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">📊 Financial Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Fees</span>
                        <span className="text-sm font-medium">₦150,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount Paid</span>
                        <span className="text-sm font-medium text-green-600">₦145,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Outstanding</span>
                        <span className="text-sm font-medium text-red-600">₦5,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Due Date</span>
                        <span className="text-sm font-medium">Aug 15, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disciplinary Tab */}
            {activeTab === 'disciplinary' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">⚖️</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Disciplinary Records</h3>
                  <p className="text-gray-500 mb-4">View behavior reports and disciplinary actions.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">🏆 Behavior Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overall Rating</span>
                        <span className="text-sm font-medium text-green-600">Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Punctuality</span>
                        <span className="text-sm font-medium text-green-600">Very Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Participation</span>
                        <span className="text-sm font-medium text-blue-600">Outstanding</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Homework</span>
                        <span className="text-sm font-medium text-green-600">Very Good</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">📝 Recent Reports</h4>
                    <div className="space-y-3">
                      <div className="bg-green-100 p-3 rounded border-l-4 border-green-400">
                        <p className="text-sm font-medium text-green-800">Commendation</p>
                        <p className="text-xs text-green-700">Excellent performance in Mathematics competition - July 2025</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-400">
                        <p className="text-sm font-medium text-blue-800">Recognition</p>
                        <p className="text-xs text-blue-700">Helpful peer mentoring behavior - June 2025</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded border-l-4 border-gray-400">
                        <p className="text-sm font-medium text-gray-800">No disciplinary issues</p>
                        <p className="text-xs text-gray-700">Maintains excellent conduct record</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Modal */}
        {showResultsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">📊 Academic Results - {student.firstName} {student.lastName}</h2>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6">
                {/* Term Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Term</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
                    <option>First Term 2024/25 (Current)</option>
                    <option>Third Term 2023/24</option>
                    <option>Second Term 2023/24</option>
                    <option>First Term 2023/24</option>
                  </select>
                </div>

                {/* Performance Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">86%</div>
                      <div className="text-sm text-gray-600">Overall Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">A</div>
                      <div className="text-sm text-gray-600">Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">3rd</div>
                      <div className="text-sm text-gray-600">Class Position</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">35</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Subject Results */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">📚 Subject-wise Performance</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Score (40%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Score (60%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (100%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mathematics</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">35/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">85/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2nd</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Excellent</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">English Language</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">32/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">46/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">78/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">B+</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5th</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Very Good</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Physics</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">38/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">54/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">92/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A+</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1st</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Outstanding</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Chemistry</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">36/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">53/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">89/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3rd</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Excellent</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Biology</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">34/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">47/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">81/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A-</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4th</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Very Good</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Geography</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">33/40</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">51/60</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">84/100</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">A</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2nd</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Excellent</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Class Teacher's Comments */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">👨‍🏫 Teacher&apos;s Comments</h3>
                  <p className="text-gray-700 italic">
                    &quot;{student.firstName} {student.lastName} has shown exceptional performance this term, particularly in Physics where they achieved the highest score in class. 
                    Their consistent effort in Mathematics and Chemistry is commendable. However, there&apos;s room for improvement in English Language. 
                    I encourage continued dedication to maintain this excellent academic trajectory.&quot;
                  </p>
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Mrs. Sarah Johnson</strong> - Class Teacher, SS2A
                  </div>
                </div>

                {/* Principal's Remarks */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🎓 Principal&apos;s Remarks</h3>
                  <p className="text-gray-700 italic">
                    &quot;An outstanding student with consistent academic excellence. Keep up the good work and continue to be a role model for other students.&quot;
                  </p>
                  <div className="mt-3 text-sm text-gray-600">
                    <strong>Dr. Michael Adebayo</strong> - Principal
                  </div>
                </div>

                {/* Next Term Resumption */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">📅 Next Term Resumption</h4>
                      <p className="text-sm text-gray-600">Second Term 2024/25 begins on January 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">School Fees: ₦45,000</div>
                      <div className="text-xs text-red-600">Due: January 10, 2025</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
                <button 
                  onClick={() => setShowResultsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <div className="space-x-3">
                  <button 
                    onClick={handleDownloadReportCard}
                    disabled={isDownloading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? '⏳ Downloading...' : '📄 Download Report Card'}
                  </button>
                  <button 
                    onClick={handleEmailToParent}
                    disabled={isEmailing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEmailing ? '⏳ Sending...' : '📧 Email to Parent'}
                  </button>
                  <button 
                    onClick={handlePrintResults}
                    disabled={isPrinting}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPrinting ? '⏳ Preparing...' : '🖨️ Print Results'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
