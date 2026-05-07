# Netlify CMS Setup Guide
## Restore & Refinish Furniture Repair

This guide walks you through enabling the portfolio admin panel so your client
can add before & after photos without touching any code.

---

## What your client will be able to do

Once set up, your client visits:

  **https://yoursite.netlify.app/admin**

They log in with their email and password, then see a simple dashboard:

  - Click **"New Portfolio Item"**
  - Type the project title (e.g. "Oak Dining Table")
  - Type a short description (e.g. "Water ring removal · Full refinish")
  - Upload the **Before** photo
  - Upload the **After** photo
  - Choose whether it shows as a wide card
  - Set the display order
  - Click **Publish**

The site rebuilds automatically in ~60 seconds and the new card appears live.

---

## One-Time Setup Steps (you do this, not the client)

### Step 1 — Deploy to Netlify (not GitHub Pages)

Netlify CMS requires Netlify hosting (not GitHub Pages) because it uses
Netlify Identity for login. If you've been using GitHub Pages, switch now:

  1. Go to https://app.netlify.com
  2. Click "Add new site" → "Import an existing project"
  3. Connect your GitHub account and choose the FurnitureRepair repo
  4. Build settings will auto-detect from netlify.toml:
       - Build command: npm run build
       - Publish directory: dist
  5. Click "Deploy site"

### Step 2 — Enable Netlify Identity

  1. In your Netlify dashboard, go to:
       Site Settings → Identity → Enable Identity Service
  2. Under **Registration preferences**, select **"Invite only"**
     (This means only people you invite can log in — no strangers)
  3. Scroll down to **Git Gateway** and click **"Enable Git Gateway"**
     (This is what lets the CMS save files back to GitHub)

### Step 3 — Invite your client

  1. Still in Identity, click **"Invite users"**
  2. Enter your client's email address
  3. They'll receive an email — they click the link, set a password, done.

### Step 4 — Add the Netlify Identity widget to the main site (optional)

If you want the invite link to work smoothly, add this script tag to the
main `index.html` just before the closing </head> tag:

  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

  And this snippet before the closing </body> tag:

  <script>
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
  </script>

---

## How to add a new portfolio item (for you or the client)

### Via the Admin Panel (recommended for client)

  1. Go to https://yoursite.netlify.app/admin
  2. Log in
  3. Click "Portfolio" in the left sidebar
  4. Click "New Portfolio Item"
  5. Fill in the fields and upload photos
  6. Click "Publish" — site rebuilds in ~60 seconds

### Via code (for you as the developer)

  1. Add a new JSON file to /public/portfolio/your-item-name.json:

     {
       "label": "Oak Rocking Chair",
       "detail": "Broken spindle replaced · Full refinish",
       "before": "/uploads/oak-chair-before.jpg",
       "after": "/uploads/oak-chair-after.jpg",
       "wide": false,
       "order": 5
     }

  2. Add the filename (without .json) to the PORTFOLIO_FILES array
     in src/App.jsx:

     const PORTFOLIO_FILES = [
       "victorian-parlour-chair",
       "mid-century-credenza",
       "farmhouse-dining-table",
       "antique-secretary-desk",
       "oak-rocking-chair",   // ← add here
     ];

  3. Push to GitHub — site redeploys automatically.

---

## File Structure Overview

  public/
  ├── admin/
  │   ├── index.html        ← The CMS admin app
  │   └── config.yml        ← Defines the portfolio form fields
  ├── portfolio/
  │   ├── victorian-parlour-chair.json
  │   ├── mid-century-credenza.json
  │   ├── farmhouse-dining-table.json
  │   └── antique-secretary-desk.json
  └── uploads/              ← Where CMS-uploaded photos are stored
      └── (images go here automatically when uploaded via admin)

---

## Troubleshooting

**"Not authorized" on /admin**
→ Make sure you completed Step 2 (Enable Identity) and Step 3 (Invite user)

**Photos not showing after publish**
→ Wait 60–90 seconds for the Netlify build to finish, then hard refresh (Cmd+Shift+R)

**New portfolio item not appearing on site**
→ Check that the filename was added to PORTFOLIO_FILES in App.jsx (developer-added items only)
→ For CMS-added items: the site auto-fetches all files — no code change needed
   (Note: auto-discovery requires a small additional API endpoint — see note below)

---

## Note on auto-discovery vs PORTFOLIO_FILES

Currently the app loads only the files listed in the PORTFOLIO_FILES array.
This means a developer needs to add the filename once when adding via code.

Items added via the CMS admin panel create new JSON files automatically,
but the frontend needs to know the filename to fetch it.

**Two ways to handle this:**

Option A (Current — simple): The client tells you when they add something,
you add the filename to PORTFOLIO_FILES and push. Takes 2 minutes.

Option B (Fully automatic): Add a Netlify Function that reads the /portfolio/
directory and returns all filenames as an API response. The frontend calls
that instead of PORTFOLIO_FILES. Ask your developer to set this up if
the client will be adding photos frequently without your involvement.
