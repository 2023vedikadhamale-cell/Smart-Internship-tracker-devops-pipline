/**
 * useAgents - React hook to manage multi-agent system for career analysis
 */
import { useEffect, useCallback, useRef } from 'react';
import resumeMatchAgent from './ResumeMatchAgent.js';
import careerRecommendationAgent from './CareerRecommendationAgent.js';
import agentBus from './agentBus.js';
import { EVENTS } from './agentTypes.js';

/**
 * Custom React hook for managing career analysis agents
 * @returns {Object} Agent management functions
 */
export default function useAgents() {
  const isInitialized = useRef(false);

  // Initialize agents on mount
  useEffect(() => {
    if (!isInitialized.current) {
      try {
        // Initialize both agents
        resumeMatchAgent.init();
        careerRecommendationAgent.init();

        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to initialize agents:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized.current) {
        try {
          console.log('Destroying career analysis agents...');

          // Destroy both agents
          resumeMatchAgent.destroy();
          careerRecommendationAgent.destroy();

          isInitialized.current = false;
          console.log('Career analysis agents destroyed successfully');
        } catch (error) {
          console.error('Failed to destroy agents:', error);
        }
      }
    };
  }, []);

  /**
   * Trigger resume analysis by publishing to agent bus
   * @param {string[]} candidateSkills - Array of candidate skill strings
   * @param {string} jobDescription - Job description text
   * @param {string} jobTitle - Job title
   */
  const triggerAnalysis = useCallback((candidateSkills, jobDescription, jobTitle) => {
    if (!isInitialized.current) {
      console.error('Agents not initialized. Cannot trigger analysis.');
      return;
    }

    if (!candidateSkills || !jobDescription || !jobTitle) {
      console.error('Missing required parameters for analysis:', {
        candidateSkills: !!candidateSkills,
        jobDescription: !!jobDescription,
        jobTitle: !!jobTitle
      });
      return;
    }

    try {
      // Publish resume analysis request event
      agentBus.publish(EVENTS.RESUME_ANALYSIS_REQUESTED, {
        candidateSkills: Array.isArray(candidateSkills) ? candidateSkills : [candidateSkills],
        jobDescription: String(jobDescription),
        jobTitle: String(jobTitle)
      });
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    }
  }, []);

  /**
   * Subscribe to final recommendation results
   * @param {Function} callback - Callback function to handle results
   * @returns {Function} Unsubscribe function
   */
  const subscribeToResults = useCallback((callback) => {
    if (!isInitialized.current) {
      console.error('Agents not initialized. Cannot subscribe to results.');
      return () => {}; // Return empty unsubscribe function
    }

    if (typeof callback !== 'function') {
      console.error('Callback must be a function');
      return () => {};
    }

    try {
      // Create wrapper callback for error handling and data validation
      const wrappedCallback = (data) => {
        try {
          if (!data) {
            console.error('Received empty data in results subscription');
            return;
          }

          callback(data);
        } catch (error) {
          console.error('Error in results callback:', error);
        }
      };

      // Subscribe to recommendation complete events
      agentBus.subscribe(EVENTS.RECOMMENDATION_COMPLETE, wrappedCallback);

      // Return unsubscribe function
      return () => {
        try {
          agentBus.unsubscribe(EVENTS.RECOMMENDATION_COMPLETE, wrappedCallback);
        } catch (error) {
          console.error('Error unsubscribing from results:', error);
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to results:', error);
      return () => {};
    }
  }, []);

  /**
   * Subscribe to intermediate analysis results (resume match only)
   * @param {Function} callback - Callback function to handle analysis results
   * @returns {Function} Unsubscribe function
   */
  const subscribeToAnalysis = useCallback((callback) => {
    if (!isInitialized.current) {
      console.error('Agents not initialized. Cannot subscribe to analysis.');
      return () => {};
    }

    if (typeof callback !== 'function') {
      console.error('Callback must be a function');
      return () => {};
    }

    try {
      // Create wrapper callback for error handling
      const wrappedCallback = (data) => {
        try {
          if (!data) {
            console.error('Received empty data in analysis subscription');
            return;
          }

          callback(data);
        } catch (error) {
          console.error('Error in analysis callback:', error);
        }
      };

      // Subscribe to resume analysis complete events
      agentBus.subscribe(EVENTS.RESUME_ANALYSIS_COMPLETE, wrappedCallback);

      // Return unsubscribe function
      return () => {
        try {
          agentBus.unsubscribe(EVENTS.RESUME_ANALYSIS_COMPLETE, wrappedCallback);
        } catch (error) {
          console.error('Error unsubscribing from analysis:', error);
        }
      };
    } catch (error) {
      console.error('Failed to subscribe to analysis:', error);
      return () => {};
    }
  }, []);

  /**
   * Get current initialization status of agents
   * @returns {boolean} True if agents are initialized and ready
   */
  const isReady = useCallback(() => {
    return isInitialized.current &&
           resumeMatchAgent.isReady && resumeMatchAgent.isReady() &&
           careerRecommendationAgent.isReady && careerRecommendationAgent.isReady();
  }, []);

  /**
   * Get debug information about the agent system
   * @returns {Object} Debug information
   */
  const getDebugInfo = useCallback(() => {
    return {
      initialized: isInitialized.current,
      resumeAgentReady: resumeMatchAgent.isReady ? resumeMatchAgent.isReady() : false,
      careerAgentReady: careerRecommendationAgent.isReady ? careerRecommendationAgent.isReady() : false,
      eventBus: agentBus.getEvents ? agentBus.getEvents() : {}
    };
  }, []);

  return {
    // Core functions
    triggerAnalysis,
    subscribeToResults,
    subscribeToAnalysis,

    // Utility functions
    isReady,
    getDebugInfo
  };
}