// Initialize sample data in localStorage for demo purposes

export const initializeSampleData = () => {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized') === 'true') {
    return;
  }

  // Sample users
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'candidate@example.com',
      password: 'password123',
      role: 'candidate'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter'
    }
  ];

  // Sample jobs
  const jobs = [
    {
      id: '1',
      companyName: 'TechCorp',
      jobRole: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      description: 'Join our engineering team to work on cutting-edge web applications. You will collaborate with experienced developers and contribute to real-world projects.',
      salary: '$25-30/hour',
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['React', 'JavaScript', 'Node.js', 'Git'],
      recruiterEmail: 'recruiter@example.com'
    },
    {
      id: '2',
      companyName: 'DataAnalytics Inc',
      jobRole: 'Data Science Intern',
      location: 'New York, NY',
      description: 'Work with our data science team to analyze large datasets and build machine learning models. Perfect for students with a strong foundation in statistics and Python.',
      salary: '$28-32/hour',
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
      recruiterEmail: 'recruiter@example.com'
    },
    {
      id: '3',
      companyName: 'DesignStudio',
      jobRole: 'UX/UI Design Intern',
      location: 'Remote',
      description: 'Create beautiful and intuitive user interfaces for our client projects. You will work closely with designers and developers to bring creative visions to life.',
      salary: '$20-25/hour',
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
      recruiterEmail: 'recruiter@example.com'
    },
    {
      id: '4',
      companyName: 'CloudSystems',
      jobRole: 'DevOps Intern',
      location: 'Austin, TX',
      description: 'Learn about cloud infrastructure, CI/CD pipelines, and automation. Work with Docker, Kubernetes, and AWS to deploy and maintain scalable applications.',
      salary: '$26-30/hour',
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
      recruiterEmail: 'recruiter@example.com'
    },
    {
      id: '5',
      companyName: 'MobileFirst',
      jobRole: 'Mobile Development Intern',
      location: 'Seattle, WA',
      description: 'Build mobile applications for iOS and Android platforms. Work with React Native or native development tools to create engaging user experiences.',
      salary: '$24-28/hour',
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['React Native', 'iOS', 'Android', 'Mobile UI'],
      recruiterEmail: 'recruiter@example.com'
    },
    {
      id: '6',
      companyName: 'CyberSecurity Pro',
      jobRole: 'Security Analyst Intern',
      location: 'Boston, MA',
      description: 'Assist in identifying security vulnerabilities and implementing security best practices. Learn about penetration testing, threat analysis, and security tools.',
      salary: '$27-32/hour',
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      skills: ['Network Security', 'Penetration Testing', 'Python', 'Security Tools'],
      recruiterEmail: 'recruiter@example.com'
    }
  ];

  // Sample applications for the candidate
  const applications = [
    {
      id: '1',
      jobId: '1',
      companyName: 'TechCorp',
      jobRole: 'Software Engineering Intern',
      location: 'San Francisco, CA',
      candidateEmail: 'candidate@example.com',
      candidateName: 'John Doe',
      applicationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Interview',
      resume: 'john_doe_resume.pdf',
      coverLetter: 'I am very interested in this position...',
      notes: 'Follow up scheduled for next week'
    },
    {
      id: '2',
      jobId: '2',
      companyName: 'DataAnalytics Inc',
      jobRole: 'Data Science Intern',
      location: 'New York, NY',
      candidateEmail: 'candidate@example.com',
      candidateName: 'John Doe',
      applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Applied',
      resume: 'john_doe_resume.pdf',
      coverLetter: 'My background in statistics makes me a great fit...',
      notes: ''
    },
    {
      id: '3',
      jobId: '4',
      companyName: 'CloudSystems',
      jobRole: 'DevOps Intern',
      location: 'Austin, TX',
      candidateEmail: 'candidate@example.com',
      candidateName: 'John Doe',
      applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Rejected',
      resume: 'john_doe_resume.pdf',
      coverLetter: 'I have experience with Docker and AWS...',
      notes: 'Position filled internally'
    },
    {
      id: '4',
      jobId: '5',
      companyName: 'MobileFirst',
      jobRole: 'Mobile Development Intern',
      location: 'Seattle, WA',
      candidateEmail: 'candidate@example.com',
      candidateName: 'John Doe',
      applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Offer',
      resume: 'john_doe_resume.pdf',
      coverLetter: 'I have built several React Native applications...',
      notes: 'Offer received - need to respond by end of week'
    }
  ];

  // Sample profile for the candidate
  const candidateProfile = {
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate computer science student with a strong interest in web development and software engineering. Looking for opportunities to apply my skills and learn from experienced professionals.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Git', 'HTML/CSS'],
    education: 'Bachelor of Science in Computer Science, University of California - Expected Graduation: May 2025\nGPA: 3.8/4.0\nRelevant Coursework: Data Structures, Algorithms, Web Development, Database Systems',
    experience: 'Web Development Intern at StartupXYZ (Summer 2024)\n- Developed responsive web applications using React and Node.js\n- Collaborated with a team of 5 developers using Agile methodologies\n- Improved application performance by 30% through code optimization'
  };

  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('jobs', JSON.stringify(jobs));
  localStorage.setItem('applications', JSON.stringify(applications));
  localStorage.setItem('profile_candidate@example.com', JSON.stringify(candidateProfile));
  localStorage.setItem('dataInitialized', 'true');

  console.log('Sample data initialized successfully!');
};

// Reset all data (useful for testing)
export const resetAllData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('jobs');
  localStorage.removeItem('applications');
  localStorage.removeItem('profile_candidate@example.com');
  localStorage.removeItem('dataInitialized');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('theme');
  console.log('All data reset successfully!');
};
