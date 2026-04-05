# 🤖 Chatbot Testing Guide

## Quick Start

### 1. Start the Server
```bash
cd Smart-internship-tracker
node backend/server.js
```

### 2. Open in Browser
```
http://localhost:3000
```

You'll see:
1. **Splash page** (auto-redirects after 4 seconds or click "Get Started")
2. **Login page** (select role: Intern or Recruiter)
3. **Dashboard** (with chat icon at bottom-right 💬)

---

## Testing Scenarios

### Scenario 1: Sign Up as Intern
1. Go to login page
2. Click "Don't have an account? Create one here"
3. Fill form:
   - Role: **Intern** ✓
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click "Create Account"
5. Should redirect to **Dashboard**

### Scenario 2: Apply to Jobs
1. On dashboard, click **"Browse Jobs"** in sidebar
2. Click **"Apply Now"** on any job
3. Fill application form and submit
4. Application saved to localStorage

### Scenario 3: Test Chatbot Intents

#### 3.1: Show Applications
- Click chat icon 💬
- Type: `"Show my applications"`
- Bot should display: List of all applications with status

#### 3.2: Check Status
- Type: `"What is my status"`
- Bot should display: Count of applications by status (Accepted, Rejected, Interview, etc.)

#### 3.3: View Interviews
- Type: `"Do I have interviews"`
- Bot should display: List of interviews with dates
- (First, set an application status to "Interview" to test this)

#### 3.4: Suggest Jobs
- Type: `"Suggest jobs"`
- Bot should display: Available jobs with titles, companies, stipends

#### 3.5: Application Count
- Type: `"How many applications"`
- Bot should display: Total count and breakdown by status

#### 3.6: Get Help
- Type: `"Help"` or `"?"`
- Bot should display: Available commands

### Scenario 4: Test with Recruiter Role
1. Login as **Recruiter**
   - Email: `recruiter@company.com`
   - Password: `password123`
   - Role: **Recruiter** ✓
2. Click **"Company Dashboard"**
3. Click **"Post a Job"**
4. Fill job form and submit
5. Job saved to localStorage
6. Open chatbot and test "Suggest jobs"

---

## Test Cases

### User Input Variations

| User Input | Expected Intent | Expected Output |
|-----------|-----------------|-----------------|
| "Show my applications" | show_applications | List of apps |
| "My applications" | show_applications | List of apps |
| "What are my applications" | show_applications | List of apps |
| "What is my status" | check_status | Status summary |
| "Status update" | check_status | Status summary |
| "Do I have interviews" | check_interviews | Interview list |
| "Show interviews" | check_interviews | Interview list |
| "Any interviews scheduled" | check_interviews | Interview list |
| "Suggest jobs" | suggest_jobs | Job recommendations |
| "Available jobs" | suggest_jobs | Job recommendations |
| "How many applications" | count_applications | Statistics |
| "Total apps count" | count_applications | Statistics |
| "Help" | help | Commands list |
| "What can you do" | help | Commands list |
| "unknown query" | default | "Not understood" |

---

## Edge Cases to Test

### Empty Data
1. Fresh account with NO applications
   - Ask: "Show my applications"
   - Expected: "You haven't applied to any jobs yet"

2. Fresh account with NO jobs posted
   - Ask: "Suggest jobs"
   - Expected: "No jobs available at the moment"

### Single Entry
1. One application
   - Ask: "How many applications"
   - Expected: Shows "1" and details

2. One interview scheduled
   - Ask: "Do I have interviews"
   - Expected: Shows the single interview

### Error Handling
1. Corrupted localStorage data
   - Expected: Graceful error handling, user-friendly message

2. JavaScript disabled
   - Expected: Chat widget doesn't appear (intended)

---

## UI/UX Testing

### Toggle Button
- [ ] Chat icon appears at bottom-right
- [ ] Icon pulses smoothly
- [ ] Hover effect works (scales up)
- [ ] Active state shows when opened

### Chat Window
- [ ] Opens with smooth animation
- [ ] Closes with smooth animation
- [ ] Appears above other elements (z-index)
- [ ] Responsive on mobile
- [ ] Doesn't overlap important content

### Messages
- [ ] User messages align right (blue)
- [ ] Bot messages align left (gray)
- [ ] Messages have proper spacing
- [ ] Text wraps correctly
- [ ] Emojis display properly

### Input Field
- [ ] Focus state shows blue border
- [ ] Placeholder text visible
- [ ] Can type text
- [ ] Enter key sends message
- [ ] Button click sends message

### Typing Indicator
- [ ] Shows 3 animated dots
- [ ] Appears while processing
- [ ] Disappears when response ready
- [ ] Auto-scrolls into view

