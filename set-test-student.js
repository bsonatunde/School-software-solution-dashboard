// Script to set up a test student session in localStorage
// Run this in the browser console to simulate a logged-in student

const testStudent = {
  _id: "6899b693855f3a6eb07267d2",
  studentId: "PSS/2025/001",
  firstName: "Test",
  lastName: "Student",
  email: "teststudent@example.com",
  class: "JSS1",
  role: "student"
};

// Set the user data in localStorage
localStorage.setItem('user', JSON.stringify(testStudent));

console.log('Test student session set up:', testStudent);
console.log('Reload the page to use this session');
