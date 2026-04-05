// Sample jobs data - you can paste this in browser console to add test jobs

const sampleJobs = [
  {
    id: 'job1',
    companyName: 'TechCorp Inc.',
    jobRole: 'Frontend Developer',
    location: 'San Francisco, CA',
    description: `We are looking for a skilled Frontend Developer to join our team.

Requirements:
- 3+ years experience with JavaScript, React, and Node.js
- Strong understanding of HTML, CSS, and responsive design
- Experience with Git version control and Agile methodologies
- Knowledge of RESTful APIs and JSON
- Excellent communication and problem-solving skills

Responsibilities:
- Develop user-facing web applications using React
- Collaborate with backend developers to integrate APIs
- Write clean, maintainable, and testable code
- Participate in code reviews and team meetings
- Stay up-to-date with latest frontend technologies`,
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'Node.js', 'REST APIs'],
    salary: '$70,000 - $95,000',
    postedDate: new Date().toISOString()
  },
  {
    id: 'job2',
    companyName: 'DataFlow Analytics',
    jobRole: 'Data Science Intern',
    location: 'Remote',
    description: `Join our data science team as an intern and work on exciting machine learning projects.

Requirements:
- Currently pursuing degree in Computer Science, Statistics, or related field
- Strong foundation in Python programming
- Knowledge of pandas, numpy, and scikit-learn
- Understanding of statistical analysis and data visualization
- SQL database experience preferred
- Strong analytical and communication skills

You'll work on:
- Data collection and cleaning processes
- Building predictive models using machine learning
- Creating data visualizations with Python libraries
- Collaborating with senior data scientists
- Presenting findings to stakeholders`,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics', 'Pandas'],
    salary: '$15-20/hour',
    postedDate: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'job3',
    companyName: 'CloudTech Solutions',
    jobRole: 'Full Stack Developer',
    location: 'Austin, TX',
    description: `We're seeking a Full Stack Developer to build scalable web applications.

Requirements:
- Bachelor's degree in Computer Science or equivalent experience
- Proficiency in JavaScript, Node.js, and React
- Experience with databases (MongoDB, PostgreSQL)
- Knowledge of cloud platforms (AWS, Azure)
- Understanding of DevOps practices and Docker
- Strong problem-solving and communication abilities

Tech Stack:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, GraphQL
- Database: MongoDB, Redis
- Cloud: AWS (EC2, S3, Lambda)
- Tools: Docker, Git, Jenkins`,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
    salary: '$80,000 - $110,000',
    postedDate: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

// Save to localStorage
localStorage.setItem('jobs', JSON.stringify(sampleJobs));
console.log('Sample jobs added!', sampleJobs);