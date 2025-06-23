/**
 * Test Dashboard System - Shared functionality for all test pages
 */

// Test result storage
function saveTestResult(testFile, result) {
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '{}');
    testHistory[testFile] = {
        ...result,
        timestamp: new Date().toISOString(),
        lastRun: new Date().toLocaleString()
    };
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    // Try to update dashboard if we're on the index page
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

function getTestResults() {
    return JSON.parse(localStorage.getItem('testHistory') || '{}');
}

function clearTestHistory() {
    localStorage.removeItem('testHistory');
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

// Expose functions globally
window.TestDashboard = {
    saveTestResult,
    getTestResults,
    clearTestHistory
}; 