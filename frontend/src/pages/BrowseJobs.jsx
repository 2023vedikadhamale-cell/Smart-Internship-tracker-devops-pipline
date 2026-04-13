import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AgentAnalyzer from '../components/AgentAnalyzer';

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_EXTENSIONS = ['png', 'jpg', 'doc', 'docx', 'pdf'];

const BrowseJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [applicationForm, setApplicationForm] = useState({
    resume: null,
    coverLetter: ''
  });

  useEffect(() => {
    loadJobs();
    loadCandidateSkills();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter]);

  const loadJobs = () => {
    let allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');

    // Auto-add sample jobs if none exist
    if (allJobs.length === 0) {
      const sampleJobs = [
        {
          id: 'sample-job-1',
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
- Participate in code reviews and team meetings`,
          skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git', 'Node.js', 'REST APIs'],
          salary: '$70,000 - $95,000',
          postedDate: new Date().toISOString()
        },
        {
          id: 'sample-job-2',
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
- Collaborating with senior data scientists`,
          skills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'Statistics', 'Pandas'],
          salary: '$15-20/hour',
          postedDate: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'sample-job-3',
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
- Cloud: AWS (EC2, S3, Lambda)`,
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'TypeScript'],
          salary: '$80,000 - $110,000',
          postedDate: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      localStorage.setItem('jobs', JSON.stringify(sampleJobs));
      allJobs = sampleJobs;
    }

    setJobs(allJobs);
  };

  const loadCandidateSkills = () => {
    if (user?.email) {
      try {
        const profileKey = `profile_${user.email}`;
        const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
        let skills = profile.skills || [];

        // Auto-add sample skills for new interns to enable immediate agent testing
        if (skills.length === 0 && user?.role === 'intern') {
          const sampleSkills = ['JavaScript', 'Communication', 'Problem Solving'];
          skills = sampleSkills;

          // Save sample skills to localStorage
          const updatedProfile = { ...profile, skills: sampleSkills };
          localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
        }

        setCandidateSkills(skills);
      } catch (error) {
        console.error('Error loading candidate skills:', error);
        setCandidateSkills([]);
      }
    } else {
      setCandidateSkills([]);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.location === locationFilter);
    }

    setFilteredJobs(filtered);
  };

  const getUniqueLocations = () => {
    return [...new Set(jobs.map(job => job.location))];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setApplicationForm({ resume: null, coverLetter: '' });
  };

  const openDetailsModal = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const validateResumeFile = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !ALLOWED_RESUME_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        message: 'Only PNG, JPG, DOC, DOCX, and PDF files are allowed.'
      };
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return {
        valid: false,
        message: 'File size must be 5MB or less.'
      };
    }

    return { valid: true };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setApplicationForm({
        ...applicationForm,
        resume: null
      });
      return;
    }

    const validation = validateResumeFile(file);
    if (!validation.valid) {
      alert(validation.message);
      e.target.value = '';
      setApplicationForm({
        ...applicationForm,
        resume: null
      });
      return;
    }

    setApplicationForm({
      ...applicationForm,
      resume: file
    });
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();

    if (!applicationForm.resume) {
      alert('Please upload your resume');
      return;
    }

    const validation = validateResumeFile(applicationForm.resume);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // Create application object
    const application = {
      id: Date.now().toString(),
      jobId: selectedJob.id,
      companyName: selectedJob.companyName,
      jobRole: selectedJob.jobRole,
      location: selectedJob.location,
      candidateEmail: user.email,
      candidateName: user.name,
      applicationDate: new Date().toISOString(),
      status: 'Applied',
      resume: applicationForm.resume.name,
      coverLetter: applicationForm.coverLetter,
      notes: ''
    };

    // Save to localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));

    alert('Application submitted successfully!');
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Discover and apply to available internship opportunities
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Filters */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Jobs
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by company, role, or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Location
                </label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  {getUniqueLocations().map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full card p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm || locationFilter !== 'all' ? 'Try adjusting your filters' : 'No jobs available at the moment'}
                  </p>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="card hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Company Logo/Initial */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white font-bold text-lg">
                          {job.companyName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.companyName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{job.jobRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Posted: {formatDate(job.postedDate)}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                          {job.salary}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    {/* Skills/Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => openDetailsModal(job)}
                        className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openApplicationModal(job)}
                        className="w-full btn-primary"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Application Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Apply for {selectedJob.jobRole}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
              {/* Company Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedJob.companyName}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resume <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.doc,.docx,.pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Accepted formats: PNG, JPG, PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  rows="6"
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Details Modal with AI Analysis */}
      {isDetailsModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedJob.jobRole} at {selectedJob.companyName}</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Company</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedJob.companyName}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Posted</h4>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(selectedJob.postedDate)}</p>
                  </div>
                  {selectedJob.salary && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Salary</h4>
                      <p className="text-gray-600 dark:text-gray-400">{selectedJob.salary}</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Job Description</h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{selectedJob.description}</p>
                </div>

                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Career Analysis */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  AI Career Match Analysis
                </h3>

                {user?.role === 'intern' ? (
                  <div>
                    {candidateSkills.length > 0 ? (
                      <AgentAnalyzer
                        job={{ title: selectedJob.jobRole, description: selectedJob.description }}
                        candidateSkills={candidateSkills}
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Complete Your Skills Profile</h4>
                            <p className="text-blue-700 dark:text-blue-300 mb-4">
                              Add skills to your profile to unlock AI-powered job match analysis and personalized career recommendations.
                            </p>
                            <button
                              onClick={() => {
                                window.location.href = '/profile';
                              }}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Complete Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : user ? (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">AI Career Analysis</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          This feature is available for job seekers. Please contact support to switch your account type.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <div>
                        <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">Sign In Required</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Please sign in to access AI career analysis and job matching features.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    openApplicationModal(selectedJob);
                  }}
                  className="flex-1 btn-primary"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrowseJobs;
