# 🎨 Policy Recommendation Frontend

Modern React frontend for the AI-driven policy recommendation system.

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 Features

- ✅ **User Profile Form**: Enter age, income, and needs
- ✅ **Scroll Feed**: Personalized policy recommendations (Netflix-style)
- ✅ **Policy Cards**: Beautiful cards with match scores
- ✅ **Policy Details**: Click to see full details, agents, and apply links
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Modern UI**: Clean, professional design

## 📡 API Integration

The frontend connects to the backend at `http://localhost:3000/recommend`

Make sure the backend is running:
```bash
cd ..
npm start
```

## 🎨 Demo Flow

1. **Enter Profile**: Fill in age, income, and needs
2. **Get Recommendations**: Click "Get Recommendations"
3. **Scroll Feed**: View top 3 personalized policies
4. **Click Policy**: See full details, nearby agents, apply link
5. **Apply**: Direct link to policy application

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with branding
│   │   ├── UserProfileForm.jsx  # User input form
│   │   ├── PolicyFeed.jsx       # Scroll feed container
│   │   └── PolicyCard.jsx       # Individual policy card
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Styles
│   └── main.jsx                 # Entry point
└── vite.config.js              # Vite configuration
```

## 🎯 Key Differentiator

> "Instead of search, we use a personalized recommendation feed, similar to Netflix."

---

Built for hackathon with ❤️
