/**
 * ResumeMatchAgent - Analyzes resume matches against job descriptions
 */
import agentBus from './agentBus.js';
import { EVENTS } from './agentTypes.js';

class ResumeMatchAgent {
  constructor() {
    this.isInitialized = false;
    this.eventCallbacks = new Map();
  }

  /**
   * Initialize the agent and subscribe to events
   */
  init() {
    if (this.isInitialized) {
      console.warn('ResumeMatchAgent is already initialized');
      return;
    }

    // Create bound callback to maintain context
    const analysisRequestedCallback = this.handleAnalysisRequested.bind(this);
    this.eventCallbacks.set(EVENTS.RESUME_ANALYSIS_REQUESTED, analysisRequestedCallback);

    // Subscribe to resume analysis requests
    agentBus.subscribe(EVENTS.RESUME_ANALYSIS_REQUESTED, analysisRequestedCallback);

    this.isInitialized = true;
    console.log('ResumeMatchAgent initialized successfully');
  }

  /**
   * Handle resume analysis requested event
   * @param {Object} payload - Event payload containing candidateSkills, jobDescription, jobTitle
   */
  handleAnalysisRequested(payload) {
    const { candidateSkills, jobDescription, jobTitle } = payload;

    if (!candidateSkills || !jobDescription) {
      console.error('ResumeMatchAgent: Missing required data for analysis');
      return;
    }

    console.log(`ResumeMatchAgent: Processing analysis for job "${jobTitle}"`);

    // Perform the analysis
    const analysisResult = this.analyzeMatch(candidateSkills, jobDescription);

    // Create result payload including jobTitle
    const resultPayload = {
      ...analysisResult,
      jobTitle
    };

    // Publish analysis complete event
    agentBus.publish(EVENTS.RESUME_ANALYSIS_COMPLETE, resultPayload);

    // Also publish recommendation requested event (to trigger Agent 2)
    agentBus.publish(EVENTS.RECOMMENDATION_REQUESTED, resultPayload);

    console.log(`ResumeMatchAgent: Analysis complete with ${analysisResult.matchScore}% match`);
  }

  /**
   * Analyze match between candidate skills and job description
   * @param {string[]} candidateSkills - Array of candidate skill strings
   * @param {string} jobDescription - Job description text
   * @returns {Object} Analysis result with matchedSkills, missingSkills, matchScore
   */
  analyzeMatch(candidateSkills, jobDescription) {
    // Convert candidate skills to lowercase for case-insensitive matching
    const normalizedCandidateSkills = candidateSkills.map(skill =>
      skill.toLowerCase().trim()
    );

    // Extract keywords from job description
    const jobKeywords = this.extractJobKeywords(jobDescription);

    // Find matched skills
    const matchedSkills = [];
    const missingSkills = [];

    jobKeywords.forEach(keyword => {
      const isMatched = normalizedCandidateSkills.some(candidateSkill =>
        candidateSkill.includes(keyword) || keyword.includes(candidateSkill)
      );

      if (isMatched) {
        // Find the original candidate skill that matched
        const originalSkill = candidateSkills.find(skill =>
          skill.toLowerCase().includes(keyword) || keyword.includes(skill.toLowerCase())
        );
        if (originalSkill && !matchedSkills.includes(originalSkill)) {
          matchedSkills.push(originalSkill);
        }
      } else {
        // Use the original keyword from job description
        const originalKeyword = this.findOriginalKeyword(jobDescription, keyword);
        if (!missingSkills.includes(originalKeyword)) {
          missingSkills.push(originalKeyword);
        }
      }
    });

    // Calculate match score as percentage
    const matchScore = jobKeywords.length > 0
      ? Math.round((matchedSkills.length / jobKeywords.length) * 100)
      : 0;

    return {
      matchedSkills,
      missingSkills,
      matchScore
    };
  }

  /**
   * Extract relevant keywords from job description
   * @param {string} jobDescription - Job description text
   * @returns {string[]} Array of extracted keywords
   */
  extractJobKeywords(jobDescription) {
    // Common technical skills and keywords to look for
    const techSkillPatterns = [
      // Programming languages
      'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'go',
      'typescript', 'scala', 'rust', 'dart', 'r', 'matlab', 'sql',

      // Frameworks and libraries
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
      'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'tailwind',

      // Databases
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra',

      // Cloud and DevOps
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'gitlab', 'github',
      'ci/cd', 'terraform', 'ansible',

      // Other technologies
      'html', 'css', 'sass', 'less', 'webpack', 'vite', 'babel', 'npm', 'yarn',
      'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum'
    ];

    const description = jobDescription.toLowerCase();
    const foundKeywords = [];

    // Extract explicit skill patterns
    techSkillPatterns.forEach(pattern => {
      if (description.includes(pattern)) {
        foundKeywords.push(pattern);
      }
    });

    // Extract words that look like skills (3+ characters, alphanumeric + common chars)
    const words = description.match(/\\b[a-zA-Z][a-zA-Z0-9+#./-]{2,}\\b/g) || [];
    const additionalSkills = words
      .filter(word =>
        word.length >= 3 &&
        !this.isCommonWord(word) &&
        !foundKeywords.includes(word)
      )
      .slice(0, 10); // Limit additional skills to prevent noise

    return [...foundKeywords, ...additionalSkills];
  }

  /**
   * Check if a word is a common word that should be ignored
   * @param {string} word - Word to check
   * @returns {boolean} True if word should be ignored
   */
  isCommonWord(word) {
    const commonWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one',
      'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old',
      'see', 'two', 'way', 'who', 'boy', 'did', 'use', 'each', 'she', 'which', 'their', 'said',
      'time', 'will', 'about', 'after', 'first', 'never', 'these', 'think', 'where', 'being',
      'every', 'great', 'might', 'shall', 'still', 'those', 'under', 'while', 'experience',
      'work', 'team', 'with', 'have', 'this', 'that', 'they', 'from', 'would', 'there', 'been',
      'were', 'said', 'what', 'your', 'when', 'make', 'more', 'than', 'into', 'over', 'such',
      'take', 'only', 'know', 'year', 'come', 'good', 'also', 'well', 'back', 'other', 'many',
      'some', 'very', 'just', 'even', 'most', 'made', 'need', 'should', 'through', 'years'
    ];

    return commonWords.includes(word.toLowerCase());
  }

  /**
   * Find original keyword casing from job description
   * @param {string} jobDescription - Original job description
   * @param {string} keyword - Lowercase keyword to find
   * @returns {string} Original keyword with proper casing
   */
  findOriginalKeyword(jobDescription, keyword) {
    const regex = new RegExp(`\\\\b${keyword}\\\\b`, 'gi');
    const match = jobDescription.match(regex);
    return match ? match[0] : keyword;
  }

  /**
   * Destroy the agent and clean up subscriptions
   */
  destroy() {
    if (!this.isInitialized) {
      console.warn('ResumeMatchAgent is not initialized');
      return;
    }

    // Unsubscribe from all events
    this.eventCallbacks.forEach((callback, event) => {
      agentBus.unsubscribe(event, callback);
    });

    this.eventCallbacks.clear();
    this.isInitialized = false;

    console.log('ResumeMatchAgent destroyed successfully');
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
const resumeMatchAgent = new ResumeMatchAgent();
export default resumeMatchAgent;