# 🛰️ AirMetrics - Air Quality App

**AirMetrics** is an interactive application for **real-time air quality monitoring**, using satellite and sensor data with a focus on **public health, environmental awareness, and scientific education**.  
The app transforms complex environmental data into **accessible, gamified, and useful insights** for users around the world.

---

## 🚀 Features

### ✅ Core Features
- **Real-Time Monitoring**: View the Air Quality Index (AQI) with simulated data  
- **Interactive Map**: Map with air quality markers and dispersion circles  
- **Forecasts**: 7-day and 24-hour forecasts with meteorological data  
- **Community**: Post sharing, achievements, and gamification system  
- **User Profile**: User stats, settings, and achievements  

### 🎨 Interface & UX
- **Navigation**: Bottom tabs with React Navigation  
- **Design System**: Consistent color palette, typography, and components  
- **Reusable Components**: AQICard, AlertBanner, QuickActionCard, etc.  
- **Responsive Layout**: Works seamlessly on all screen sizes  

### 🌐 Services & Integrations
- **Geolocation**: Integrated with `expo-location`  
- **Push Notifications**: Using `expo-notifications`  
- **Services**: `AirQualityService` and `NotificationService`  
- **Theme System**: Standardized color and typography management  

---

## 📱 Screens

1. **Home Screen** – Dashboard with AQI, recommendations, and quick actions  
2. **Map Screen** – Interactive map displaying air quality data  
3. **Forecast Screen** – 7-day and 24-hour air quality forecasts  
4. **Community Screen** – Community posts and achievements  
5. **Profile Screen** – User profile, stats, and settings  

---

## 🛠️ Tech Stack

### Frontend Mobile
- ⚛️ **React Native** + **Expo**  
- 🧩 **TypeScript**  
- 🧭 **React Navigation** (Stack + Bottom Tabs)  
- 🗺️ **React Native Maps**  
- 🌈 **Expo Linear Gradient**  
- 🧠 **Expo Vector Icons**

### Services
- 📍 **Expo Location** – Geolocation  
- 🔔 **Expo Notifications** – Push alerts  
- ⚙️ **Expo Constants** – Configuration  

### Architecture
- **Reusable Components** → `src/components/`  
- **Services** → `src/services/`  
- **Theme System** → `src/theme/`  
- **Navigation** → `src/navigation/`  
- **Screens** → `src/screens/`  

---

## 🏗️ Project Structure

```bash
src/
├── components/           # Reusable UI components
│   ├── AQICard.tsx
│   ├── AlertBanner.tsx
│   ├── DataGrid.tsx
│   ├── QuickActionCard.tsx
│   └── RecommendationsCard.tsx
├── navigation/           # Navigation setup
│   └── AppNavigator.tsx
├── screens/              # Application screens
│   ├── HomeScreen.tsx
│   ├── MapScreen.tsx
│   ├── ForecastScreen.tsx
│   ├── CommunityScreen.tsx
│   └── ProfileScreen.tsx
├── services/             # Services and APIs
│   ├── AirQualityService.ts
│   └── NotificationService.ts
└── theme/                # Design system
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    └── index.ts

## 🤖 AI Integration – Google Gemini AI

AirMetrics integrates **Google Gemini AI** to deliver:

- **Intelligent Responses** to community questions about air quality  
- **Contextual Data Analysis** using environmental and health datasets  
- **Sentiment Detection** and **Auto-Tagging** to improve discussion quality  
- **AI-Driven Insights** to summarize research and explain scientific data clearly  
- **Localized Answers** with relevant information for each region  

This AI service helps automate research summarization, enhances data analysis, and makes scientific insights **more accessible, accurate, and actionable** for all users.

### 🧩 Code Reference

// AirMetrics AI Integration Service
// Provides intelligent answers, data analysis, and contextual insights for community questions
// using Google Gemini AI. Includes natural language understanding, sentiment detection, and
// auto-tagging to enhance environmental discussions and improve user engagement.
