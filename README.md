# ⚡ Nikita Vaishnav — Personal Developer Portfolio

A modern, high-performance, production-ready developer portfolio website built with **Python (FastAPI)**, **Jinja2 templating**, and a bespoke **modern CSS3 & Vanilla JavaScript** frontend.

![Portfolio Preview Banner](static/assets/nikita-portrait.png)

---

## 🌟 Key Features

- **Production-Ready FastAPI Backend:** High-speed async request handling, automated OpenAPI documentation (`/docs`), Pydantic request validation, and health check monitoring (`/healthz`).
- **Separation of Content & UI:** All personal data, skills, work experience, projects, education, and credentials reside in [`data/portfolio_data.json`](data/portfolio_data.json). Update your resume without ever touching HTML or CSS!
- **Dark / Light Theme Toggle:** Clean theme switcher with instant CSS variable updates and persistence in `localStorage`.
- **Modern Glassmorphic Design System:** Custom styling with ambient mesh glowing orbs, fluid typography pairing (`Plus Jakarta Sans` + `Inter` + `JetBrains Mono`), and subtle micro-interactions.
- **Dynamic Role Typer & Scroll Progress:** Live typewriter animation cycling through core professional titles and top-bar scroll progress indicator.
- **Interactive Skill Matrix & Category Tabs:** Categorized skills (Frontend, Backend, Databases, Tools, Concepts) with filter tabs and animated proficiency meters.
- **Filterable Projects Showcase & Quick-View Modal:** Filter projects by category (*Full Stack, Real-time, AI/ML, Dashboards*) and click "Architecture & Info" for an interactive deep-dive modal.
- **Interactive Contact Form with REST API:** Async AJAX form submission to `/api/contact` with validation, loading states, and animated toast feedback notifications.
- **100% Mobile & Tablet Responsive:** Optimized breakpoints with accessible drawer navigation.
- **Deployment Ready:** Includes `Procfile`, `render.yaml`, `Dockerfile`, and `requirements.txt` for 1-click deployment on Render, Railway, Fly.io, or Heroku.

---

## 📂 Project Structure

```
portfolio/
├── app.py                      # FastAPI application & REST endpoints
├── requirements.txt            # Python dependencies (FastAPI, Uvicorn, Jinja2, Pydantic)
├── Procfile                    # Render / Heroku deployment entrypoint
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
├── Dockerfile                  # Containerized deployment config
├── .dockerignore               # Docker build exclusions
├── data/
│   └── portfolio_data.json     # Single source of truth (skills, projects, bio, experience)
├── templates/
│   ├── base.html               # Base layout with SEO, navigation, modals, toasts, footer
│   ├── index.html              # Main page template
│   └── partials/
│       ├── hero.html           # Hero section & dynamic code badge
│       ├── about.html          # Bio, strengths checklist & stats counter
│       ├── skills.html         # Interactive skill categories & progress bars
│       ├── experience.html     # Work timeline for Appzmine Tech
│       ├── projects.html       # Showcase cards & filter tabs
│       ├── education.html      # MCA / BCA degrees & cloud certifications
│       └── contact.html        # Contact form & direct communication cards
├── static/
│   ├── css/
│   │   └── style.css           # Modern design system (tokens, dark/light, glassmorphism)
│   ├── js/
│   │   └── main.js             # Client interactivity (theme, filters, modal, AJAX, toasts)
│   └── assets/
│       ├── nikita-portrait.png # Developer portrait
│       └── Nikita_Vaishnav_Resume.pdf # Downloadable resume document
└── README.md                   # Documentation & deployment guide
```

---

## 🚀 Quickstart: Local Development

### 1. Clone & Navigate to the Project

```bash
cd portfolio
```

### 2. Create and Activate a Python Virtual Environment

```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Development Server

```bash
uvicorn app:app --reload --port 8000
```

Open your browser and visit:
- **Portfolio Website:** [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **JSON Data Endpoint:** [http://localhost:8000/api/data](http://localhost:8000/api/data)
- **Health Check:** [http://localhost:8000/healthz](http://localhost:8000/healthz)

---

## 🚢 Deployment Guides

### Option 1: Deploy on Render (Recommended)

Render offers native Python support with free SSL and automatic deployments from GitHub.

1. Push your repository to **GitHub**.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Render will auto-detect the configuration, or enter:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**!

*(Alternatively, use the included [`render.yaml`](render.yaml) for 1-click Blueprint deployment).*

---

### Option 2: Deploy on Railway

1. Install the Railway CLI or connect via [Railway Dashboard](https://railway.app/).
2. Create a **New Project** → **Deploy from GitHub repo**.
3. Railway automatically detects the [`Procfile`](Procfile) and [`requirements.txt`](requirements.txt).
4. Add environment variable `PORT=8000` (optional).
5. Generate a public domain under **Settings** → **Networking**.

---

### Option 3: Deploy with Docker

Build and run anywhere with Docker:

```bash
# Build the Docker image
docker build -t nikita-portfolio .

# Run the container on port 8000
docker run -d -p 8000:8000 --name portfolio-app nikita-portfolio
```

---

## ✏️ How to Update Content

You do not need to modify any HTML files to update your experience, projects, or skills!

Simply edit [`data/portfolio_data.json`](data/portfolio_data.json):

- **Update Personal Bio & Tagline:** Edit the `"personal"` object.
- **Add or Edit Projects:** Add objects to the `"projects"` array. Include `"category"`, `"metrics"`, `"tech_stack"`, and links.
- **Add Skills:** Add entries under `"skills" -> "categories"`.
- **Add Experience / Certifications:** Update `"experience"`, `"education"`, or `"certifications"`.
- **Replace Resume PDF:** Overwrite [`static/assets/Nikita_Vaishnav_Resume.pdf`](static/assets/Nikita_Vaishnav_Resume.pdf).

---

## 📬 Contact API Endpoint

The site includes a built-in contact form handler at `POST /api/contact`:

```json
// Request Body
{
  "name": "Recruiter / Client",
  "email": "recruiter@company.com",
  "subject": "Full-time Role Opportunity",
  "message": "Hi Nikita, we love your work and would like to schedule an interview."
}
```

To wire this up to actual email dispatch (e.g. Resend, SendGrid, or SMTP), simply update the `submit_contact_form` function in [`app.py`](app.py).

---

## 📄 License & Credits

- **Author:** Nikita Vaishnav
- **Email:** [nikitavaishnav1703@gmail.com](mailto:nikitavaishnav1703@gmail.com)
- **LinkedIn:** [nikita-vaishnav-91586a344](https://www.linkedin.com/in/nikita-vaishnav-91586a344/)
- **GitHub:** [@NikitVaishnav](https://github.com/NikitVaishnav)
