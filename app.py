import json
import logging
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr, Field

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("portfolio")

# Base directory
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "portfolio_data.json"

app = FastAPI(
    title="Nikita Vaishnav — Portfolio",
    description="Production-ready developer portfolio for Nikita Vaishnav, Full Stack & React Developer",
    version="1.0.0",
)

# Mount static files
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# Templates
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


def load_portfolio_data() -> dict:
    """Load portfolio data from JSON file with error handling."""
    if not DATA_FILE.exists():
        logger.error(f"Data file not found at {DATA_FILE}")
        return {}
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading portfolio data: {e}")
        return {}


class ContactFormSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=5, max_length=2000)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Main portfolio landing page."""
    data = load_portfolio_data()
    context = {
        "request": request,
        "data": data,
        "personal": data.get("personal", {}),
        "stats": data.get("stats", []),
        "experience": data.get("experience", []),
        "projects": data.get("projects", []),
        "skills": data.get("skills", {}),
        "education": data.get("education", []),
        "certifications": data.get("certifications", []),
        "currently_learning": data.get("currently_learning", []),
        "social_links": data.get("social_links", []),
    }
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context=context
    )


@app.get("/api/data", response_class=JSONResponse)
async def get_portfolio_data():
    """API endpoint returning structured portfolio data."""
    data = load_portfolio_data()
    if not data:
        raise HTTPException(status_code=500, detail="Portfolio data could not be loaded.")
    return data


@app.post("/api/contact", response_class=JSONResponse)
async def submit_contact_form(contact: ContactFormSchema):
    """
    Handle contact form submissions.
    Logs submission and returns success status. Can be wired to SMTP or EmailJS.
    """
    logger.info(
        f"New Contact Message received from {contact.name} <{contact.email}> | "
        f"Subject: {contact.subject or 'No subject'} | "
        f"Message length: {len(contact.message)} chars"
    )
    return {
        "success": True,
        "message": f"Thank you, {contact.name}! Your message has been received. Nikita will get back to you soon.",
        "data": {
            "name": contact.name,
            "email": contact.email,
            "subject": contact.subject
        }
    }


@app.get("/healthz", response_class=JSONResponse)
async def health_check():
    """Health check endpoint for Render/Railway/Fly.io monitoring."""
    return {
        "status": "healthy",
        "service": "Nikita Vaishnav Portfolio",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
