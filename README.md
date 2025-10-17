# Lunexa AI

A web-based AI platform that helps e-commerce sellers automatically generate personalized product descriptions, titles, SEO tags, and hashtags.

## Features

- User authentication with Firebase
- Onboarding questionnaire to gather business info
- AI-powered content generation using Openrouter API
- Save and manage generated outputs
- Responsive UI with styled components

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase project and add config to `.env`
4. Get Openrouter API key and add to `.env`
5. Run the app: `npm start`

## Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_OPENROUTER_API_KEY=your_api_key
```

## Deployment

Build the app: `npm run build`

Deploy to Netlify or your preferred hosting service.
