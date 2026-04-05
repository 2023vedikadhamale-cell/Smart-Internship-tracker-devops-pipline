/**
 * CareerTrack AI Assistant
 * Professional, Helpful, Efficient
 */

class CareerTrackChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.typingDelay = 500;
    this.userName = this.getUserName();
    this.userRole = localStorage.getItem('role') || 'intern';
    this.lastIntent = null;
    this.init();
  }

  getUserName() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.name || localStorage.getItem('userName') || 'there';
    } catch {
      return 'there';
    }
  }

  getUserEmail() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.email || localStorage.getItem('userEmail') || null;
    } catch {
      return null;
    }
  }

  getUserApplications() {
    try {
      const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
      if (this.userRole === 'recruiter') return allApplications;

      const userEmail = this.getUserEmail();
      if (!userEmail) return [];
      return allApplications.filter(app => app.candidateEmail === userEmail);
    } catch {
      return [];
    }
  }

  init() {
    this.createChatbotUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  createChatbotUI() {
    const chatbotHTML = `
      <div id="chatbot-widget" class="chatbot-widget">
        <div id="chatbot-toggle" class="chatbot-toggle" title="AI Assistant">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>

        <div id="chatbot-window" class="chatbot-window" style="display: none;">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"></path>
                </svg>
              </div>
              <div>
                <h3>CareerTrack AI</h3>
                <span class="chatbot-status">Ready to help</span>
              </div>
            </div>
            <button id="chatbot-close" class="chatbot-close-btn" title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div id="chatbot-messages" class="chatbot-messages"></div>

          <div id="quick-actions" class="quick-actions">
            <button class="quick-action-btn" data-action="applications">My Applications</button>
            <button class="quick-action-btn" data-action="jobs">Find Jobs</button>
            <button class="quick-action-btn" data-action="tips">Career Tips</button>
            <button class="quick-action-btn" data-action="help">Help</button>
          </div>

          <div id="typing-indicator" class="typing-indicator" style="display: none;">
            <span></span><span></span><span></span>
          </div>

          <div class="chatbot-input-area">
            <input type="text" id="chatbot-input" class="chatbot-input"
                   placeholder="Ask me anything..." autocomplete="off" />
            <button id="chatbot-send" class="chatbot-send-btn" title="Send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  attachEventListeners() {
    document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-close').addEventListener('click', () => this.closeChat());
    document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());

    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleQuickAction(e.target.getAttribute('data-action'));
      });
    });
  }

  handleQuickAction(action) {
    const actionMap = {
      'applications': 'Show my applications',
      'jobs': 'Show available jobs',
      'tips': 'Give me career tips',
      'help': 'What can you help me with'
    };
    document.getElementById('chatbot-input').value = actionMap[action] || '';
    this.sendMessage();
  }

  toggleChat() {
    const chatWindow = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');

    if (this.isOpen) {
      this.closeChat();
    } else {
      chatWindow.style.display = 'flex';
      toggle.classList.add('active');
      this.isOpen = true;
      document.getElementById('chatbot-input').focus();
    }
  }

  closeChat() {
    document.getElementById('chatbot-window').style.display = 'none';
    document.getElementById('chatbot-toggle').classList.remove('active');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    setTimeout(() => {
      const applications = this.getUserApplications();
      const greeting = this.getTimeGreeting();

      let msg = `${greeting}, ${this.userName}.\n\n`;
      msg += this.userRole === 'recruiter'
        ? "I can help you manage applicants and track hiring progress."
        : "I can help you track applications, find jobs, and prepare for interviews.";

      if (applications.length > 0) {
        const interviews = applications.filter(a => a.status === 'Interview').length;
        if (interviews > 0) {
          msg += `\n\nYou have ${interviews} upcoming interview${interviews > 1 ? 's' : '}.`;
        }
      }

      msg += "\n\nHow can I assist you today?";
      this.addMessage(msg, 'bot');
    }, 300);
  }

  getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const userMessage = input.value.trim();
    if (!userMessage) return;

    this.addMessage(userMessage, 'user');
    input.value = '';
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.processIntent(userMessage);
      this.addMessage(response, 'bot');
    }, this.typingDelay);
  }

  processIntent(message) {
    const q = message.toLowerCase().trim();

    // Greetings
    if (this.matches(q, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return `Hello, ${this.userName}! How can I help you today?`;
    }

    // Thanks
    if (this.matches(q, ['thank', 'thanks', 'thx', 'appreciate'])) {
      return `You're welcome! Let me know if you need anything else.`;
    }

    // Goodbye
    if (this.matches(q, ['bye', 'goodbye', 'see you', 'take care'])) {
      return `Goodbye, ${this.userName}. Best of luck with your career!`;
    }

    // How are you
    if (this.matches(q, ['how are you', "how's it going", 'how do you do'])) {
      return `I'm doing well, thank you for asking! Ready to assist you with your career journey.`;
    }

    // Applications
    if (this.matches(q, ['my application', 'show application', 'applications', 'applied', 'view application'])) {
      return this.getApplicationsList();
    }

    // Status
    if (this.matches(q, ['status', 'progress', 'update', 'any news'])) {
      return this.getApplicationStatus();
    }

    // Interviews
    if (this.matches(q, ['interview', 'scheduled', 'upcoming'])) {
      return this.getInterviews();
    }

    // Jobs
    if (this.matches(q, ['job', 'jobs', 'opportunity', 'opening', 'find job', 'available'])) {
      return this.getJobs();
    }

    // Statistics
    if (this.matches(q, ['statistic', 'stats', 'how many', 'total', 'count', 'summary'])) {
      return this.getStats();
    }

    // Tips
    if (this.matches(q, ['tip', 'advice', 'how to', 'prepare', 'improve'])) {
      if (this.matches(q, ['interview'])) return this.getInterviewTips();
      if (this.matches(q, ['resume', 'cv'])) return this.getResumeTips();
      return this.getCareerTips();
    }

    // Resume
    if (this.matches(q, ['resume', 'cv'])) {
      return this.getResumeTips();
    }

    // Profile
    if (this.matches(q, ['profile', 'my info', 'my detail', 'account'])) {
      return this.getProfileInfo();
    }

    // Offers
    if (this.matches(q, ['offer', 'accepted', 'selected', 'got in'])) {
      return this.getOffers();
    }

    // Rejected
    if (this.matches(q, ['rejected', 'rejection', 'not selected'])) {
      return this.getRejections();
    }

    // Help
    if (this.matches(q, ['help', 'what can', 'menu', 'option', 'command'])) {
      return this.getHelp();
    }

    // Motivation
    if (this.matches(q, ['motivat', 'discourag', 'stressed', 'worried', 'anxious'])) {
      return this.getMotivation();
    }

    // Default
    return this.getDefaultResponse();
  }

  matches(query, keywords) {
    return keywords.some(kw => query.includes(kw));
  }

  getApplicationsList() {
    const apps = this.getUserApplications();
    if (apps.length === 0) {
      return `You haven't submitted any applications yet.\n\nVisit "Browse Jobs" to explore opportunities and apply.`;
    }

    let msg = `**Your Applications** (${apps.length} total)\n\n`;
    apps.slice(-5).reverse().forEach((app, i) => {
      const role = app.jobRole || app.jobTitle || 'Position';
      const company = app.company || 'Company';
      const status = app.status || 'Applied';
      msg += `${i + 1}. ${role} at ${company}\n   Status: ${status}\n\n`;
    });

    if (apps.length > 5) {
      msg += `Showing recent 5 of ${apps.length}. Visit "My Applications" for the full list.`;
    }
    return msg;
  }

  getApplicationStatus() {
    const apps = this.getUserApplications();
    if (apps.length === 0) {
      return `No applications to show status for. Start applying to track your progress.`;
    }

    const counts = {};
    apps.forEach(a => {
      const s = a.status || 'Pending';
      counts[s] = (counts[s] || 0) + 1;
    });

    let msg = `**Application Status Summary**\n\n`;
    ['Offer', 'Interview', 'Shortlisted', 'Applied', 'Pending', 'Rejected'].forEach(status => {
      if (counts[status]) {
        msg += `${status}: ${counts[status]}\n`;
      }
    });

    if (counts['Interview']) {
      msg += `\nYou have interviews scheduled. Make sure to prepare well.`;
    }
    return msg;
  }

  getInterviews() {
    const apps = this.getUserApplications();
    const interviews = apps.filter(a =>
      ['Interview', 'Scheduled', 'Shortlisted'].includes(a.status)
    );

    if (interviews.length === 0) {
      return `No interviews scheduled at the moment.\n\nKeep applying and preparing. Your opportunity will come.`;
    }

    let msg = `**Upcoming Interviews** (${interviews.length})\n\n`;
    interviews.forEach((app, i) => {
      const role = app.jobRole || app.jobTitle || 'Position';
      const company = app.company || 'Company';
      const date = app.interviewDate || 'Date TBD';
      msg += `${i + 1}. ${role} at ${company}\n   Date: ${date}\n\n`;
    });

    msg += `**Preparation Tips:**\n`;
    msg += `- Research the company thoroughly\n`;
    msg += `- Review the job description\n`;
    msg += `- Prepare questions about the role\n`;
    msg += `- Practice common interview questions`;

    return msg;
  }

  getJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    if (jobs.length === 0) {
      return `No job listings available currently. Check back later for new opportunities.`;
    }

    let msg = `**Available Opportunities** (${jobs.length} total)\n\n`;
    jobs.slice(0, 5).forEach((job, i) => {
      const title = job.title || job.jobRole || 'Position';
      const company = job.company || 'Company';
      const location = job.location || 'Remote';
      msg += `${i + 1}. ${title} at ${company}\n   Location: ${location}\n\n`;
    });

    if (jobs.length > 5) {
      msg += `View all ${jobs.length} jobs on the "Browse Jobs" page.`;
    }
    return msg;
  }

  getStats() {
    const apps = this.getUserApplications();
    if (apps.length === 0) {
      return `**Career Statistics**\n\nTotal Applications: 0\n\nStart applying to track your progress.`;
    }

    const interviews = apps.filter(a => ['Interview', 'Scheduled'].includes(a.status)).length;
    const offers = apps.filter(a => ['Offer', 'Accepted'].includes(a.status)).length;
    const rejected = apps.filter(a => a.status === 'Rejected').length;
    const pending = apps.length - interviews - offers - rejected;
    const successRate = Math.round(((offers + interviews) / apps.length) * 100);

    let msg = `**Career Statistics**\n\n`;
    msg += `Total Applications: ${apps.length}\n`;
    msg += `Interviews: ${interviews}\n`;
    msg += `Offers: ${offers}\n`;
    msg += `Pending: ${pending}\n`;
    msg += `Rejected: ${rejected}\n\n`;
    msg += `Response Rate: ${successRate}%`;

    return msg;
  }

  getCareerTips() {
    const tips = [
      `**Application Tips**\n\n- Customize your resume for each role\n- Research the company before applying\n- Follow up after 1-2 weeks\n- Keep track of all applications\n- Apply early when possible`,
      `**Professional Development**\n\n- Build a strong LinkedIn profile\n- Network with industry professionals\n- Work on relevant projects\n- Stay updated with industry trends\n- Consider certifications`,
      `**Job Search Strategy**\n\n- Set daily application goals\n- Focus on quality over quantity\n- Prepare a master resume\n- Create company-specific cover letters\n- Use multiple job platforms`
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  getInterviewTips() {
    return `**Interview Preparation Guide**\n\n**Before:**\n- Research the company's mission and values\n- Review the job description carefully\n- Prepare 3-5 questions to ask\n- Practice common questions\n\n**During:**\n- Use the STAR method for behavioral questions\n- Be concise and specific\n- Show enthusiasm for the role\n- Ask thoughtful questions\n\n**After:**\n- Send a thank-you email within 24 hours\n- Follow up if you haven't heard back in a week`;
  }

  getResumeTips() {
    return `**Resume Best Practices**\n\n**Format:**\n- Keep it to 1-2 pages\n- Use clean, professional fonts\n- Include clear section headers\n- Save as PDF\n\n**Content:**\n- Start with a strong summary\n- Quantify achievements when possible\n- Use action verbs\n- Tailor keywords to each job\n\n**Avoid:**\n- Generic objective statements\n- Irrelevant work experience\n- Spelling and grammar errors\n- Personal information like age or photo`;
  }

  getProfileInfo() {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const apps = this.getUserApplications();

      let msg = `**Your Profile**\n\n`;
      msg += `Name: ${user.name || this.userName}\n`;
      msg += `Email: ${user.email || 'Not set'}\n`;
      msg += `Role: ${this.userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}\n`;
      msg += `Applications: ${apps.length}\n\n`;
      msg += `Visit "My Profile" to update your details.`;
      return msg;
    } catch {
      return `Unable to load profile information. Please try again.`;
    }
  }

  getOffers() {
    const apps = this.getUserApplications();
    const offers = apps.filter(a => ['Offer', 'Accepted'].includes(a.status));

    if (offers.length === 0) {
      return `No offers yet. Keep applying and preparing.\n\nEvery application is a step closer to your goal.`;
    }

    let msg = `**Congratulations!** You have ${offers.length} offer${offers.length > 1 ? 's' : ''}.\n\n`;
    offers.forEach((app, i) => {
      const role = app.jobRole || app.jobTitle || 'Position';
      const company = app.company || 'Company';
      msg += `${i + 1}. ${role} at ${company}\n`;
    });
    return msg;
  }

  getRejections() {
    const apps = this.getUserApplications();
    const rejections = apps.filter(a => a.status === 'Rejected');

    if (rejections.length === 0) {
      return `No rejections on record. Keep up the momentum.`;
    }

    const active = apps.length - rejections.length;
    let msg = `You have ${rejections.length} rejection${rejections.length > 1 ? 's' : ''}.`;

    if (active > 0) {
      msg += ` However, you still have ${active} active application${active > 1 ? 's' : ''}.`;
    }

    msg += `\n\n**Remember:**\n- Rejection is a normal part of the process\n- Each application is a learning opportunity\n- The right opportunity will come\n- Focus on what you can control`;

    return msg;
  }

  getMotivation() {
    const quotes = [
      `The job search can be challenging, but persistence pays off.\n\n"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill\n\nKeep applying, keep improving, and your opportunity will come.`,
      `Every successful person faced setbacks. The difference is they kept going.\n\n**Action Items:**\n- Review and improve your resume\n- Practice interview skills\n- Expand your network\n- Apply to new positions daily\n\nYou've got this.`,
      `It's normal to feel discouraged sometimes. What matters is how you respond.\n\n**Stay focused:**\n- Set small, achievable daily goals\n- Celebrate small wins\n- Learn from each application\n- Take breaks when needed\n\nYour persistence will pay off.`
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  getHelp() {
    let msg = `**How I Can Help**\n\n`;
    msg += `**Applications:**\n`;
    msg += `- "Show my applications"\n`;
    msg += `- "Check my status"\n`;
    msg += `- "Any interviews?"\n\n`;
    msg += `**Jobs:**\n`;
    msg += `- "Show available jobs"\n`;
    msg += `- "Find opportunities"\n\n`;
    msg += `**Career Help:**\n`;
    msg += `- "Interview tips"\n`;
    msg += `- "Resume advice"\n`;
    msg += `- "Career tips"\n\n`;
    msg += `**Other:**\n`;
    msg += `- "My profile"\n`;
    msg += `- "Statistics"\n\n`;
    msg += `Just type naturally - I'll understand.`;
    return msg;
  }

  getDefaultResponse() {
    return `I'm not sure I understood that. Here are some things I can help with:\n\n- Track your applications\n- Find job opportunities\n- Prepare for interviews\n- Get career advice\n\nType "help" for a full list of options.`;
  }

  addMessage(text, sender) {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = `chatbot-message ${sender}-message`;
    div.innerHTML = `<div class="message-content">${this.formatMessage(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  formatMessage(text) {
    let formatted = this.escapeHtml(text);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formatted;
  }

  showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
  }

  hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.careerTrackChatbot = new CareerTrackChatbot();
});
