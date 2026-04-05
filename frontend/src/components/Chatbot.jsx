import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = () => {
  const { user, theme } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const userName = user?.name || 'there';
  const userRole = user?.role || 'candidate';
  const userEmail = user?.email || null;

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage = {
      id: Date.now(),
      text: `${getTimeGreeting()}, ${userName}! I'm your CareerTrack AI assistant. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [userName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getUserApplications = () => {
    try {
      const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
      if (userRole === 'recruiter') return allApplications;
      if (!userEmail) return [];
      return allApplications.filter(app => app.candidateEmail === userEmail);
    } catch {
      return [];
    }
  };

  const processMessage = (message) => {
    const q = message.toLowerCase().trim();

    // Greetings - avoid conflicts with "how" questions
    if (matches(q, ['hi', 'hello', 'hey', 'good morning', 'good afternoon']) && !q.includes('how')) {
      return `Hello, ${userName}! I'm your CareerTrack AI assistant. I can help with job searches, career advice, interview prep, and more. What would you like to know?`;
    }

    // Interview-related questions
    if (matches(q, ['interview', 'approach interview', 'interview prep', 'prepare interview', 'interview tip', 'interview question', 'behavioral interview', 'technical interview'])) {
      return `**Interview Preparation Guide**\n\n**Before the Interview:**\n• Research the company's mission, values, and recent news\n• Review the job description thoroughly\n• Prepare specific examples using the STAR method (Situation, Task, Action, Result)\n• Practice common questions out loud\n• Prepare 3-5 thoughtful questions to ask them\n\n**During the Interview:**\n• Arrive 10-15 minutes early\n• Dress professionally and appropriately\n• Make eye contact and give a firm handshake\n• Listen carefully and ask for clarification if needed\n• Show enthusiasm and genuine interest\n• Use specific examples to demonstrate your skills\n\n**After the Interview:**\n• Send a thank-you email within 24 hours\n• Reference specific points from the conversation\n• Reiterate your interest in the position\n• Follow up if you don't hear back within the timeline they mentioned`;
    }

    // Salary and negotiation
    if (matches(q, ['salary', 'negotiate', 'negotiation', 'pay', 'compensation', 'benefits', 'raise', 'promotion'])) {
      return `**Salary Negotiation Guide**\n\n**Research Phase:**\n• Use sites like Glassdoor, PayScale, LinkedIn Salary to research market rates\n• Consider your experience, education, and location\n• Factor in the complete compensation package (benefits, PTO, etc.)\n\n**Negotiation Tips:**\n• Wait for the offer before discussing salary\n• Express enthusiasm for the role first\n• Present a salary range, not a fixed number\n• Justify your request with specific achievements\n• Be prepared to negotiate other benefits if salary is fixed\n\n**Sample Script:**\n"I'm excited about this opportunity. Based on my research and experience, the market rate for this position is typically between $X and $Y. Would there be flexibility in the compensation package?"`;
    }

    // Cover letter advice
    if (matches(q, ['cover letter', 'covering letter', 'application letter', 'motivation letter'])) {
      return `**Cover Letter Best Practices**\n\n**Structure:**\n• Header with your contact information\n• Date and employer's details\n• Professional salutation (avoid "To Whom It May Concern")\n• 3-4 paragraph body\n• Professional closing\n\n**Content Guidelines:**\n• Address the hiring manager by name if possible\n• Mention the specific position you're applying for\n• Highlight 2-3 key achievements relevant to the role\n• Show knowledge of the company and role\n• Express genuine enthusiasm\n• Call to action in closing paragraph\n\n**What to Avoid:**\n• Repeating your entire resume\n• Generic templates\n• Focusing only on what you want\n• Typos or grammatical errors\n• Being too lengthy (keep to one page)`;
    }

    // Networking advice
    if (matches(q, ['networking', 'network', 'professional network', 'connections', 'linkedin', 'professional relationship'])) {
      return `**Professional Networking Guide**\n\n**LinkedIn Optimization:**\n• Professional headshot and compelling headline\n• Detailed summary with keywords\n• Complete work experience and education\n• Regular posts about industry topics\n• Connect with colleagues and industry professionals\n\n**Networking Strategies:**\n• Attend industry events, webinars, and conferences\n• Join professional associations in your field\n• Engage with others' content on social media\n• Offer help before asking for favors\n• Follow up with new connections within 48 hours\n\n**Networking Messages:**\n• Personalize connection requests\n• Be genuine and authentic\n• Build relationships, not just job opportunities\n• Stay in touch regularly, not just when job searching`;
    }

    // Job search strategies
    if (matches(q, ['job search', 'find job', 'job hunting', 'job board', 'job application', 'applying jobs'])) {
      return `**Effective Job Search Strategy**\n\n**Multi-Channel Approach:**\n• Online job boards (LinkedIn, Indeed, company websites)\n• Networking and referrals (70% of jobs are never advertised)\n• Recruitment agencies and headhunters\n• Direct company outreach\n• Industry events and job fairs\n\n**Application Best Practices:**\n• Tailor your resume and cover letter for each application\n• Apply within the first few days of posting\n• Follow application instructions exactly\n• Keep detailed records of all applications\n• Set daily application goals (3-5 quality applications)\n\n**Job Search Organization:**\n• Create a spreadsheet to track applications\n• Set up job alerts with specific keywords\n• Schedule regular follow-ups\n• Maintain a consistent daily routine`;
    }

    // Resume and CV advice
    if (matches(q, ['resume', 'cv', 'resume tip', 'curriculum vitae', 'resume format', 'resume writing'])) {
      return `**Resume Excellence Guide**\n\n**Structure & Format:**\n• Keep it to 1-2 pages maximum\n• Use a clean, professional font (Arial, Calibri)\n• Include clear section headers\n• Save and send as PDF format\n• Use consistent formatting throughout\n\n**Essential Sections:**\n• Contact information and professional summary\n• Work experience (reverse chronological order)\n• Education and certifications\n• Relevant technical skills\n• Optional: Projects, volunteer work, languages\n\n**Content Best Practices:**\n• Start with a compelling professional summary\n• Use action verbs (achieved, developed, managed, led)\n• Quantify accomplishments with numbers and percentages\n• Tailor keywords to match the job description\n• Show progression and growth in your career\n\n**What to Avoid:**\n• Generic objective statements\n• Spelling and grammar errors\n• Irrelevant work experience\n• Personal information (age, photo, marital status)\n• Lies or exaggerations`;
    }

    // Career development and growth
    if (matches(q, ['career development', 'career growth', 'skill development', 'upskill', 'reskill', 'professional development'])) {
      return `**Career Development Strategy**\n\n**Skills Assessment:**\n• Identify current skills and competencies\n• Research future skill requirements in your field\n• Find gaps between current and desired skills\n• Set specific learning goals with timelines\n\n**Learning Opportunities:**\n• Online courses (Coursera, LinkedIn Learning, Udemy)\n• Professional certifications relevant to your field\n• Industry conferences and workshops\n• Mentorship programs\n• Internal training and development programs\n\n**Career Planning:**\n• Set short-term (1 year) and long-term (5 year) goals\n• Seek feedback from supervisors and peers\n• Build relationships with mentors and sponsors\n• Document your achievements and growth\n• Stay updated with industry trends and changes`;
    }

    // Remote work and work-life balance
    if (matches(q, ['remote work', 'work from home', 'wfh', 'work life balance', 'flexible work', 'hybrid work'])) {
      return `**Remote Work Success Guide**\n\n**Setting Up for Success:**\n• Create a dedicated workspace at home\n• Invest in reliable internet and equipment\n• Establish clear boundaries between work and personal life\n• Maintain regular working hours\n• Dress professionally for video calls\n\n**Communication Best Practices:**\n• Over-communicate rather than under-communicate\n• Use video calls for important discussions\n• Respond promptly to messages and emails\n• Schedule regular check-ins with your team\n• Be proactive in sharing updates on your work\n\n**Productivity Tips:**\n• Use time-blocking and productivity techniques\n• Take regular breaks to avoid burnout\n• Stay connected with colleagues through virtual coffee chats\n• Maintain professional development activities\n• Set boundaries to avoid overworking`;
    }

    // Company research and preparation
    if (matches(q, ['company research', 'research company', 'company culture', 'company background', 'due diligence'])) {
      return `**Company Research Guide**\n\n**Essential Research Areas:**\n• Company mission, values, and culture\n• Recent news, press releases, and developments\n• Financial performance and growth trends\n• Key leadership team and organizational structure\n• Products, services, and target market\n• Competitors and market position\n\n**Research Sources:**\n• Company website and "About Us" section\n• LinkedIn company page and employee profiles\n• Glassdoor reviews from current/former employees\n• News articles and press releases\n• Industry reports and analyst reviews\n• Social media presence and content\n\n**Using Your Research:**\n• Demonstrate knowledge during interviews\n• Ask informed questions about the company\n• Align your experience with company needs\n• Show genuine interest and enthusiasm\n• Identify potential concerns or red flags`;
    }

    // Handling rejection and feedback
    if (matches(q, ['rejection', 'rejected', 'not selected', 'feedback', 'no response', 'ghosted'])) {
      return `**Handling Job Rejection Professionally**\n\n**Immediate Response:**\n• Thank them for their time and consideration\n• Ask for specific feedback on your application/interview\n• Express continued interest in future opportunities\n• Maintain professionalism and grace\n\n**Learning from Rejection:**\n• Analyze feedback objectively\n• Identify areas for improvement\n• Update your approach based on insights\n• Don't take rejection personally\n• Use it as motivation to improve\n\n**Moving Forward:**\n• Keep applying to other opportunities\n• Continue networking and skill development\n• Stay positive and maintain confidence\n• Consider the rejection as practice for future interviews\n• Remember that fit is mutual - the right opportunity will come\n\n**Follow-up Strategy:**\n• Connect with interviewers on LinkedIn\n• Ask to be considered for future openings\n• Maintain the relationship professionally`;
    }

    // Application tracking and follow-up
    if (matches(q, ['follow up', 'followup', 'application status', 'when to follow up', 'application tracking'])) {
      return `**Application Follow-up Strategy**\n\n**Timeline Guidelines:**\n• Wait 1-2 weeks after application before following up\n• Follow up again after 1 week if no response\n• After interview, send thank-you within 24 hours\n• Follow up on interview outcome after 1 week\n\n**Follow-up Methods:**\n• Email is generally preferred\n• Phone calls only if specifically requested\n• LinkedIn message as a last resort\n• Keep messages brief and professional\n\n**Sample Follow-up Email:**\n"Subject: Following up on [Position Title] Application\n\nDear [Hiring Manager],\n\nI wanted to follow up on my application for the [Position Title] role submitted on [Date]. I remain very interested in this opportunity and would welcome the chance to discuss how my skills align with your needs.\n\nThank you for your consideration.\n\nBest regards, [Your Name]"`;
    }

    // First job and entry level advice
    if (matches(q, ['first job', 'entry level', 'new graduate', 'fresh graduate', 'no experience', 'student'])) {
      return `**Entry-Level Job Search Guide**\n\n**Highlighting Your Value:**\n• Emphasize education, projects, and coursework\n• Include internships, part-time work, and volunteer experience\n• Showcase relevant coursework and academic achievements\n• Highlight soft skills and learning ability\n• Demonstrate passion and enthusiasm for the field\n\n**Building Experience:**\n• Seek internships and co-op opportunities\n• Volunteer for relevant organizations\n• Take on freelance or project work\n• Contribute to open-source projects (if applicable)\n• Attend industry events and workshops\n\n**Application Strategy:**\n• Target entry-level and trainee positions\n• Look for companies with graduate programs\n• Apply to smaller companies that may be more flexible\n• Consider contract or temporary positions as stepping stones\n• Network with alumni from your school`;
    }

    // Career change and transition
    if (matches(q, ['career change', 'career transition', 'switch career', 'change field', 'pivot career'])) {
      return `**Career Transition Strategy**\n\n**Self-Assessment:**\n• Identify transferable skills from current role\n• Clarify your motivations for changing careers\n• Research target industries and roles thoroughly\n• Assess financial implications and timeline\n• Consider required additional education or certifications\n\n**Transition Planning:**\n• Start building relevant skills while still employed\n• Network within your target industry\n• Consider informational interviews with professionals\n• Update your resume to highlight transferable skills\n• Prepare a compelling story for your career change\n\n**Making the Switch:**\n• Consider transitional roles that bridge both industries\n• Be prepared for potential salary adjustments\n• Be patient - career transitions take time\n• Leverage your unique background as a differentiator\n• Stay persistent and maintain confidence in your decision`;
    }

    // Personal data display
    if (matches(q, ['application', 'show application', 'my application'])) {
      const apps = getUserApplications();
      if (apps.length === 0) {
        return "You haven't submitted any applications yet. Visit 'Browse Jobs' to explore opportunities and start your job search!";
      }
      let response = `**Your Applications** (${apps.length} total)\n\n`;
      apps.slice(-3).reverse().forEach((app, i) => {
        response += `${i + 1}. ${app.jobRole} at ${app.companyName}\n   Status: ${app.status}\n   Applied: ${new Date(app.applicationDate).toLocaleDateString()}\n\n`;
      });
      if (apps.length > 3) {
        response += `Showing latest 3 applications. View all in the "My Applications" page.`;
      }
      return response;
    }

    if (matches(q, ['status', 'progress', 'stats', 'statistic', 'summary'])) {
      const apps = getUserApplications();
      if (apps.length === 0) {
        return "No applications to show stats for. Start applying to track your progress and build your career momentum!";
      }
      const interviews = apps.filter(a => a.status === 'Interview').length;
      const offers = apps.filter(a => a.status === 'Offer').length;
      const rejected = apps.filter(a => a.status === 'Rejected').length;
      const pending = apps.length - interviews - offers - rejected;

      return `**Your Career Statistics:**\n\nTotal Applications: ${apps.length}\nInterviews Scheduled: ${interviews}\nOffers Received: ${offers}\nPending Review: ${pending}\nRejected: ${rejected}\n\n**Success Rate:** ${Math.round(((interviews + offers) / apps.length) * 100)}% response rate\n\n${interviews > 0 ? "Great job getting interviews! Keep preparing and you'll land the right role." : "Keep applying consistently. The right opportunity is coming!"}`;
    }

    if (matches(q, ['job', 'jobs', 'find job', 'available job', 'opportunities'])) {
      const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
      if (jobs.length === 0) {
        return "No job listings available currently. Keep checking back as new opportunities are posted regularly!";
      }
      let response = `**Available Opportunities** (${jobs.length} total)\n\n`;
      jobs.slice(0, 3).forEach((job, i) => {
        response += `${i + 1}. ${job.jobRole} at ${job.companyName}\n   Location: ${job.location}\n   Posted: ${new Date(job.postedDate).toLocaleDateString()}\n\n`;
      });
      response += "Visit 'Browse Jobs' to see all opportunities and apply directly!";
      return response;
    }

    // General career advice
    if (matches(q, ['career', 'advice', 'guidance', 'tips', 'success', 'professional growth'])) {
      return `**Professional Career Success Tips**\n\n**Job Search Excellence:**\n• Set daily application goals (3-5 quality applications)\n• Customize each application to the specific role\n• Follow up professionally after 1-2 weeks\n• Keep detailed records of all applications\n• Network actively - 70% of jobs come through connections\n\n**Professional Development:**\n• Build a strong LinkedIn profile with regular updates\n• Stay updated with industry trends and technologies\n• Seek mentorship and offer to mentor others\n• Invest in continuous learning and certifications\n• Attend industry events and conferences\n\n**Interview & Communication:**\n• Research each company thoroughly before interviews\n• Practice behavioral questions using the STAR method\n• Prepare thoughtful questions to ask interviewers\n• Send thank-you emails within 24 hours\n• Follow up appropriately on application status`;
    }

    // Help and commands
    if (matches(q, ['help', 'what can you do', 'command', 'assistance', 'support'])) {
      return `**I'm your comprehensive career assistant! I can help with:**\n\n**Job Search & Applications:**\n• "Show my applications" - View your current applications\n• "Find jobs" - Browse available opportunities\n• "Job search tips" - Effective job hunting strategies\n• "Follow up advice" - When and how to follow up\n\n**Career Development:**\n• "Interview tips" - Comprehensive interview preparation\n• "Resume advice" - Professional resume writing\n• "Cover letter help" - Effective cover letter writing\n• "Salary negotiation" - How to negotiate compensation\n• "Career development" - Professional growth strategies\n\n**Specialized Topics:**\n• "Networking advice" - Building professional relationships\n• "Remote work tips" - Success in virtual environments\n• "Career change" - Transitioning between fields\n• "Company research" - How to research employers\n• "Handle rejection" - Dealing with setbacks professionally\n\n**Ask me anything about your career journey!**`;
    }

    // Thank you responses
    if (matches(q, ['thank', 'thanks', 'thx', 'appreciate', 'helpful'])) {
      return `You're very welcome! I'm here to support your career success. Feel free to ask me anything about job searching, career development, or professional growth. Best of luck with your applications!`;
    }

    // Default response for unrecognized queries
    return `I'd be happy to help you with your career questions! I specialize in all aspects of job searching and career development:\n\n**Popular Topics:**\n• **Interview preparation** - "Interview tips"\n• **Job search strategies** - "Job search advice"\n• **Resume & cover letters** - "Resume tips" or "Cover letter help"\n• **Salary negotiation** - "Salary advice"\n• **Career development** - "Career advice"\n• **Professional networking** - "Networking tips"\n• **Application tracking** - "Show my applications"\n\n**Just ask naturally!** For example: "How do I prepare for an interview?" or "What should I include in my resume?"\n\nWhat specific career topic would you like help with?`;
  };

  const matches = (query, keywords) => {
    return keywords.some(kw => {
      // Check for exact matches, partial matches, and word boundaries
      return query.includes(kw) ||
             query.split(' ').some(word => word.startsWith(kw) || word.includes(kw)) ||
             kw.split(' ').some(kwWord => query.includes(kwWord)) ||
             // Check for common variations and synonyms
             (kw === 'interview' && (query.includes('intervw') || query.includes('meeting'))) ||
             (kw === 'resume' && query.includes('curriculum')) ||
             (kw === 'salary' && (query.includes('money') || query.includes('wage'))) ||
             (kw === 'job search' && (query.includes('job hunt') || query.includes('employment'))) ||
             (kw === 'networking' && query.includes('connect'));
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: processMessage(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickActions = [
    { label: 'Interview Tips', message: 'How do I prepare for an interview?' },
    { label: 'Resume Help', message: 'Give me resume writing tips' },
    { label: 'Salary Advice', message: 'How do I negotiate salary?' },
    { label: 'Job Search Tips', message: 'Give me job search strategies' }
  ];

  const handleQuickAction = (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: processMessage(message),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chatbot-widget">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        title="AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"></path>
                </svg>
              </div>
              <div>
                <h3>CareerTrack AI</h3>
                <span className="chatbot-status">Ready to help</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close-btn"
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message ${message.sender}-message`}>
                <div className="message-content">
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.message)}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="chatbot-input"
              autoComplete="off"
            />
            <button
              onClick={handleSend}
              className="chatbot-send-btn"
              title="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;