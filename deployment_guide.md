# Deployment Guide: Cognoid AI Chatbot

Now that both your frontend and backend are working perfectly on your local machine, it is time to deploy them to the cloud so they are active 24/7 and can be embedded on any live website!

We will use the two industry-standard platforms for this stack:
1. **Backend (FastAPI):** Hosted on **Render.com** (An excellent cloud host with a free tier for Python web services).
2. **Frontend (React/Vite):** Hosted on **Vercel.com** (The absolute gold standard for hosting React interfaces).

---

## The "Chicken-and-Egg" CORS Problem
Before deploying, understand that:
- Your **React Frontend** needs to know the **Backend's deployed URL** (to send chat messages to).
- Your **FastAPI Backend** needs to know the **Frontend's deployed URL** (to allow it in the `CORS` security settings).

To solve this, we do a simple **3-step dance**:
1. **Deploy the Backend first** on Render (using a temporary `*` wildcard for CORS).
2. **Deploy the Frontend next** on Vercel (connecting it to the new Render URL).
3. **Update the Backend** on Render (replacing the `*` with your official Vercel URL to close the security loop).

Let's walk through it step-by-step!

---

## Step 1: Deploy the FastAPI Backend to Render

[Render.com](https://render.com/) connects directly to your GitHub and redeploys your backend automatically every time you push code!

### A. Push Code to GitHub
Ensure all your files (including the backend folder) are committed and pushed to a GitHub repository. 
> [!NOTE]
> I have created a correctly spelled [requirements.txt](file:///c:/Users/Krishna/Desktop/Cognoid%20Soln/backend/requirements.txt) inside your backend folder. Render looks for this exact name to install your Python libraries!

### B. Configure Render Service
1. Log in to [Render.com](https://render.com/) (you can sign up for free using your GitHub account).
2. On the dashboard, click the blue **New** button and select **Web Service**.
3. Select your GitHub repository from the list.
4. Set the following configuration settings:
    - **Name:** `cognoid-chatbot-backend`
    - **Environment:** `Python`
    - **Root Directory:** `backend` *(This tells Render to look inside the backend folder rather than the root directory)*
    - **Build Command:** `pip install -r requirements.txt`
    - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
    - **Instance Type:** `Free`

### C. Add Environment Variables
Scroll down and click **Advanced**, then click **Add Environment Variable**. Add your backend variables (do not upload your `.env` file to GitHub—configure them here instead):

| Key | Value | Notes |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `[your_actual_groq_api_key]` | Your private Groq credential |
| `WHATSAPP_NUMBER` | `[your_whatsapp_phone_number]` | International format without `+` (e.g. `919962373399`) |
| `FRONTEND_URL` | `*` | *Temporary CORS wildcard to allow initial connection testing* |

### D. Deploy!
Click **Create Web Service**. Render will spend 2–3 minutes downloading Python, installing your requirements, and booting up the server.

Once complete, Render will display a green **"Live"** badge and give you a public URL at the top left, which will look like this:
`https://cognoid-chatbot-backend.onrender.com`

*Verify your server is alive by going to `https://cognoid-chatbot-backend.onrender.com/api/health` in your browser!*

---

## Step 2: Deploy the React Frontend to Vercel

Vercel compiles your React JSX, compresses your assets, and deploys your frontend onto a global, ultra-fast CDN network in seconds.

### Method 1: The Vercel Dashboard (easiest)
1. Sign up/log in to [Vercel.com](https://vercel.com/) (using your GitHub account).
2. Click **Add New > Project**.
3. Select your GitHub repository.
4. Configure the Project settings:
    - **Framework Preset:** `Vite`
    - **Root Directory:** `frontend` *(This tells Vercel to compile only the frontend folder)*
5. Click **Deploy**. Vercel will compile your code and give you a public URL like:
   `https://cognoid-chatbot.vercel.app`

### Method 2: The Vercel CLI (fastest from terminal)
If you prefer deploying directly from your computer terminal:
1. Open a terminal and install the Vercel CLI:
   ```powershell
   npm install -g vercel
   ```
2. Navigate to your `frontend` folder:
   ```powershell
   cd frontend
   ```
3. Run the deployment command:
   ```powershell
   vercel
   ```
4. Log in when prompted.
5. Vercel will ask a few setup questions:
    - *Set up and deploy?* `yes`
    - *Which scope?* `[your account]`
    - *Link to existing project?* `no`
    - *What name?* `cognoid-chatbot`
    - *In which directory?* `./`
    - *Want to modify settings?* `no`
6. Once complete, run `vercel --prod` to push it live to production. Vercel will give you your active link!

---

## Step 3: Wire the Connections Together

Now that both sites are live, we must link them together.

### A. Point Frontend to Deployed Backend
Open [useChat.js](file:///c:/Users/Krishna/Desktop/Cognoid%20Soln/frontend/src/hooks/useChat.js#L35) in your code and change the fetch URL from localhost to your new Render link:

```diff
-const response = await fetch("http://localhost:8000/api/chat", {
+const response = await fetch("https://cognoid-chatbot-backend.onrender.com/api/chat", {
```

Commit this change and push it to GitHub (or run `vercel --prod` again). Vercel will automatically recompile and push your update live!

### B. Close Backend CORS Security Loop
1. Go back to your [Render.com Dashboard](https://dashboard.render.com/).
2. Select your `cognoid-chatbot-backend` service.
3. Click on the **Environment** tab.
4. Find the `FRONTEND_URL` variable.
5. Change its value from the temporary `*` wildcard to your official Vercel URL:
   `https://cognoid-chatbot.vercel.app`
6. Click **Save Changes**. Render will automatically restart your server with this new security lock active.

---

## Step 4: Embed the Chatbot on Cognoid's Website

Now your chatbot system is live in the cloud! To embed it on the main Cognoid website:

1. Open [embed-snippet.js](file:///c:/Users/Krishna/Desktop/Cognoid%20Soln/embed-snippet.js#L14) in your root directory.
2. Update the `WIDGET_URL` variable to point to your new deployed Vercel URL:
   ```javascript
   const WIDGET_URL = "https://cognoid-chatbot.vercel.app";
   ```
3. Host this `embed-snippet.js` script (you can place it inside Vercel's `public` folder, or host it anywhere).
4. Give Cognoid this single line of code to insert right before their website's closing `</body>` tag:
   ```html
   <script src="https://cognoid-chatbot.vercel.app/embed-snippet.js" defer></script>
   ```

That is it! Their website will now load your gorgeous, responsive, floating chatbot, fully protected by Shadow DOM styling, communicating live with Groq AI and your FastAPI server running 24/7!
