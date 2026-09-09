# API_Aylen_Frisoli

Organizador de tareas personal. API RESTful construida con TypeScript y Express, con autenticación por JWT y persistencia en archivos JSON.

## Stack técnico

- Node.js + TypeScript
- Express
- JWT (jsonwebtoken) para autenticación
- bcrypt para hash de contraseñas
- Zod para validación de datos
- Persistencia en archivos JSON (sin base de datos externa)

## Instalación

```bash
git clone <url-del-repositorio>
cd API_Aylen_Frisoli
npm install
cp .env.example .env
```

Completar en `.env`:

- `PORT`: puerto en el que corre el servidor (por ejemplo, 3000)
- `JWT_SECRET`: clave secreta usada para firmar los tokens JWT

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Corre el servidor en modo desarrollo con nodemon + ts-node |
| `npm run build` | Compila el proyecto TypeScript a JavaScript (carpeta `backend/`) |
| `npm start` | Corre el servidor compilado (`backend/index.js`) |

## Documentación de la API

| Método | Ruta | Requiere auth | Descripción |
|---|---|---|---|
| POST | `/users/register` | No | Registra un nuevo usuario |
| POST | `/users/login` | No | Inicia sesión y devuelve un token JWT |
| GET | `/items` | Sí | Lista las tareas del usuario logueado (soporta `?search=` para filtrar por título, sin importar mayúsculas/minúsculas) |
| POST | `/items` | Sí | Crea una nueva tarea |
| PUT | `/items/:id` | Sí | Actualiza una tarea propia |
| DELETE | `/items/:id` | Sí | Elimina una tarea propia |

Las rutas protegidas requieren enviar el token en el header `Authorization: Bearer <token>`.

Colección de Postman con casos de éxito y error para probar todos los endpoints: [postman/organizador-tareas.postman_collection.json](postman/organizador-tareas.postman_collection.json)

## Deploy

- **Build command:** `npm install && npm run build`
- **Start command:** `node backend/index.js`
- **URL de producción:** [URL_DE_RENDER_ACA]
