# CareerTrack - Smart Internship Tracker

A modern, professional internship tracking application built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication**: Separate login for candidates and recruiters
- **Dashboard**: Overview of application statistics and recent applications
- **Application Management**: Track, filter, and manage all your job applications
- **Job Browser**: Browse and apply to available job opportunities
- **Profile Management**: Update your personal information, skills, education, and experience
- **Dark Mode**: Full dark mode support with theme toggle
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18**: Modern React with hooks and context API
- **Vite**: Lightning-fast build tool
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **LocalStorage**: Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

### Candidate Account
- Email: `candidate@example.com`
- Password: `password123`
- Role: Candidate

### Recruiter Account
- Email: `recruiter@example.com`
- Password: `password123`
- Role: Recruiter

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx       # Dashboard page
│   │   ├── Applications.jsx    # Applications management
│   │   ├── BrowseJobs.jsx      # Job browser
│   │   ├── Login.jsx           # Login page
│   │   └── Profile.jsx         # User profile
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles and Tailwind directives
├── index-react.html             # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Features Explained

### Authentication
- Uses React Context for global state management
- Credentials stored in localStorage
- Protected routes using custom ProtectedRoute component
- Role-based access control

### Dark Mode
- Implemented using Tailwind's dark mode class strategy
- Theme preference persists in localStorage
- Toggle available in sidebar

### Data Storage
- All data stored in browser's localStorage
- Separate storage keys for users, applications, jobs, and profiles
- Easy to migrate to backend API in the future

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Components
Reusable Tailwind components are defined in `src/index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real-time notifications
- Email reminders for application follow-ups
- Resume builder
- Interview preparation resources
- Analytics and insights
- Export data to PDF/Excel

## License

This project is for educational purposes.

## Support

For issues or questions, please contact your system administrator.