### Auto-Scroll
- [ ] Chat scrolls to latest message
- [ ] Works for both user and bot messages
- [ ] Works after responses

### Mobile Responsiveness
- [ ] On small screens (< 480px):
  - [ ] Chat window spans most of width
  - [ ] Button is accessible
  - [ ] Chat is usable without scrolling page
  - [ ] Touch interactions work

---

## Performance Testing

### Load Time
- [ ] Chat widget loads instantly (< 100ms)
- [ ] No noticeable delay when opening app

### Response Time
- [ ] Bot responds within 1-2 seconds
- [ ] No lag when typing messages

### Memory Usage
- [ ] No memory leaks (test by opening/closing repeatedly)
- [ ] Chat history doesn't grow indefinitely

### Device Testing
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Tablets (iPad, Android tablets)

---

## Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus states are visible
- [ ] Text contrast is sufficient
- [ ] Messages are readable
- [ ] Works with screen readers (if supported)

---

## Data Verification

### localStorage Structure

Verify these keys exist after actions:

```javascript
// After login
localStorage.getItem('isLoggedIn')    // "true"
localStorage.getItem('role')          // "intern" or "recruiter"
localStorage.getItem('user')          // JSON: {name, email, role}

// After applying to job
localStorage.getItem('applications')  // JSON array with new app

// After posting job (recruiter)
localStorage.getItem('jobs')          // JSON array with new job
```

---

## Sample Test Data

### Add Test Applications (Browser Console)

```javascript
// Add test application
const apps = JSON.parse(localStorage.getItem('applications')) || [];
apps.push({
  id: 'app_' + Date.now(),
  jobRole: 'Frontend Developer',
  company: 'TechCorp',
  status: 'Interview',
  interviewDate: '15 April, 2:00 PM',
  appliedDate: new Date().toLocaleDateString()
});
localStorage.setItem('applications', JSON.stringify(apps));
```

### Add Test Jobs (Browser Console)

```javascript
// Add test job
const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
jobs.push({
  id: 'job_' + Date.now(),
  jobRole: 'Backend Developer',
  company: 'StartupXYZ',
  stipend: '₹60,000/month',
  description: 'Build scalable APIs'
});
localStorage.setItem('jobs', JSON.stringify(jobs));
```

---

## Chrome DevTools Checks

### Console
- No JavaScript errors
- No warnings (except 3rd party)
- Messages logged correctly

### Network
- All files load (chatbot.js, chatbot.css)
- No 404 errors
- Fast load times (< 1s)

### Storage
- localStorage shows correct keys
- Data persists across page refreshes

### Performance
- No janky animations
- Smooth scrolling
- Low CPU usage

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Chat widget not visible | Check browser console, verify CSS loaded |
| Bot not responding | Verify localStorage has data, check console |
| Messages not scrolling | Clear cache, check CSS flexbox |
| Mobile chat too small | Check viewport meta tag |
| Performance slow | Check localStorage size, clear cache |
| Typing indicator stuck | Refresh page, check JavaScript errors |

---

## Successful Test Indicators ✅

When all the following are true, chatbot is working perfectly:

1. ✅ Widget appears on all pages
2. ✅ Can open/close chat smoothly
3. ✅ Can type and send messages
4. ✅ All 6 intents respond correctly
5. ✅ Messages format properly
6. ✅ No console errors
7. ✅ Works on mobile
8. ✅ Data loads from localStorage correctly
9. ✅ Typing indicator shows
10. ✅ Messages auto-scroll

---

## Test Results Template

```markdown
## Chatbot Testing Results - [Date]

**Tester Name:** _________________
**Device:** _________________
**Browser:** _________________
**OS:** _________________

### Widget Appearance
- Open/Close: [ ] ✅ [ ] ❌
- Animations: [ ] ✅ [ ] ❌
- Positioning: [ ] ✅ [ ] ❌
- Mobile Responsive: [ ] ✅ [ ] ❌

### Functionality
- Show Applications: [ ] ✅ [ ] ❌
- Check Status: [ ] ✅ [ ] ❌
- View Interviews: [ ] ✅ [ ] ❌
- Suggest Jobs: [ ] ✅ [ ] ❌
- Count Apps: [ ] ✅ [ ] ❌
- Help Command: [ ] ✅ [ ] ❌

### Issues Found
1. _________________________________
2. _________________________________
3. _________________________________

### Overall Status: [ ] PASS [ ] FAIL
```

---

**Happy Testing! 🚀**

For questions or issues, refer to CHATBOT_README.md
