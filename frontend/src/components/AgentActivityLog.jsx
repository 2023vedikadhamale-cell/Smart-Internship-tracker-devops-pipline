/**
 * AgentActivityLog - Visual timeline component for multi-agent communication logging
 */
import { useEffect, useState } from 'react';

const AgentActivityLog = ({ logs = [] }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);

  // Animate logs sliding in one by one
  useEffect(() => {
    if (logs.length === 0) {
      setVisibleLogs([]);
      return;
    }

    // Reset visible logs when logs array changes significantly
    if (logs.length < visibleLogs.length) {
      setVisibleLogs([]);
    }

    // Add new logs with staggered animation
    const newLogs = logs.slice(visibleLogs.length);

    newLogs.forEach((log, index) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
      }, index * 150); // 150ms delay between each log entry
    });
  }, [logs]);

  const getAgentConfig = (agent) => {
    const configs = {
      'ResumeMatchAgent': {
        name: 'Resume Analyzer',
        shortName: 'Agent 1',
        color: 'indigo',
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-800',
        borderColor: 'border-indigo-200',
        iconBg: 'bg-indigo-500',
        dotColor: 'bg-indigo-500'
      },
      'CareerRecommendationAgent': {
        name: 'Career Advisor',
        shortName: 'Agent 2',
        color: 'emerald',
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
        borderColor: 'border-emerald-200',
        iconBg: 'bg-emerald-500',
        dotColor: 'bg-emerald-500'
      },
      'System': {
        name: 'System',
        shortName: 'System',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        iconBg: 'bg-gray-500',
        dotColor: 'bg-gray-500'
      }
    };

    return configs[agent] || configs['System'];
  };

  const formatTimestamp = (timestamp) => {
    if (typeof timestamp === 'string' && timestamp.includes(':')) {
      return timestamp; // Already formatted time string
    }

    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getEventIcon = (event) => {
    const icons = {
      'RESUME_ANALYSIS_REQUESTED': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'RESUME_ANALYSIS_COMPLETE': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'RECOMMENDATION_REQUESTED': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'RECOMMENDATION_COMPLETE': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      )
    };

    return icons[event] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12,6 12,12 16,14"></polyline>
      </svg>
    );
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path>
          </svg>
        </div>
        <p className="text-sm text-gray-500">No agent activity yet</p>
        <p className="text-xs text-gray-400 mt-1">Start an analysis to see multi-agent communication</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">
          🤖 Multi-Agent Communication Log
        </span>
        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
          {visibleLogs.length} events
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Log entries */}
        <div className="space-y-4">
          {visibleLogs.map((log, index) => {
            const agentConfig = getAgentConfig(log.agent);
            const isLast = index === visibleLogs.length - 1;

            return (
              <div
                key={`${log.timestamp}-${log.event}-${index}`}
                className={`
                  relative flex items-start space-x-4 transition-all duration-500 ease-out transform
                  ${index < visibleLogs.length ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
                `}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    w-3 h-3 rounded-full ${agentConfig.dotColor}
                    border-2 border-white shadow-sm z-10 relative
                  `}></div>
                  {!isLast && (
                    <div className="absolute top-3 left-1.5 w-0.5 h-8 bg-gray-200 -z-10"></div>
                  )}
                </div>

                {/* Log content */}
                <div className={`
                  flex-1 min-w-0 pb-4 border-l-2 pl-4 ${agentConfig.borderColor} bg-white rounded-lg shadow-sm
                  hover:shadow-md transition-shadow duration-200
                `}>
                  <div className="p-3">
                    {/* Header with agent badge and timestamp */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {/* Agent badge */}
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                          ${agentConfig.bgColor} ${agentConfig.textColor}
                        `}>
                          <div className={`w-2 h-2 rounded-full ${agentConfig.iconBg} mr-1.5`}></div>
                          {agentConfig.name}
                        </span>

                        {/* Event name */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs font-mono">
                          {getEventIcon(log.event)}
                          <span className="ml-1">{log.event}</span>
                        </span>
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-gray-500 font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>

                    {/* Event summary */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {log.summary}
                    </p>

                    {/* Additional details if available */}
                    {log.details && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {log.details.matchScore !== undefined && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                              </svg>
                              Score: {log.details.matchScore}%
                            </span>
                          )}
                          {log.details.skillsCount !== undefined && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414L12 14l-2.414-2.414A2 2 0 019 10.172V5l-1-1z"></path>
                              </svg>
                              Skills: {log.details.skillsCount}
                            </span>
                          )}
                          {log.details.jobTitle && (
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                              </svg>
                              Job: {log.details.jobTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading indicator for when new logs are coming */}
        {visibleLogs.length < logs.length && (
          <div className="flex items-center space-x-2 ml-12 mt-2 text-xs text-gray-500">
            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing agent communication...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentActivityLog;