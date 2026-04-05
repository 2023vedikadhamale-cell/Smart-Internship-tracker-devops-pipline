/**
 * ========================================
 * Smart Chatbot Agent for CareerTrack
 * ========================================
 * 
 * Features:
 * - Intent Detection (Perception)
 * - Request Processing (Decision)
 * - Data-Driven Responses (Action)
 */

class CareerTrackChatbot {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.typingDelay = 1000; // milliseconds
    this.init();
  }

  /**
   * Initialize chatbot
   */
  init() {
    this.createChatbotUI();
    this.attachEventListeners();
    this.addWelcomeMessage();
  }

  /**
   * CREATE CHATBOT UI
   */
  createChatbotUI() {
    const chatbotHTML = `
      <!-- Chatbot Container -->
      <div id="chatbot-widget" class="chatbot-widget">
        <!-- Toggle Button -->
        <div id="chatbot-toggle" class="chatbot-toggle" title="Open Chat Assistant">
          <span class="chat-icon">💬</span>
        </div>

        <!-- Chat Window -->
        <div id="chatbot-window" class="chatbot-window" style="display: none;">
          <!-- Header -->
          <div class="chatbot-header">
            <h3>CareerTrack Assistant</h3>
            <button id="chatbot-close" class="chatbot-close-btn" title="Close">✕</button>
          </div>

          <!-- Messages Area -->
          <div id="chatbot-messages" class="chatbot-messages">
            <!-- Messages will be appended here -->
          </div>

          <!-- Typing Indicator -->
          <div id="typing-indicator" class="typing-indicator" style="display: none;">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-area">
            <input
              type="text"
              id="chatbot-input"
              class="chatbot-input"
              placeholder="Ask about applications, jobs, interviews..."
              autocomplete="off"
            />
            <button id="chatbot-send" class="chatbot-send-btn" title="Send">📤</button>
          </div>

          <!-- Help Text -->
          <div class="chatbot-help">
            <small>💡 Try: "Show my applications" or "Do I have interviews?"</small>
          </div>
        </div>
      </div>
    `;

    // Append chatbot to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  /**
   * ATTACH EVENT LISTENERS
   */
  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    // Toggle chat window
    toggle.addEventListener('click', () => this.toggleChat());

    // Close chat window
    closeBtn.addEventListener('click', () => this.closeChat());

    // Send message on button click
    sendBtn.addEventListener('click', () => this.sendMessage());

    // Send message on Enter key
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Focus input on window open
    const chatWindow = document.getElementById('chatbot-window');
    new MutationObserver(() => {
      if (chatWindow.style.display !== 'none') {
        input.focus();
      }
    }).observe(chatWindow, { attributes: true });
  }

  /**
   * TOGGLE CHAT WINDOW
   */
  toggleChat() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    if (this.isOpen) {
      this.closeChat();
    } else {
      window.style.display = 'flex';
      toggle.classList.add('active');
      this.isOpen = true;
      document.getElementById('chatbot-input').focus();
    }
  }

  /**
   * CLOSE CHAT
   */
  closeChat() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    
    window.style.display = 'none';
    toggle.classList.remove('active');
    this.isOpen = false;
  }

  /**
   * ADD WELCOME MESSAGE
   */
  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage(
        "Hi! 👋 I'm your CareerTrack Assistant. I can help you with:\n\n" +
        "📋 View your applications\n" +
        "📊 Check application status\n" +
        "📅 Find interview schedules\n" +
        "💼 Discover job opportunities\n\n" +
        "What can I help you with?",
        'bot'
      );
    }, 500);
  }

  /**
   * SEND MESSAGE - Main flow
   */
  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const userMessage = input.value.trim();

    if (!userMessage) return;

    // Add user message to chat
    this.addMessage(userMessage, 'user');
    input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    // Process intent after delay (simulates AI thinking)
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.processIntent(userMessage);
      this.addMessage(response, 'bot');
    }, this.typingDelay);
  }

  /**
   * PROCESS INTENT - Decision Making (Core Logic)
   */
  processIntent(message) {
    const query = message.toLowerCase().trim();

    // INTENT 1: Show Applications
    if (
      query.includes('show') && query.includes('application') ||
      query.includes('my application') ||
      query === 'applications' ||
      query.includes('applied')
    ) {
      return this.getApplicationsList();
    }

    // INTENT 2: Check Status
    if (
      query.includes('status') ||
      query.includes('what is my status') ||
      query.includes('where am i')
    ) {
      return this.getApplicationStatus();
    }

    // INTENT 3: Check Interviews
    if (
      query.includes('interview') ||
      query.includes('do i have interview') ||
      query.includes('interview date') ||
      query.includes('scheduled interview')
    ) {
      return this.getInterviews();
    }

    // INTENT 4: Suggest Jobs
    if (
      query.includes('suggest') && query.includes('job') ||
      query.includes('available job') ||
      query.includes('job role') ||
      query === 'jobs' ||
      query.includes('job opportunities')
    ) {
      return this.suggestJobs();
    }

    // INTENT 5: Count Applications
    if (
      query.includes('how many') && query.includes('application') ||
      query.includes('total application') ||
      query.includes('application count')
    ) {
      return this.getApplicationCount();
    }

    // INTENT 6: Help / Commands
    if (
      query.includes('help') ||
      query === '?' ||
      query.includes('what can you do') ||
      query.includes('commands')
    ) {
      return this.getHelpMessage();
    }

    // DEFAULT: Not understood
    return this.getDefaultResponse();
  }

  /**
   * ACTION 1: Get Applications List
   */
  getApplicationsList() {
    try {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];

      if (applications.length === 0) {
        return "📭 You haven't applied to any jobs yet. Start browsing and applying to jobs!";
      }

      let response = `📋 Your Applications (${applications.length}):\n\n`;
      applications.forEach((app, index) => {
        const jobRole = app.jobRole || app.job_role || 'Job';
        const company = app.company || 'Company';
        const status = app.status || 'Pending';
        const statusEmoji = this.getStatusEmoji(status);

        response += `${index + 1}. ${statusEmoji} ${jobRole} at ${company}\n   Status: ${status}\n`;
      });

      return response;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return "❌ Error loading applications. Please try again.";
    }
  }

  /**
   * ACTION 2: Get Application Status
   */
  getApplicationStatus() {
    try {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];

      if (applications.length === 0) {
        return "📭 No applications yet. Apply to jobs to see status updates!";
      }

      const statuses = {};
      applications.forEach((app) => {
        const status = app.status || 'Pending';
        statuses[status] = (statuses[status] || 0) + 1;
      });

      let response = "📊 Application Status Summary:\n\n";
      Object.entries(statuses).forEach(([status, count]) => {
        const emoji = this.getStatusEmoji(status);
        response += `${emoji} ${status}: ${count}\n`;
      });

      return response;
    } catch (error) {
      console.error('Error getting status:', error);
      return "❌ Error loading status. Please try again.";
    }
  }

  /**
   * ACTION 3: Get Interviews
   */
  getInterviews() {
    try {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      const interviews = applications.filter(
        (app) => app.status === 'Interview' || app.status === 'Scheduled'
      );

      if (interviews.length === 0) {
        return "📭 No interviews scheduled yet. Keep applying and good luck! 🍀";
      }

      let response = `📅 Your Interviews (${interviews.length}):\n\n`;
      interviews.forEach((app, index) => {
        const company = app.company || 'Company';
        const jobRole = app.jobRole || app.job_role || 'Job';
        const interviewDate = app.interviewDate || 'Date TBD';

        response += `${index + 1}. ${company} - ${jobRole}\n   📍 ${interviewDate}\n`;
      });

      return response;
    } catch (error) {
      console.error('Error getting interviews:', error);
      return "❌ Error loading interviews. Please try again.";
    }
  }

  /**
   * ACTION 4: Suggest Jobs
   */
  suggestJobs() {
    try {
      const jobs = JSON.parse(localStorage.getItem('jobs')) || [];

      if (jobs.length === 0) {
        return "💼 No jobs available at the moment. Check back soon!";
      }

      let response = `💼 Available Job Opportunities (${jobs.length}):\n\n`;
      const recentJobs = jobs.slice(0, 5); // Show first 5

      recentJobs.forEach((job, index) => {
        const title = job.jobRole || job.title || 'Job Position';
        const company = job.company || 'Company';
        const stipend = job.stipend || job.salary || 'Flexible';

        response += `${index + 1}. ${title} at ${company}\n   💰 ${stipend}\n`;
      });

      if (jobs.length > 5) {
        response += `\n... and ${jobs.length - 5} more jobs available!`;
      }

      return response;
    } catch (error) {
      console.error('Error getting jobs:', error);
      return "❌ Error loading jobs. Please try again.";
    }
  }

  /**
   * ACTION 5: Get Application Count
   */
  getApplicationCount() {
    try {
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      const count = applications.length;

      if (count === 0) {
        return "📊 You have 0 applications. Start applying to jobs now! 🚀";
      }

      const interviews = applications.filter(
        (app) => app.status === 'Interview' || app.status === 'Scheduled'
      ).length;

      const rejected = applications.filter((app) => app.status === 'Rejected').length;
      const accepted = applications.filter((app) => app.status === 'Accepted').length;

      let response = `📊 Application Statistics:\n\n`;
      response += `📋 Total Applications: ${count}\n`;
      response += `✅ Accepted: ${accepted}\n`;
      response += `📅 Interviews: ${interviews}\n`;
      response += `❌ Rejected: ${rejected}\n`;

      return response;
    } catch (error) {
      console.error('Error counting applications:', error);
      return "❌ Error loading statistics. Please try again.";
    }
  }

  /**
   * HELP MESSAGE
   */
  getHelpMessage() {
    return (
      "🤖 CareerTrack Assistant Commands:\n\n" +
      "📋 'Show my applications' - View all your applications\n" +
      "📊 'What is my status' - Check application status\n" +
      "📅 'Do I have interviews' - View scheduled interviews\n" +
      "💼 'Suggest jobs' - Discover available jobs\n" +
      "📈 'How many applications' - View statistics\n\n" +
      "💡 You can also type in casual language and I'll understand!"
    );
  }

  /**
   * DEFAULT RESPONSE (Not understood)
   */
  getDefaultResponse() {
    const responses = [
      "🤔 Sorry, I didn't quite understand that. Try asking about your applications, interviews, or available jobs.",
      "I'm not sure about that. Try asking:\n• 'Show my applications'\n• 'Do I have interviews?'\n• 'Suggest jobs'",
      "❓ I can help with applications, interviews, and job suggestions. What would you like to know?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * UTILITY: Get Status Emoji
   */
  getStatusEmoji(status) {
    const statusMap = {
      'Accepted': '✅',
      'Rejected': '❌',
      'Interview': '📅',
      'Scheduled': '📅',
      'In Review': '👀',
      'Pending': '⏳',
    };
    return statusMap[status] || '📌';
  }

  /**
   * ADD MESSAGE TO CHAT
   */
  addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');

    messageDiv.className = `chatbot-message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(text)}</div>`;

    messagesContainer.appendChild(messageDiv);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store message
    this.messages.push({ text, sender, timestamp: new Date() });
  }

  /**
   * TYPING INDICATOR
   */
  showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
  }

  /**
   * ESCAPE HTML (Security)
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }
}

/**
 * INITIALIZE CHATBOT WHEN DOM IS READY
 */
document.addEventListener('DOMContentLoaded', () => {
  window.careerTrackChatbot = new CareerTrackChatbot();
});
