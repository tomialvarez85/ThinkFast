# ThinkFast — Landing page

Landing page de ThinkFast, agencia de software.

- **Frontend:** React 19, Tailwind CSS, shadcn/ui y Framer Motion (`frontend/`)
- **Backend:** FastAPI (`backend/`). Recibe el formulario de contacto, lo guarda en MongoDB (opcional) y avisa por email.

## Requisitos

- Node.js 18 o superior
- Python 3.10 o superior
- MongoDB (opcional; sin MongoDB los mensajes solo llegan por email)

## Puesta en marcha

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    |    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # y completá los valores
uvicorn server:app --reload --port 8001
```

Variables principales (ver `backend/.env.example`):

| Variable | Para qué sirve |
| --- | --- |
| `MONGO_URL`, `DB_NAME` | Guardar los mensajes (opcional) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURITY`, `SMTP_USER`, `SMTP_PASSWORD` | Servidor de correo para el aviso |
| `NOTIFY_EMAIL` | Casilla que recibe el aviso de cada contacto |
| `ADMIN_TOKEN` | Habilita `GET /api/contact` (lista de mensajes) |
| `CORS_ORIGINS` | Dominios del frontend autorizados, separados por coma |

Hay que configurar MongoDB, email o ambos. Si no hay ninguno, el formulario responde 503.

**Gmail:** activá la verificación en 2 pasos y generá una
[contraseña de aplicación](https://myaccount.google.com/apppasswords) para `SMTP_PASSWORD`.

**Ver los mensajes guardados:**

```bash
curl -H "X-Admin-Token: TU_TOKEN" http://localhost:8001/api/contact
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install --legacy-peer-deps
npm start          # desarrollo en http://localhost:3000
npm run build      # build de producción en frontend/build
```

## Personalización rápida

En `frontend/src/pages/LandingPage.js`, al principio del archivo:

- `CONTACT_EMAIL` y `WHATSAPP_NUMBER`: datos de contacto.
- `SOCIAL_LINKS`: completá las URLs de tus redes. Las que queden vacías no se muestran.

Los textos de SEO y la imagen para redes (`og-image.png`) están en `frontend/public/`.

## Tests de la API

Con el backend corriendo:

```bash
pip install requests
python backend_test.py                      # usa http://localhost:8001
BASE_URL=https://tu-dominio.com python backend_test.py
```
