# Equanix Website

This is the Equanix website project, built with React and modern UI components.
 
Quick start (one command)
-------------------------
After cloning the repository, run the following from the project root to install dependencies and start both frontend and backend in development:

```bash
npm install
npm start
```

What this does:
- `npm install` will install root dependencies and run a `postinstall` step that installs backend dependencies.
- `npm start` runs a single command which starts both the backend (nodemon) and the CRA frontend concurrently.

Environment files
-----------------
- Add server secrets to `backend/.env` (this file is ignored by git). Example fields you will typically set:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/equanix_trading
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIENT_URL=http://localhost:3000
```

- For frontend Supabase integration, add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` to a `.env.local` in the repo root.

Security note: never commit service role keys or other secrets to GitHub. The repository's `.gitignore` already ignores `backend/.env` and other env files.
## Development

To get started with development, follow these steps:
 - Start the backend: `cd backend && npm install && npm run dev`
 - Start the frontend: `npm install && npm start`

## Enabling device-persistent email/password authentication (recommended: Supabase)

The app includes multiple auth options. The easiest, most reliable way to allow users to sign in with email/password from any device is to use Supabase Auth (hosted). The frontend already contains Supabase integration and will prefer Supabase when the environment variables below are set.

1. Create a free Supabase project at https://app.supabase.com
2. In your Supabase project settings, copy the Project URL and the anon/public API key.
3. In your frontend project, create a `.env.local` file with:

```
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_API_URL=http://localhost:5001/api   # optional: keeps existing backend API
```

4. Start the frontend (`npm start`). The Auth UI in the app will now use Supabase for sign-up, sign-in, and sign-out. Sessions persisted by Supabase will work across devices and browsers.

Notes and fallbacks:
- If Supabase env vars are not set, the app falls back to the backend API (`/api/auth`) and, if that isn't available, to a local in-browser store (for demos).
- The backend also supports MongoDB + JWT (see `backend/`); if you prefer keeping auth on your own server, configure `MONGODB_URI` and the JWT env vars and switch routes in `backend/server.js` from the mock auth to the real auth router.
- Supabase handles email verification, password resets, and secure session management for you, which reduces implementation and maintenance burden.

Testing across devices:
- Sign up with an email and password in one browser/device. Supabase will persist the session.
- Close the browser, open the same site on another device, and the user can sign in there with the same credentials. If you've enabled email confirmations in Supabase, ensure the user confirms their email if required by your Supabase settings.

If you'd like, I can also wire the backend to validate Supabase JWTs on protected routes or fully migrate auth to Supabase on the backend — tell me which you'd prefer and I will implement it.
# EquanixWebsite

This is the Equanix website project, built with React and modern UI components.

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
