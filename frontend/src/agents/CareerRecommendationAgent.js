/**
 * CareerRecommendationAgent - Generates career recommendations based on resume analysis
 */
import agentBus from './agentBus.js';
import { EVENTS } from './agentTypes.js';

class CareerRecommendationAgent {
  constructor() {
    this.isInitialized = false;
    this.eventCallbacks = new Map();
  }

  /**
   * Initialize the agent and subscribe to events
   */
  init() {
    if (this.isInitialized) {
      console.warn('CareerRecommendationAgent is already initialized');
      return;
    }

    // Create bound callback to maintain context
    const recommendationRequestedCallback = this.handleRecommendationRequested.bind(this);
    this.eventCallbacks.set(EVENTS.RECOMMENDATION_REQUESTED, recommendationRequestedCallback);

    // Subscribe to recommendation requests
    agentBus.subscribe(EVENTS.RECOMMENDATION_REQUESTED, recommendationRequestedCallback);

    this.isInitialized = true;
  }

  /**
   * Handle recommendation requested event
   * @param {Object} payload - Event payload containing missingSkills, matchScore, jobTitle
   */
  handleRecommendationRequested(payload) {
    const { missingSkills, matchScore, jobTitle } = payload;

    // Generate recommendations
    const recommendations = this.generateRecommendations(payload);

    // Create complete result payload
    const resultPayload = {
      ...payload, // Include original data (matchedSkills, missingSkills, matchScore, jobTitle)
      ...recommendations // Add generated recommendations
    };

    // Publish recommendation complete event
    agentBus.publish(EVENTS.RECOMMENDATION_COMPLETE, resultPayload);
  }

  /**
   * Generate career recommendations based on analysis payload
   * @param {Object} payload - Analysis payload with missingSkills, matchScore, jobTitle
   * @returns {Object} Recommendations object
   */
  generateRecommendations(payload) {
    const { missingSkills, matchScore, jobTitle } = payload;

    return {
      courseRecommendations: this.generateCourseRecommendations(missingSkills),
      alternateJobs: this.generateAlternateJobs(jobTitle),
      readinessLevel: this.calculateReadinessLevel(matchScore),
      prepTips: this.generatePrepTips(matchScore, missingSkills, jobTitle)
    };
  }

