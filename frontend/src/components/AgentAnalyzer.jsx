/**
 * AgentAnalyzer - AI-powered job match analysis component
 */
import { useState, useEffect, useCallback } from 'react';
import useAgents from '../agents/useAgents';
import AgentActivityLog from './AgentActivityLog';

const AgentAnalyzer = ({ job, candidateSkills }) => {
  const { triggerAnalysis, subscribeToResults, subscribeToAnalysis, isReady } = useAgents();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Define addToActivityLog function BEFORE useEffect
  const addToActivityLog = useCallback((event, summary, data = null) => {
    // Map events to their corresponding agents
    const getAgentFromEvent = (event) => {
      switch (event) {
        case 'RESUME_ANALYSIS_REQUESTED':
        case 'RESUME_ANALYSIS_COMPLETE':
          return 'ResumeMatchAgent';
        case 'RECOMMENDATION_REQUESTED':
        case 'RECOMMENDATION_COMPLETE':
          return 'CareerRecommendationAgent';
        default:
          return 'System';
      }
    };

    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      agent: getAgentFromEvent(event),
      event,
      summary,
      details: data ? {
        matchScore: data.matchScore,
        skillsCount: data.matchedSkills?.length || data.skillsCount,
        jobTitle: data.jobTitle
      } : null
    };
    setActivityLog(prev => [...prev, logEntry]);
  }, []);

  // Subscribe to results and analysis events
  useEffect(() => {
    const unsubscribeResults = subscribeToResults((data) => {
      setResults(data);
      setIsAnalyzing(false);
      addToActivityLog('RECOMMENDATION_COMPLETE', 'Career recommendations and alternate job suggestions generated successfully', data);
    });

    const unsubscribeAnalysis = subscribeToAnalysis((data) => {
      addToActivityLog('RESUME_ANALYSIS_COMPLETE', 'Resume skills matched against job requirements', data);
      // Add the recommendation requested event that happens after analysis
      setTimeout(() => {
        addToActivityLog('RECOMMENDATION_REQUESTED', 'Requesting career recommendations based on analysis results', data);
      }, 100);
    });

    return () => {
      unsubscribeResults();
      unsubscribeAnalysis();
    };
  }, [subscribeToResults, subscribeToAnalysis, addToActivityLog]);

  const handleAnalyze = () => {
    if (!job?.title || !job?.description || !candidateSkills?.length) {
      console.warn('Missing job details or candidate skills for analysis');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    setActivityLog([]);

    // Log the start of analysis
    addToActivityLog('RESUME_ANALYSIS_REQUESTED', `Initiating analysis for "${job.title}" with ${candidateSkills.length} candidate skills`, {
      jobTitle: job.title,
      skillsCount: candidateSkills.length
    });

    // Trigger the analysis
    triggerAnalysis(candidateSkills, job.description, job.title);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchScoreBgColor = (score) => {
    if (score >= 70) return 'from-green-500 to-green-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getReadinessLevelColor = (level) => {
    switch (level) {
      case 'Strong': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Needs Work': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const CircularProgress = ({ score }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${getMatchScoreColor(score)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getMatchScoreColor(score)}`}>
            {score}%
          </span>
          <span className="text-xs text-gray-500">Match</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Career Match Analysis</h3>
        <p className="text-sm text-gray-600">
          Get personalized insights on how well you match this role and recommendations to improve your candidacy.
        </p>
      </div>

      {/* Analyze Button */}
      {!results && (
        <div className="text-center mb-6">
          <button
            onClick={handleAnalyze}
            disabled={!isReady() || isAnalyzing || !candidateSkills?.length}
            className={`
              inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isAnalyzing || !isReady() || !candidateSkills?.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }
            `}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Match...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Analyze My Match
              </>
            )}
          </button>
          {(!candidateSkills || candidateSkills.length === 0) && (
            <p className="text-sm text-red-500 mt-2">
              Please complete your profile with skills to enable match analysis
            </p>
          )}
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          {/* Match Score */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <CircularProgress score={results.matchScore} />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Match Score</h4>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getReadinessLevelColor(results.readinessLevel)}`}>
              {results.readinessLevel} Candidate
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-green-50 rounded-xl p-4">
              <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Matched Skills ({results.matchedSkills?.length || 0})
              </h5>
              <div className="flex flex-wrap gap-2">
                {results.matchedSkills?.length > 0 ? (
                  results.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-green-700 italic">No direct matches found</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-red-50 rounded-xl p-4">
              <h5 className="font-semibold text-red-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Missing Skills ({results.missingSkills?.length || 0})
              </h5>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills?.length > 0 ? (
                  results.missingSkills.slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-red-700 italic">All key skills matched!</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Recommendations */}
          {results.courseRecommendations?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-semibold text-blue-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Recommended Courses
              </h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Skill</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Platform</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Course</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-200">
                    {results.courseRecommendations.slice(0, 6).map((course, index) => (
                      <tr key={index} className="hover:bg-blue-100 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-blue-900">{course.skill}</td>
                        <td className="px-4 py-3 text-sm text-blue-700">{course.platform}</td>
                        <td className="px-4 py-3 text-sm text-blue-700">{course.courseName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Alternate Jobs */}
          {results.alternateJobs?.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Related Job Opportunities
              </h5>
              <div className="flex flex-wrap gap-2">
                {results.alternateJobs.map((jobTitle, index) => (
                  <button
                    key={index}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 transition-colors cursor-pointer"
                  >
                    {jobTitle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prep Tips */}
          {results.prepTips?.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h5 className="font-semibold text-yellow-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Preparation Tips
              </h5>
              <ol className="space-y-2">
                {results.prepTips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-yellow-800">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Agent Activity Log */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowActivityLog(!showActivityLog)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className={`w-4 h-4 mr-2 transition-transform ${showActivityLog ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
          Multi-Agent Communication ({activityLog.length})
        </button>

        {showActivityLog && (
          <div className="mt-4">
            <AgentActivityLog logs={activityLog} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentAnalyzer;