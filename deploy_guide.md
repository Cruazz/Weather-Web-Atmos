# Atmos Deployment & Security Guide

This guide describes how to securely deploy the Atmos application for free using Vercel.

## 1. Security Checklist
Before pushing to production, ensure that your secret keys are protected:
- Your `.env` file is excluded from git tracking via the `.gitignore` file.
- Any real OpenWeatherMap API keys are not committed to source control.

## 2. Deploying to Vercel (Free & Recommended)
Vercel is the ideal host for Vite + React applications.

### Option A: Using the Vercel GitHub Integration (Recommended)
1. Commit your project locally using git (do not commit your `.env` file):
   ```bash
   git init
   git add .
   git commit -m "Initialize Atmos"
   ```
2. Create a new repository on [GitHub](https://github.com).
3. Connect your local git repository to GitHub and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/atmos.git
   git branch -M main
   git push -u origin main
   ```
4. Log into [Vercel](https://vercel.com).
5. Click **Add New** → **Project**.
6. Import your newly created GitHub repository.
7. In the **Environment Variables** section:
   - Add `VITE_WEATHER_API_KEY` as the key.
   - Insert your real OpenWeatherMap API key as the value.
8. Click **Deploy**. Vercel will automatically build and configure your application with the provided environment variables.

### Option B: Using the Vercel CLI
1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. Log into your Vercel account:
   ```bash
   vercel login
   ```
3. Initialize the deployment from the project directory:
   ```bash
   vercel
   ```
4. Follow the setup prompts. When asked about configuring environment variables, use the Vercel dashboard or CLI to bind your `VITE_WEATHER_API_KEY`.
