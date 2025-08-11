# Google Sign-Up Setup Guide

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add these URLs:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy your Client ID and Client Secret

## Step 2: Create Environment File

Create a file called `.env.local` in your frontend folder with:

```
AUTH_GOOGLE_ID=your_client_id_here
AUTH_GOOGLE_SECRET=your_client_secret_here
NEXT_PUBLIC_API_URL=http://localhost:5000
AUTH_SECRET=any_random_string_here
```

## Step 3: Restart Your App

Stop your Next.js app and start it again with:
```bash
npm run dev
```

## Step 4: Test Google Sign-Up

1. Go to your sign-up page
2. Click "Sign up with Google"
3. Choose your Google account
4. You'll be redirected to dashboard after success!

## How It Works (Simple Explanation)

1. User clicks "Sign up with Google" button
2. Google opens a popup asking user to sign in
3. After user signs in, Google sends user info to your app
4. Your app saves the user info and logs them in
5. User is redirected to dashboard

That's it! No complicated code needed.

