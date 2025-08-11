# Backend Setup Guide

## Step 1: Environment Variables

Create a `.env` file in your backend folder with:

```
MONGO_URI=mongodb://localhost:27017/your_database_name
PORT=5000
JWT_SECRET=your_random_jwt_secret_here
```

## Step 2: Install Dependencies

Make sure you have all packages installed:

```bash
cd backend
npm install
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system.

## Step 4: Start Backend Server

```bash
npm run dev
```

Your backend should now be running on port 5000!

## Step 5: Test the API

You can test if your backend is working by visiting:
`http://localhost:5000/`

You should see: "Welcome to the CRM backend API server is running at port 3000"

## What I Added:

1. **Google Sign-In Route** (`routes/google-sign-in.js`)
   - Handles Google authentication requests
   - Creates new users automatically
   - Generates JWT tokens

2. **Updated User Model**
   - Made password field optional for Google users

3. **Updated Server**
   - Added the Google sign-in route

## How It Works:

1. User clicks "Sign up with Google" on frontend
2. Google authenticates the user
3. Frontend sends user info to backend `/google-sign-in` endpoint
4. Backend creates/finds user and returns JWT token
5. User is logged in and redirected to dashboard

Now your Google sign-up should work! 🎉

