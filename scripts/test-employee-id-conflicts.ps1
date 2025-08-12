# Test Employee ID Conflict Prevention Script
# This script tests the employee ID generation and conflict resolution system

Write-Host "🔧 Testing Employee ID Conflict Prevention System" -ForegroundColor Cyan
Write-Host "=" * 60

# Test 1: Check existing employee with PSS/EMP/004
Write-Host "`n📋 Test 1: Checking existing employee with PSS/EMP/004" -ForegroundColor Yellow
$response1 = Invoke-RestMethod -Uri "http://localhost:3000/api/debug/check-employee-id" -Method POST -ContentType "application/json" -Body '{"employeeId":"PSS/EMP/004"}'
Write-Host "Response:" $response1 -ForegroundColor Green

# Test 2: Generate new teacher ID (should avoid conflict)
Write-Host "`n📋 Test 2: Generating new teacher employee ID" -ForegroundColor Yellow
try {
    $newTeacher = @{
        firstName = "John"
        lastName = "Doe"
        email = "john.doe@test.com"
        phoneNumber = "08012345678"
        address = "123 Test Street, Lagos"
        dateOfBirth = "1985-05-15"
        hireDate = "2024-01-15"
        subjects = @("Mathematics", "Physics")
        specializations = @("Science")
        employmentStatus = "active"
        emergencyContact = @{
            name = "Jane Doe"
            relationship = "Spouse"
            phoneNumber = "08087654321"
        }
    }
    
    $teacherJson = $newTeacher | ConvertTo-Json -Depth 3
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/api/teachers" -Method POST -ContentType "application/json" -Body $teacherJson
    Write-Host "New Teacher Created:" -ForegroundColor Green
    Write-Host "Employee ID: $($response2.teacher.employeeId)" -ForegroundColor Cyan
    Write-Host "Name: $($response2.teacher.firstName) $($response2.teacher.lastName)" -ForegroundColor Cyan
    
    $newTeacherId = $response2.teacher.employeeId
} catch {
    Write-Host "Error creating teacher: $($_.Exception.Message)" -ForegroundColor Red
    $newTeacherId = $null
}

# Test 3: Generate new staff ID
Write-Host "`n📋 Test 3: Generating new staff employee ID" -ForegroundColor Yellow
try {
    $newStaff = @{
        firstName = "Mary"
        lastName = "Johnson"
        email = "mary.johnson@test.com"
        phoneNumber = "08023456789"
        address = "456 Staff Avenue, Abuja"
        dateOfBirth = "1990-08-20"
        hireDate = "2024-02-01"
        position = "Administrative Assistant"
        department = "Administration"
        employmentStatus = "active"
        gender = "Female"
        qualification = "B.Sc"
        nationality = "Nigerian"
        emergencyContact = @{
            name = "Paul Johnson"
            relationship = "Brother"
            phoneNumber = "08098765432"
        }
    }
    
    $staffJson = $newStaff | ConvertTo-Json -Depth 3
    $response3 = Invoke-RestMethod -Uri "http://localhost:3000/api/staff" -Method POST -ContentType "application/json" -Body $staffJson
    Write-Host "New Staff Created:" -ForegroundColor Green
    Write-Host "Employee ID: $($response3.staff.employeeId)" -ForegroundColor Cyan
    Write-Host "Name: $($response3.staff.firstName) $($response3.staff.lastName)" -ForegroundColor Cyan
    
    $newStaffId = $response3.staff.employeeId
} catch {
    Write-Host "Error creating staff: $($_.Exception.Message)" -ForegroundColor Red
    $newStaffId = $null
}