  /**
   * Generate course recommendations for missing skills
   * @param {string[]} missingSkills - Array of missing skills
   * @returns {Array} Array of course recommendation objects
   */
  generateCourseRecommendations(missingSkills) {
    const courseDatabase = {
      // Programming Languages
      'javascript': [
        { skill: 'JavaScript', platform: 'freeCodeCamp', courseName: 'JavaScript Algorithms and Data Structures' },
        { skill: 'JavaScript', platform: 'Coursera', courseName: 'JavaScript for Beginners' },
        { skill: 'JavaScript', platform: 'Udemy', courseName: 'The Complete JavaScript Course 2024' }
      ],
      'python': [
        { skill: 'Python', platform: 'Coursera', courseName: 'Python for Everybody Specialization' },
        { skill: 'Python', platform: 'edX', courseName: 'Introduction to Computer Science and Programming Using Python' },
        { skill: 'Python', platform: 'Udemy', courseName: 'Complete Python Bootcamp' }
      ],
      'java': [
        { skill: 'Java', platform: 'Oracle', courseName: 'Java Programming Complete Course' },
        { skill: 'Java', platform: 'Coursera', courseName: 'Java Programming: Solving Problems with Software' }
      ],

      // Frontend Technologies
      'react': [
        { skill: 'React', platform: 'freeCodeCamp', courseName: 'Front End Development Libraries' },
        { skill: 'React', platform: 'Udemy', courseName: 'React - The Complete Guide' },
        { skill: 'React', platform: 'Coursera', courseName: 'Front-End Web Development with React' }
      ],
      'angular': [
        { skill: 'Angular', platform: 'Angular.io', courseName: 'Tour of Heroes Tutorial' },
        { skill: 'Angular', platform: 'Udemy', courseName: 'Angular - The Complete Guide' }
      ],
      'vue': [
        { skill: 'Vue.js', platform: 'Vue Mastery', courseName: 'Intro to Vue 3' },
        { skill: 'Vue.js', platform: 'Udemy', courseName: 'Vue JS 3 - The Complete Guide' }
      ],

      // Backend Technologies
      'node.js': [
        { skill: 'Node.js', platform: 'freeCodeCamp', courseName: 'Back End Development and APIs' },
        { skill: 'Node.js', platform: 'Udemy', courseName: 'The Complete Node.js Developer Course' }
      ],
      'express': [
        { skill: 'Express.js', platform: 'Express.js Guide', courseName: 'Getting Started with Express' },
        { skill: 'Express.js', platform: 'Udemy', courseName: 'Node.js, Express, MongoDB & More' }
      ],

      // Databases
      'sql': [
        { skill: 'SQL', platform: 'W3Schools', courseName: 'SQL Tutorial' },
        { skill: 'SQL', platform: 'Coursera', courseName: 'Introduction to Structured Query Language (SQL)' },
        { skill: 'SQL', platform: 'freeCodeCamp', courseName: 'Relational Database Course' }
      ],
      'mongodb': [
        { skill: 'MongoDB', platform: 'MongoDB University', courseName: 'MongoDB Basics' },
        { skill: 'MongoDB', platform: 'Udemy', courseName: 'MongoDB - The Complete Developer\'s Guide' }
      ],
      'mysql': [
        { skill: 'MySQL', platform: 'MySQL.com', courseName: 'MySQL Tutorial' },
        { skill: 'MySQL', platform: 'Coursera', courseName: 'Introduction to Databases and SQL Querying' }
      ],

      // Data & Analytics
      'data analysis': [
        { skill: 'Data Analysis', platform: 'Coursera', courseName: 'Google Data Analytics Professional Certificate' },
        { skill: 'Data Analysis', platform: 'edX', courseName: 'Data Analysis for Social Scientists' }
      ],
      'machine learning': [
        { skill: 'Machine Learning', platform: 'Coursera', courseName: 'Machine Learning by Andrew Ng' },
        { skill: 'Machine Learning', platform: 'edX', courseName: 'Introduction to Machine Learning' },
        { skill: 'Machine Learning', platform: 'Udacity', courseName: 'Machine Learning Engineer Nanodegree' }
      ],

      // Cloud & DevOps
      'aws': [
        { skill: 'AWS', platform: 'AWS Training', courseName: 'AWS Cloud Practitioner Essentials' },
        { skill: 'AWS', platform: 'A Cloud Guru', courseName: 'AWS Certified Solutions Architect' }
      ],
      'docker': [
        { skill: 'Docker', platform: 'Docker', courseName: 'Docker Getting Started Tutorial' },
        { skill: 'Docker', platform: 'Udemy', courseName: 'Docker Mastery: with Kubernetes + Swarm' }
      ],

      // Soft Skills
      'communication': [
        { skill: 'Communication', platform: 'Coursera', courseName: 'Improve Your English Communication Skills' },
        { skill: 'Communication', platform: 'LinkedIn Learning', courseName: 'Communicating with Confidence' }
      ],
      'leadership': [
        { skill: 'Leadership', platform: 'Coursera', courseName: 'Leadership and Management Certificate' },
        { skill: 'Leadership', platform: 'edX', courseName: 'Leadership Principles for Software Engineers' }
      ]
    };

    const recommendations = [];
    const maxRecommendationsPerSkill = 2;
    const maxTotalRecommendations = 6;

    missingSkills.slice(0, 8).forEach(skill => {
      const normalizedSkill = skill.toLowerCase().trim();

      // Try exact match first
      let courses = courseDatabase[normalizedSkill];

      // If no exact match, try partial matches
      if (!courses) {
        const matchingKey = Object.keys(courseDatabase).find(key =>
          key.includes(normalizedSkill) || normalizedSkill.includes(key)
        );
        courses = matchingKey ? courseDatabase[matchingKey] : null;
      }

      if (courses && recommendations.length < maxTotalRecommendations) {
        // Add up to maxRecommendationsPerSkill courses for this skill
        courses.slice(0, maxRecommendationsPerSkill).forEach(course => {
          if (recommendations.length < maxTotalRecommendations) {
            recommendations.push({ ...course, skill: skill }); // Use original skill casing
          }
        });
      } else if (recommendations.length < maxTotalRecommendations) {
        // Generic recommendation for skills not in our database
        recommendations.push({
          skill: skill,
          platform: 'Coursera',
          courseName: `${skill} Fundamentals`
        });
      }
    });

    return recommendations;
  }

  /**
   * Generate alternate job suggestions based on job title
   * @param {string} jobTitle - Original job title
   * @returns {string[]} Array of alternate job titles
   */
  generateAlternateJobs(jobTitle) {
    const jobTitle_lower = jobTitle.toLowerCase();

    const jobCategories = {
      frontend: [
        'UI Developer', 'React Developer', 'Frontend Engineer', 'Web Developer',
        'JavaScript Developer', 'User Interface Designer', 'Vue.js Developer'
      ],
      backend: [
        'Backend Engineer', 'API Developer', 'Server-Side Developer', 'Database Developer',
        'Node.js Developer', 'Python Developer', 'Java Developer'
      ],
      fullstack: [
        'Full Stack Engineer', 'Software Engineer', 'Web Application Developer',
        'MEAN Stack Developer', 'MERN Stack Developer', 'JavaScript Developer'
      ],
      data: [
        'Data Analyst', 'Business Intelligence Analyst', 'Data Scientist',
        'Machine Learning Engineer', 'Analytics Specialist', 'Database Administrator'
      ],
      mobile: [
        'iOS Developer', 'Android Developer', 'Mobile App Developer',
        'React Native Developer', 'Flutter Developer', 'Cross-Platform Developer'
      ],
      devops: [
        'Site Reliability Engineer', 'Cloud Engineer', 'DevOps Specialist',
        'Infrastructure Engineer', 'Platform Engineer', 'Systems Administrator'
      ],
      qa: [
        'QA Engineer', 'Test Automation Engineer', 'Software Tester',
        'Quality Assurance Analyst', 'Performance Testing Engineer'
      ],
      product: [
        'Product Manager', 'Technical Product Manager', 'Product Owner',
        'Business Analyst', 'Product Designer', 'UX Researcher'
      ]
    };

    let suggestions = [];

    // Match based on keywords in job title
    Object.entries(jobCategories).forEach(([category, jobs]) => {
      if (jobTitle_lower.includes(category) ||
          jobs.some(job => jobTitle_lower.includes(job.toLowerCase().split(' ')[0]))) {
        suggestions = [...suggestions, ...jobs];
      }
    });

    // Default suggestions if no matches found
    if (suggestions.length === 0) {
      suggestions = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer',
        'Full Stack Developer', 'Web Developer'
      ];
    }

