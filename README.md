# 🎓 Reva Race Hub - Placement Portal

Reva Race Hub is a premium placement and student talent showcase portal designed for REVA University (RACE) postgraduate programs, specifically highlighting specializations in **Artificial Intelligence** and **Cybersecurity**.

The application features student profiles, parsed resume databases, administrative dashboard management, and interactive candidate filtering.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (React 19 + Vite + Vinxi Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Database**: [SQLite (better-sqlite3)](https://github.com/WiseLibs/better-sqlite3) with fallback to JSON storage for serverless environments.
- **Serverless / Hosting**: Cloudflare Workers / Pages compatible ([Wrangler](https://developers.cloudflare.com/workers/wrangler/))

---

## 🌟 Key Features

1. **Talent Directory**: Fully searchable and filterable directory of postgraduate candidates across AI and Cybersecurity specializations.
2. **Student Profile Pages**: Dedicated profile routes (`/profile/$slug`) showcasing student biographies, academic histories, technical skills, custom certifications, monocular perception projects, and research publications.
3. **Admin Management Panel**:
   - Direct database access to create, update, or remove candidate profiles.
   - Built-in PDF resume parsing that automatically populates email, phone, location, name, and specialization using a structured heuristics assistant.
   - Photo and logo uploading with path configuration.
4. **Hiring Partner Integration**: Track, categorize, and showcase enterprise recruiting relationships (e.g. MS Azure, AWS, EC-Council).
5. **Interactive Statistics**: Placement salary packages and internship stipend tracking charts.

---

## 📂 Project Structure

```text
├── data/                      # Local SQLite database (students.db) and fallback configurations
├── public/                    # Static assets (images, logos, favicon)
│   ├── image/                 # Team member and candidate portrait photos
│   └── uploads/               # User upload directories for resumes and logos (Git ignored)
├── src/                       # Main source directory
│   ├── components/            # Shared UI components (Radix, Shadcn)
│   ├── data/                  # Initial static seed datasets
│   ├── hooks/                 # Reusable React hooks
│   ├── routes/                # File-system router paths (tanstack-router routes)
│   ├── server/                # SQLite initialization and fallback adapters
│   ├── actions.ts             # Server-side business actions (Auth, Upload, CRUD, Parsing)
│   └── server.ts              # Custom SSR server error wrapper
├── wrangler.jsonc             # Cloudflare Pages/Worker runtime bindings
├── vite.config.ts             # Vite bundler options
└── package.json               # Package manifests and scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/) installed.

### 2. Installation
Install the project dependencies using your package manager:
```bash
# Using Bun (preferred)
bun install

# Or using npm
npm install
```

### 3. Environment Variables Setup
Copy the example environment file template:
```bash
cp .env.example .env
```
Open `.env` and fill in the secure credentials:
```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_random_session_secret
```

### 4. Run Development Server
Start the local server with hot module replacement:
```bash
# Using Bun
bun run dev

# Using npm
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🚀 Deployment

The project builds compile assets into serverless-ready target directories.

### Build Compilation
To build the application client and server chunks:
```bash
npm run build
```

### Cloudflare Pages / Workers
This project is configured with `@cloudflare/vite-plugin`.
- The compilation will output target bundles under the `.wrangler` and `dist` folders.
- You can deploy directly to Cloudflare Pages using:
  ```bash
  npx wrangler pages deploy dist/client
  ```
- Make sure to configure the Environment Variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`) in your hosting provider's dashboard settings.
