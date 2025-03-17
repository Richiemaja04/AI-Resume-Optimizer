// Global variables
let skillsData = [];
let myChart = null;

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize template selection
    initTemplateSelection();
});

// Template selection functionality
function initTemplateSelection() {
    const templateOptions = document.querySelectorAll('.template-option');
    
    templateOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all templates
            document.querySelectorAll('.template-preview').forEach(preview => {
                preview.classList.remove('selected');
            });
            
            // Add selected class to clicked template
            this.querySelector('.template-preview').classList.add('selected');
            
            // Update hidden input value
            document.getElementById('templateStyle').value = this.dataset.template;
        });
    });
    
    // Set initial selected template
    document.querySelector('[data-template="professional"] .template-preview').classList.add('selected');
}

// Extract skills from job description
async function extractSkills() {
    const jobDescription = document.getElementById('jobDescription').value.trim();
    
    if (!jobDescription) {
        showNotification('Please enter a job description', 'error');
        return;
    }
    
    try {
        // Show loading state
        const skillsTable = document.getElementById('skillsTable');
        skillsTable.innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin text-blue-500 text-2xl"></i><p class="mt-2 text-gray-600">Extracting skills...</p></div>';
        
        const response = await fetch('/extract_skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ job_description: jobDescription }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            skillsData = data.skills || [];
            displaySkills(skillsData);
        } else {
            throw new Error(data.error || 'Failed to extract skills');
        }
    } catch (error) {
        console.error('Error extracting skills:', error);
        showNotification(error.message, 'error');
        document.getElementById('skillsTable').innerHTML = '<div class="text-red-500 p-2">Failed to extract skills. Please try again.</div>';
    }
}

// Display extracted skills
function displaySkills(skills) {
    const skillsTable = document.getElementById('skillsTable');
    
    if (!skills || skills.length === 0) {
        skillsTable.innerHTML = '<div class="text-gray-500 p-2">No skills identified. Try a more detailed job description.</div>';
        return;
    }
    
    const tableHTML = `
        <div class="bg-white p-3 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-2">Key Skills Identified (${skills.length})</h3>
            <div class="flex flex-wrap gap-2">
                ${skills.map(skill => `
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">${skill}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    skillsTable.innerHTML = tableHTML;
}

// Upload and process resume file
async function uploadResume() {
    const fileInput = document.getElementById('resumeUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        return;
    }
    
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please upload a PDF or DOCX file', 'error');
        fileInput.value = '';
        return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size exceeds 5MB limit', 'warning');
        fileInput.value = '';
        return;
    }
    
    try {
        // Show loading indicator
        document.getElementById('resumeText').value = 'Processing file...';
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/upload_resume', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('resumeText').value = data.resume_text;
            showNotification('Resume uploaded successfully', 'success');
        } else {
            throw new Error(data.error || 'Failed to process resume');
        }
    } catch (error) {
        console.error('Error uploading resume:', error);
        showNotification(error.message, 'error');
        document.getElementById('resumeText').value = '';
        fileInput.value = '';
    }
}

// Analyze resume against extracted skills
async function analyzeResume() {
    const resumeText = document.getElementById('resumeText').value.trim();
    
    if (!resumeText) {
        showNotification('Please upload or paste your resume', 'error');
        return;
    }
    
    if (!skillsData || skillsData.length === 0) {
        showNotification('Please extract skills from a job description first', 'warning');
        return;
    }
    
    try {
        // Show loading state
        document.getElementById('emotion').innerHTML = '<i class="fas fa-spinner fa-spin text-green-500 text-2xl"></i>';
        document.getElementById('matchedSkillsTable').innerHTML = 'Analyzing...';
        
        const response = await fetch('/analyze_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: resumeText,
                skills: skillsData
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayAnalysisResults(data);
            createSkillChart(data);
        } else {
            throw new Error(data.error || 'Failed to analyze resume');
        }
    } catch (error) {
        console.error('Error analyzing resume:', error);
        showNotification(error.message, 'error');
        document.getElementById('emotion').innerHTML = '';
        document.getElementById('matchedSkillsTable').innerHTML = '<div class="text-red-500 p-2">Analysis failed. Please try again.</div>';
    }
}

