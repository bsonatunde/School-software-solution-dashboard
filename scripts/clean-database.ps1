# School Database Cleanup Script
# Run this script to clean all data from your Pacey School database

Write-Host "🏫 Pacey School Database Cleanup Utility" -ForegroundColor Blue
Write-Host "=======================================" -ForegroundColor Blue
Write-Host ""

# Check if development server is running
Write-Host "🔍 Checking if development server is running..." -ForegroundColor Yellow

try {
    $statusResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/debug/clean-database" -Method GET -TimeoutSec 5
    
    Write-Host "✅ Development server is running!" -ForegroundColor Green
    Write-Host ""
    
    # Show current database status
    Write-Host "📊 Current Database Status:" -ForegroundColor Cyan
    Write-Host "   Total Documents: $($statusResponse.totalDocuments)" -ForegroundColor White
    
    if ($statusResponse.totalDocuments -gt 0) {
        Write-Host "   Collections with data:" -ForegroundColor White
        $statusResponse.collections.PSObject.Properties | Where-Object { $_.Value -gt 0 } | ForEach-Object {
            Write-Host "   • $($_.Name): $($_.Value) documents" -ForegroundColor Gray
        }
    } else {
        Write-Host "   📭 Database is already empty!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your database is clean and ready for fresh data!" -ForegroundColor Green
        exit 0
    }
    
} catch {
    Write-Host "❌ Error: Development server is not running or not accessible" -ForegroundColor Red
    Write-Host "💡 Please make sure to run 'npm run dev' first" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "⚠️  WARNING: This will permanently delete ALL data from your database!" -ForegroundColor Red -BackgroundColor Yellow
Write-Host "⚠️  Including: Students, Staff, Classes, Attendance, Results, Fees, etc." -ForegroundColor Red -BackgroundColor Yellow
Write-Host ""

# Confirmation prompt
$confirmation = Read-Host "Are you sure you want to clean the database? Type 'YES' to confirm"

if ($confirmation -ne "YES") {
    Write-Host "❌ Database cleanup cancelled." -ForegroundColor Yellow
    exit 0
}

# Additional confirmation for safety
Write-Host ""
Write-Host "🚨 FINAL WARNING: This action CANNOT be undone!" -ForegroundColor Red
$finalConfirmation = Read-Host "Type 'DELETE ALL DATA' to proceed with cleanup"

if ($finalConfirmation -ne "DELETE ALL DATA") {
    Write-Host "❌ Database cleanup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🧹 Starting database cleanup..." -ForegroundColor Yellow

try {
    $cleanupResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/debug/clean-database" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"confirmToken": "CONFIRM_DELETE_ALL_DATA"}'
    
    if ($cleanupResponse.success) {
        Write-Host ""
        Write-Host "🎉 Database cleanup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📈 Cleanup Summary:" -ForegroundColor Cyan
        Write-Host "   Collections processed: $($cleanupResponse.summary.successfulCollections)/$($cleanupResponse.summary.totalCollections)" -ForegroundColor White
        Write-Host "   Documents deleted: $($cleanupResponse.summary.totalDocumentsDeleted)" -ForegroundColor White
        Write-Host "   Completed at: $(Get-Date -Date $cleanupResponse.summary.timestamp -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ Your database is now clean and ready for fresh data!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Next Steps:" -ForegroundColor Cyan
        Write-Host "   • Add students: Go to Students → Add New Student" -ForegroundColor Gray
        Write-Host "   • Add staff: Go to Staff → Add New Staff Member" -ForegroundColor Gray
        Write-Host "   • Add teachers: Go to Teachers → Add New Teacher" -ForegroundColor Gray
        Write-Host "   • Create classes: Go to Admin → Classes → Add New Class" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🎊 Happy school management!" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Error during cleanup: $($cleanupResponse.error)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error during database cleanup: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
