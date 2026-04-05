// Sample Application Test Data
// This file creates test data to verify the end-to-end application flow

function createTestApplications() {
  const sampleApplications = [
    {
      id: "test_app_001",
      candidateName: "John Smith",
      candidateEmail: "john.smith@example.com",
      companyName: "Tech Corp",
      jobRole: "Software Engineering Intern",
      location: "San Francisco, CA",
      applicationDate: "2024-04-01",
      status: "Applied",
      notes: "Passionate about full-stack development and eager to learn new technologies."
    },
    {
      id: "test_app_002",
      candidateName: "Sarah Johnson",
      candidateEmail: "sarah.j@university.edu",
      companyName: "DataTech Solutions",
      jobRole: "Data Science Intern",
      location: "New York, NY",
      applicationDate: "2024-04-02",
      status: "Interview",
      notes: "Strong background in Python and machine learning. Currently pursuing MS in Data Science."
    },
    {
      id: "test_app_003",
      candidateName: "Michael Chen",
      candidateEmail: "m.chen@student.edu",
      companyName: "Design Studio Pro",
      jobRole: "UX/UI Design Intern",
      location: "Remote",
      applicationDate: "2024-04-03",
      status: "Offer",
      notes: "Excellent portfolio showcasing modern design principles and user-centered approach."
    },
    {
      id: "test_app_004",
      candidateName: "Emma Garcia",
      candidateEmail: "emma.garcia@college.edu",
      companyName: "Marketing Hub",
      jobRole: "Digital Marketing Intern",
      location: "Los Angeles, CA",
      applicationDate: "2024-04-04",
      status: "Rejected",
      notes: "Great enthusiasm but looking for someone with more social media experience."
    }
  ];

  // Add to existing applications
  const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
  const combinedApps = [...existingApps, ...sampleApplications];
  localStorage.setItem('applications', JSON.stringify(combinedApps));

  console.log('Test applications created successfully');
  return combinedApps;
}

// Run this in browser console to create test data:
// createTestApplications();