# Test 4: Attempt to create a teacher with a duplicate employee ID (should fail)
Write-Host "`n📋 Test 4: Testing duplicate ID prevention for a new teacher" -ForegroundColor Yellow
if ($newTeacherId) {
    try {
        $duplicateTeacher = @{
            firstName = "Duplicate"
            lastName = "Teacher"
            email = "duplicate.teacher@test.com"
            phoneNumber = "08011112222"
            address = "123 Duplicate Lane"
            dateOfBirth = "1990-01-01"
            hireDate = "2024-01-15"
            subjects = @("History")
            specializations = @("Arts")
            employmentStatus = "active"
            employeeId = $newTeacherId # Using the ID of the teacher created in Test 2
            emergencyContact = @{
                name = "Contact"
                relationship = "Sibling"
                phoneNumber = "08022223333"
            }
        }

        $duplicateJson = $duplicateTeacher | ConvertTo-Json -Depth 3
        Invoke-RestMethod -Uri "http://localhost:3000/api/teachers" -Method POST -ContentType "application/json" -Body $duplicateJson
        Write-Host "❌ UNEXPECTED: Duplicate teacher ID was allowed!" -ForegroundColor Red
    } catch {
        Write-Host "✅ SUCCESS: Duplicate teacher ID was properly rejected." -ForegroundColor Green
        Write-Host "Expected Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ SKIPPED: Could not test duplicate teacher ID because new teacher was not created in Test 2." -ForegroundColor DarkYellow
}

# Test 5: Attempt to create a staff member with a duplicate employee ID (should fail)
Write-Host "`n📋 Test 5: Testing duplicate ID prevention for a new staff member" -ForegroundColor Yellow
if ($newStaffId) {
    try {
        $duplicateStaff = @{
            firstName = "Duplicate"
            lastName = "Staff"
            email = "duplicate.staff@test.com"
            phoneNumber = "08033334444"
            address = "456 Duplicate Avenue"
            dateOfBirth = "1992-02-02"
            hireDate = "2024-02-01"
            position = "Clerk"
            department = "Records"
            employmentStatus = "active"
            gender = "Female"
            qualification = "HND"
            nationality = "Nigerian"
            employeeId = $newStaffId # Using the ID of the staff created in Test 3
            emergencyContact = @{
                name = "Another Contact"
                relationship = "Cousin"
                phoneNumber = "08044445555"
            }
        }

        $duplicateJson = $duplicateStaff | ConvertTo-Json -Depth 3
        Invoke-RestMethod -Uri "http://localhost:3000/api/staff" -Method POST -ContentType "application/json" -Body $duplicateJson
        Write-Host "❌ UNEXPECTED: Duplicate staff ID was allowed!" -ForegroundColor Red
    } catch {
        Write-Host "✅ SUCCESS: Duplicate staff ID was properly rejected." -ForegroundColor Green
        Write-Host "Expected Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ SKIPPED: Could not test duplicate staff ID because new staff was not created in Test 3." -ForegroundColor DarkYellow
}

# Test 6: Attempt to create a teacher with a known existing employee ID (should fail)
Write-Host "`n📋 Test 6: Testing duplicate ID prevention with known existing ID" -ForegroundColor Yellow
try {
    $duplicateTest = @{
        firstName = "Test"
        lastName = "Duplicate"
        email = "test.duplicate@test.com"
        phoneNumber = "08034567890"
        address = "789 Duplicate Street, Port Harcourt"
        dateOfBirth = "1988-12-10"
        hireDate = "2024-03-01"
        subjects = @("English")
        specializations = @("Humanities")
        employmentStatus = "active"
        employeeId = "PSS/EMP/004"  # This should cause a conflict
        emergencyContact = @{
            name = "Test Contact"
            relationship = "Friend"
            phoneNumber = "08045678901"
        }
    }
    
    $duplicateJson = $duplicateTest | ConvertTo-Json -Depth 3
    $response4 = Invoke-RestMethod -Uri "http://localhost:3000/api/teachers" -Method POST -ContentType "application/json" -Body $duplicateJson
    Write-Host "❌ UNEXPECTED: Duplicate ID was allowed!" -ForegroundColor Red
} catch {
    Write-Host "✅ SUCCESS: Duplicate ID was properly rejected" -ForegroundColor Green
    Write-Host "Error (Expected): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 7: Validate employee ID formats
Write-Host "`n📋 Test 7: Testing employee ID format validation" -ForegroundColor Yellow
$testIds = @("PSS/TCH/001", "PSS/STF/002", "PSS/EMP/003", "INVALID/ID/001", "PSS/TCH/ABC", "SHORT")

foreach ($testId in $testIds) {
    try {
        $validationTest = @{ employeeId = $testId }
        $validationJson = $validationTest | ConvertTo-Json
        $response5 = Invoke-RestMethod -Uri "http://localhost:3000/api/debug/check-employee-id" -Method POST -ContentType "application/json" -Body $validationJson
        
        if ($response5.isValid) {
            Write-Host "✅ $testId - Valid format" -ForegroundColor Green
        } else {
            Write-Host "❌ $testId - Invalid format" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $testId - Validation failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 8: Check all generated IDs are unique
Write-Host "`n📋 Test 8: Verifying all generated IDs are unique" -ForegroundColor Yellow
$allIds = @("PSS/EMP/004")  # Known existing ID
if ($newTeacherId) { $allIds += $newTeacherId }
if ($newStaffId) { $allIds += $newStaffId }

Write-Host "Generated Employee IDs:" -ForegroundColor Cyan
$allIds | ForEach-Object {
    Write-Host "  - $_" -ForegroundColor White
}

$uniqueIds = $allIds | Sort-Object | Get-Unique
if ($allIds.Count -eq $uniqueIds.Count) {
    Write-Host "✅ All IDs are unique!" -ForegroundColor Green
} else {
    Write-Host "❌ Duplicate IDs found!" -ForegroundColor Red
}

# Test 9: Get employee counts
Write-Host "`n📋 Test 9: Current employee counts" -ForegroundColor Yellow
try {
    $statsResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/stats" -Method GET
    Write-Host "Teachers: $($statsResponse.totalTeachers)" -ForegroundColor Cyan
    Write-Host "Staff: $($statsResponse.totalStaff)" -ForegroundColor Cyan
    Write-Host "Students: $($statsResponse.totalStudents)" -ForegroundColor Cyan
} catch {
    Write-Host "Could not retrieve stats: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Employee ID Conflict Prevention Test Complete!" -ForegroundColor Green
Write-Host "=" * 60

# Cleanup option
Write-Host "`n🧹 Cleanup Options:" -ForegroundColor Magenta
Write-Host "To clean up test data, you can run:"
Write-Host "  - Delete teacher: DELETE /api/teachers/[teacher-id]" -ForegroundColor Gray
Write-Host "  - Delete staff: DELETE /api/staff/[staff-id]" -ForegroundColor Gray
Write-Host "  - Or run: .\clean-database.ps1" -ForegroundColor Gray
