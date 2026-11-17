import asyncio
import logging
import os
import secrets
import smtplib
import ssl
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, Header, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("thinkfast")

# --- Configuración -----------------------------------------------------------

# MongoDB (opcional): si no se configura, los mensajes solo se envían por email.
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "thinkfast")

# Email de aviso (opcional, pero recomendado).
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_SECURITY = os.environ.get("SMTP_SECURITY", "starttls").lower()  # starttls | ssl | none
NOTIFY_EMAIL = os.environ.get("NOTIFY_EMAIL")
MAIL_FROM = os.environ.get("MAIL_FROM") or SMTP_USER

# Token para leer los mensajes guardados. Sin token, el endpoint queda deshabilitado.
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")

CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",") if o.strip()]

EMAIL_ENABLED = bool(SMTP_HOST and NOTIFY_EMAIL and MAIL_FROM)

client: Optional[AsyncIOMotorClient] = AsyncIOMotorClient(MONGO_URL) if MONGO_URL else None
db = client[DB_NAME] if client else None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    if db is None:
        logger.warning("MONGO_URL no configurado: los mensajes no se guardan en base de datos.")
    if not EMAIL_ENABLED:
        logger.warning("SMTP/NOTIFY_EMAIL no configurado: no se enviarán avisos por email.")
    if db is None and not EMAIL_ENABLED:
        logger.error("Ni MongoDB ni email configurados: el formulario de contacto no funcionará.")
    yield
    if client:
        client.close()


app = FastAPI(
    title="Think Fast API",
    description="API for Think Fast Software Agency",
    version="1.1.0",
    lifespan=lifespan,
)

api_router = APIRouter(prefix="/api")


# --- Modelos -----------------------------------------------------------------

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="pending")


class ContactMessageCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactMessageResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None


# --- Email -------------------------------------------------------------------

def _send_email_sync(contact: ContactMessage) -> None:
    # Los saltos de línea en encabezados no están permitidos.
    safe_name = " ".join(contact.name.split())

    msg = EmailMessage()
    msg["Subject"] = f"Nuevo contacto desde la web: {safe_name}"
    msg["From"] = MAIL_FROM
    msg["To"] = NOTIFY_EMAIL
    msg["Reply-To"] = contact.email
    msg.set_content(
        f"Nombre: {contact.name}\n"
        f"Email: {contact.email}\n"
        f"Fecha: {contact.created_at.strftime('%d/%m/%Y %H:%M')} UTC\n\n"
        f"Mensaje:\n{contact.message}\n"
    )

    if SMTP_SECURITY == "ssl":
        server = smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=ssl.create_default_context(), timeout=15)
    else:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15)
    with server:
        if SMTP_SECURITY == "starttls":
            server.starttls(context=ssl.create_default_context())
        if SMTP_USER and SMTP_PASSWORD:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)


# --- Rutas -------------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "Think Fast API", "status": "online"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


@api_router.post("/contact", response_model=ContactMessageResponse)
async def create_contact_message(payload: ContactMessageCreate):
    """Recibe el formulario de contacto: lo guarda (si hay DB) y avisa por email."""
    if db is None and not EMAIL_ENABLED:
        raise HTTPException(status_code=503, detail="El formulario no está disponible en este momento")

    contact = ContactMessage(name=payload.name, email=payload.email, message=payload.message)

    saved = False
    if db is not None:
        try:
            doc = contact.model_dump()
            doc["created_at"] = doc["created_at"].isoformat()
            await db.contact_messages.insert_one(doc)
            saved = True
        except Exception:
            logger.exception("Error guardando el mensaje de contacto")

    emailed = False
    if EMAIL_ENABLED:
        try:
            await asyncio.to_thread(_send_email_sync, contact)
            emailed = True
        except Exception:
            logger.exception("Error enviando el email de aviso")

    if not (saved or emailed):
        raise HTTPException(status_code=500, detail="Error al guardar el mensaje")

    return ContactMessageResponse(success=True, message="Mensaje recibido correctamente", id=contact.id)


@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages(x_admin_token: Optional[str] = Header(default=None)):
    """Lista los mensajes guardados. Requiere el encabezado X-Admin-Token."""
    if not ADMIN_TOKEN or db is None:
        raise HTTPException(status_code=404, detail="Not Found")
    if not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="No autorizado")

    messages = (
        await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    )
    for msg in messages:
        if isinstance(msg.get("created_at"), str):
            msg["created_at"] = datetime.fromisoformat(msg["created_at"])
    return messages


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
