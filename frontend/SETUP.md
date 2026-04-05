# Quick Setup Guide

## What Was Changed

Your internship tracker has been successfully migrated to **React + Vite + Tailwind CSS** while maintaining all existing functionality!

### New Tech Stack
- ✅ React 18 with hooks and modern patterns
- ✅ Vite for lightning-fast development
- ✅ Tailwind CSS for professional styling
- ✅ React Router for navigation
- ✅ Context API for state management
- ✅ Full dark mode support

### Files Backed Up
- `index-vanilla.html` - Your original Tailwind HTML version (backup)

### New React Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Sidebar + navigation
│   ├── contexts/
│   │   └── AuthContext.jsx     # Auth state management
│   ├── pages/
│   │   ├── Dashboard.jsx       # Stats & recent applications
│   │   ├── Applications.jsx    # Full applications list with filters
│   │   ├── BrowseJobs.jsx      # Job browsing & applying
│   │   ├── Login.jsx           # Login page
│   │   └── Profile.jsx         # User profile management
│   ├── utils/
│   │   └── initData.js         # Sample data initialization
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
├── index.html                  # React HTML template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## How to Run

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 3: Login
Use these demo credentials:

**Candidate Account:**
- Email: `candidate@example.com`
- Password: `password123`

**Recruiter Account:**
- Email: `recruiter@example.com`
- Password: `password123`

## What's Included

### Pre-loaded Sample Data
The app comes with:
- ✅ 2 demo user accounts (candidate + recruiter)
- ✅ 6 sample job postings
- ✅ 4 sample applications for the candidate
- ✅ Complete candidate profile with skills & experience

### Features
- ✅ **Dashboard**: View stats (total applications, interviews, offers, rejected)
- ✅ **Applications**: Search, filter, view details, delete applications
- ✅ **Browse Jobs**: Search jobs, filter by location, apply with resume upload
- ✅ **Profile**: Edit personal info, add skills, update bio/education/experience
- ✅ **Dark Mode**: Toggle between light and dark themes
- ✅ **Responsive**: Works on all screen sizes

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    // ... other shades
  }
}
```

### Reset Sample Data
In browser console:
```javascript
localStorage.clear();
location.reload();
```

## Key Improvements Over Vanilla HTML

1. **Component-Based**: Reusable React components
2. **Better State Management**: React Context API
3. **Client-Side Routing**: No page reloads
4. **Better Performance**: Virtual DOM updates
5. **Easier Maintenance**: Modular code structure
6. **Type Safety Ready**: Easy to add TypeScript later
7. **Better Developer Experience**: Hot reload, better debugging

## Everything Still Works

All your existing features are preserved:
- ✅ User authentication (candidate/recruiter roles)
- ✅ Application tracking & management
- ✅ Job browsing & applying
- ✅ Profile management
- ✅ Dark mode
- ✅ LocalStorage persistence

The UI is now more polished and professional - perfect for impressing faculty! 🎓

## Need Help?

Check the main `README.md` for detailed documentation.