// Display resume analysis results
function displayAnalysisResults(data) {
    // Display emotion
    document.getElementById('emotion').innerHTML = `
        <div class="text-center">
            <div class="text-3xl mb-2">${data.emotion}</div>
            <div class="text-2xl font-bold">${Math.round(data.match_percentage)}% Match</div>
        </div>
    `;
    
    // Display matched and unmatched skills
    const matchedSkillsTable = document.getElementById('matchedSkillsTable');
    
    const tableHTML = `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="text-left p-3">Skill</th>
                        <th class="text-left p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.matched_skills.map(skill => `
                        <tr class="border-t">
                            <td class="p-3">${skill}</td>
                            <td class="p-3 text-green-600"><i class="fas fa-check-circle mr-1"></i> Matched</td>
                        </tr>
                    `).join('')}
                    ${data.unmatched_skills.map(skill => `
                        <tr class="border-t">
                            <td class="p-3">${skill}</td>
                            <td class="p-3 text-red-500"><i class="fas fa-times-circle mr-1"></i> Missing</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    matchedSkillsTable.innerHTML = tableHTML;
}

// Create chart for skill match visualization
function createSkillChart(data) {
    const ctx = document.getElementById('skillChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (myChart) {
        myChart.destroy();
    }
    
    // Calculate percentages
    const matchedPercentage = data.match_percentage;
    const unmatchedPercentage = 100 - matchedPercentage;
    
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Matched', 'Missing'],
            datasets: [{
                data: [matchedPercentage, unmatchedPercentage],
                backgroundColor: ['#10B981', '#F87171'],
                borderColor: ['#065F46', '#B91C1C'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${Math.round(context.raw)}%`;
                        }
                    }
                }
            }
        }
    });
}

// Generate tailored resume
async function tailorResume() {
    const resumeText = document.getElementById('resumeText').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const outputFormat = document.getElementById('outputFormat').value;
    const templateStyle = document.getElementById('templateStyle').value;
    
    if (!resumeText || !jobDescription) {
        showNotification('Please ensure you have both resume and job description', 'warning');
        return;
    }
    
    try {
        showNotification(`Generating tailored resume in ${outputFormat.toUpperCase()} format`, 'success');
        
        // Use fetch with JSON payload and handle the response as a blob
        const response = await fetch('/tailor_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: resumeText,
                job_description: jobDescription,
                output_format: outputFormat,
                template_style: templateStyle
            })
        });
        
        // Handle the file download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `tailored_resume.${outputFormat}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
    } catch (error) {
        console.error('Error generating resume:', error);
        showNotification('Failed to generate resume', 'error');
    }
}

// Preview the tailored resume content
async function previewResume() {
    const resumeText = document.getElementById('resumeText').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    
    if (!resumeText || !jobDescription) {
        showNotification('Please ensure you have both resume and job description', 'warning');
        return;
    }
    
    try {
        // Show loading state
        document.getElementById('resumePreview').classList.remove('hidden');
        document.getElementById('previewContent').innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin text-purple-500 text-2xl"></i><p class="mt-2 text-gray-600">Generating preview...</p></div>';
        
        const response = await fetch('/preview_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resume_text: resumeText,
                job_description: jobDescription
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('previewContent').innerHTML = data.tailored_resume;
        } else {
            throw new Error(data.error || 'Failed to generate preview');
        }
    } catch (error) {
        console.error('Error generating preview:', error);
        showNotification(error.message, 'error');
        document.getElementById('previewContent').innerHTML = '<div class="text-red-500 p-2">Failed to generate preview. Please try again.</div>';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} flex items-center`;
    
    // Set icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle mr-2 text-green-500"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle mr-2 text-red-500"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle mr-2 text-blue-500"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <div>${message}</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}