    // Remove duplicates and the original job title, then return top 5
    return [...new Set(suggestions)]
      .filter(job => job.toLowerCase() !== jobTitle.toLowerCase())
      .slice(0, 5);
  }

  /**
   * Calculate readiness level based on match score
   * @param {number} matchScore - Match score percentage
   * @returns {string} Readiness level
   */
  calculateReadinessLevel(matchScore) {
    if (matchScore >= 75) {
      return 'Strong';
    } else if (matchScore >= 50) {
      return 'Moderate';
    } else {
      return 'Needs Work';
    }
  }

  /**
   * Generate preparation tips based on analysis
   * @param {number} matchScore - Match score percentage
   * @param {string[]} missingSkills - Array of missing skills
   * @param {string} jobTitle - Job title
   * @returns {string[]} Array of actionable tips
   */
  generatePrepTips(matchScore, missingSkills, jobTitle) {
    const tips = [];

    // Score-based tips
    if (matchScore >= 75) {
      tips.push('Polish your resume to highlight matching skills more prominently');
      tips.push('Prepare specific examples of projects using your existing skills');
    } else if (matchScore >= 50) {
      tips.push('Focus on learning the top 2-3 missing skills to boost your match score');
      tips.push('Consider taking online courses to fill knowledge gaps');
    } else {
      tips.push('Prioritize learning the most in-demand skills for this role');
      tips.push('Start with foundational skills before moving to advanced topics');
    }

    // Role-specific tips
    const jobTitle_lower = jobTitle.toLowerCase();
    if (jobTitle_lower.includes('frontend') || jobTitle_lower.includes('ui')) {
      tips.push('Build a portfolio showcasing responsive web designs and user interfaces');
    } else if (jobTitle_lower.includes('backend') || jobTitle_lower.includes('api')) {
      tips.push('Create projects demonstrating database design and API development');
    } else if (jobTitle_lower.includes('fullstack') || jobTitle_lower.includes('full stack')) {
      tips.push('Develop end-to-end applications showing both frontend and backend skills');
    } else if (jobTitle_lower.includes('data')) {
      tips.push('Work on data analysis projects and showcase your findings with visualizations');
    }

    // Missing skills tips
    if (missingSkills.length > 0) {
      if (missingSkills.length <= 3) {
        tips.push(`Focus on mastering these key skills: ${missingSkills.slice(0, 3).join(', ')}`);
      } else {
        tips.push('Break down your learning into phases - tackle 2-3 skills at a time');
      }
    }

    // Generic professional tips
    const genericTips = [
      'Practice coding challenges to improve problem-solving skills',
      'Join developer communities and contribute to open-source projects',
      'Prepare for behavioral interviews by practicing STAR method responses',
      'Research the company culture and values before applying',
      'Network with professionals in your target role on LinkedIn'
    ];

    // Fill remaining slots with generic tips if needed
    while (tips.length < 3 && genericTips.length > 0) {
      const randomTip = genericTips.splice(Math.floor(Math.random() * genericTips.length), 1)[0];
      if (!tips.includes(randomTip)) {
        tips.push(randomTip);
      }
    }

    return tips.slice(0, 3); // Return exactly 3 tips
  }

  /**
   * Destroy the agent and clean up subscriptions
   */
  destroy() {
    if (!this.isInitialized) {
      console.warn('CareerRecommendationAgent is not initialized');
      return;
    }

    // Unsubscribe from all events
    this.eventCallbacks.forEach((callback, event) => {
      agentBus.unsubscribe(event, callback);
    });

    this.eventCallbacks.clear();
    this.isInitialized = false;

    console.log('CareerRecommendationAgent destroyed successfully');
  }

  /**
   * Check if agent is initialized
   * @returns {boolean} Initialization status
   */
  isReady() {
    return this.isInitialized;
  }
}

// Export singleton instance
const careerRecommendationAgent = new CareerRecommendationAgent();
export default careerRecommendationAgent;