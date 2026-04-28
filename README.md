# bun-chat-websocket

Una aplicación de chat en tiempo real construida con Bun, WebSocket y PostgreSQL. Este proyecto demuestra prácticas modernas de desarrollo web utilizando el runtime JavaScript de Bun, WebSocket para comunicación en tiempo real, y Prisma con PostgreSQL para persistencia de datos.

## 🚀 Características

- **Comunicación en Tiempo Real**: Sistema de chat basado en WebSocket
- **TypeScript**: Seguridad de tipos completa con TypeScript
- **Integración de Base de Datos**: PostgreSQL con Prisma ORM
- **Recarga en Caliente**: Servidor de desarrollo con recarga en caliente
- **Stack Moderno**: Construido con runtime Bun para rendimiento óptimo
- **Configuración de Entorno**: Gestión segura de variables de entorno

## 🛠️ Stack Tecnológico

- **Runtime**: [Bun](https://bun.com) v1.3.13
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Tiempo Real**: WebSocket
- **Validación**: Zod

## 📋 Prerrequisitos

- [Bun](https://bun.sh/docs/installation) instalado en tu máquina
- Base de datos PostgreSQL (recomendado: [Neon](https://neon.tech))
- Git para control de versiones

## 🚀 Inicio Rápido

### 1. Clonar e Instalar Dependencias

```bash
git clone <repository-url>
cd bun-chat-websocket
bun install
```

### 2. Configuración del Entorno

Copia la plantilla de entorno y configura tus variables:

```bash
cp .env.template .env
```

Edita `.env` con tu configuración:

```env
PORT=3200
DEFAULT_CHANNEL="default-channel"
# Agrega tu URL de base de datos y otras variables de entorno
```

### 3. Configuración de Base de Datos

Asegúrate de que tu base de datos PostgreSQL esté funcionando y accesible. El proyecto utiliza Prisma para operaciones de base de datos.

### 4. Ejecutar la Aplicación

**Modo Desarrollo** (con recarga en caliente):
1. Clonar proyecto
2. Ejecutar `bun  install`
3. Crear .env basado  en `.env.template`
4. Ejecutar `bun seed` para llenar base de datos de ejemplo
5. Ejecutar `bun run dev`

**Modo Producción**:
```bash
bun run start
```

**Ejecución Directa**:
```bash
bun src/index.ts
```

## 📁 Estructura del Proyecto

```
bun-chat-websocket/
├── src/
│   ├── config/          # Archivos de configuración
│   ├── handlers/        # Manejadores de peticiones
│   ├── schemas/         # Esquemas de validación (Zod)
│   ├── services/        # Servicios de lógica de negocio
│   ├── store/           # Implementaciones de almacenamiento
│   ├── types/           # Definiciones de tipos TypeScript
│   ├── utils/           # Funciones utilitarias
│   ├── server.ts        # Configuración principal del servidor
│   └── index.ts         # Punto de entrada de la aplicación
├── public/              # Activos estáticos
├── .env.template        # Plantilla de variables de entorno
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔧 Scripts de Desarrollo

| Script | Descripción |
|--------|-------------|
| `bun run dev` | Iniciar servidor de desarrollo con recarga en caliente |
| `bun run start` | Iniciar servidor de producción |
| `bun run kill-port` | Matar proceso corriendo en el puerto 3200 |

## 🌐 Documentación de la API

La aplicación proporciona endpoints WebSocket para funcionalidad de chat en tiempo real. La documentación detallada de la API se puede encontrar en la guía de desarrollo del proyecto.

## 🗄️ Base de Datos

Este proyecto utiliza PostgreSQL con Prisma ORM. Recursos clave de la base de datos:

- **Consola Neon**: [Panel de Base de Datos](https://console.neon.tech/app/projects/broad-cherry-51873355?database=neondb&branchId=br-silent-paper-anb9voe7)
- **Documentación Prisma**: [Configuración PostgreSQL](https://www.prisma.io/docs/prisma-orm/add-to-existing-project/postgresql)
- **Guía Bun + Prisma**: [Guía de Integración](https://bun.com/docs/guides/ecosystem/prisma)

## 📚 Documentación Adicional

- **Guía de Desarrollo Backend**: Ver `BACKEND_DEVELOPMENT_GUIDE.md` para patrones de desarrollo integrales y mejores prácticas
- **Referencia de API**: Documentación detallada de API disponible en los docs del proyecto

## 🔐 Dependencia jose (JWT y Criptografía)

### ¿Qué es jose?
`jose` es una librería que implementa el estándar **JOSE** (JSON Object Signing and Encryption), que incluye:
- **JWT** (JSON Web Tokens)
- **JWS** (firmas digitales) 
- **JWE** (encriptación)
- **JWK** (gestión de claves)

### Instalación
```bash
npm i jose
```

### Usos Comunes en el Proyecto

#### 1. Autenticación con JWT
```typescript
import { SignJWT } from 'jose'

// Crear un token
const jwt = await new SignJWT({ userId: 123 })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('2h')
  .sign(new TextEncoder().encode('secreto'))

// Verificar un token
import { jwtVerify } from 'jose'
const { payload } = await jwtVerify(token, new TextEncoder().encode('secreto'))
```

#### 2. Aplicaciones Típicas
- **Autenticación de usuarios** en APIs REST
- **Protección de endpoints** con tokens válidos
- **Sistemas de login** con sesión persistente
- **OAuth / OpenID Connect** (Google, Auth0, SSO)
- **Encriptación de datos sensibles** entre servicios

#### 3. Ventajas vs jsonwebtoken
- ✅ Más moderno y estándar
- ✅ Soporta más algoritmos criptográficos
- ✅ Compatible con Web Crypto API
- ✅ Ideal para proyectos modernos (Next.js, Edge Runtime, etc.)

### En Resumen
👉 **Usar jose cuando necesites:**
- Autenticación moderna con JWT
- Seguridad en APIs
- Firma y verificación de tokens
- Encriptación avanzada de datos

## 🤝 Contribuir

1. Fork del repositorio
2. Crear una rama de funcionalidad
3. Realizar tus cambios
4. Probar exhaustivamente
5. Enviar un pull request

## 📄 Licencia

Este proyecto es privado y está destinado a fines educativos.

## 🔗 Enlaces Útiles

- [Documentación de Bun](https://bun.com/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.prisma.io/docs/prisma-orm/add-to-existing-project/postgresql)
- [Neon PostgreSQL](https://neon.tech)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Nota**: Este proyecto fue creado usando `bun init` en Bun v1.3.13. [Bun](https://bun.com) es un runtime JavaScript rápido e integral.



## 🔄 Migraciones de Base de Datos

Después de configurar tu conexión a la base de datos en el archivo `.env`, sigue estos pasos según la documentación oficial de Bun + Prisma:

### 1. Ejecutar Migración Inicial

```bash
bunx --bun prisma migrate dev --name init
```

Esto hará:
- Crear el directorio `prisma/migrations/`
- Generar archivos de migración SQL basados en tu esquema
- Aplicar la migración a tu base de datos
- Crear las tablas necesarias (Users, Groups, GroupMessages, DirectMessages)
- **Generar automáticamente el cliente Prisma** en la ubicación especificada en tu schema

### 2. Generar Cliente Prisma (si es necesario)

Prisma genera automáticamente el cliente después de cada migración. Si necesitas regenerarlo manualmente:

```bash
bunx --bun prisma generate
```

Esto creará el cliente Prisma con seguridad de tipos en la ubicación especificada en tu esquema (`../src/generated/prisma`).

### 3. Estructura del Directorio de Migraciones

```
prisma/
├── migrations/
│   └── 2024xxxx_xxxxxx_init/
│       └── migration.sql
└── schema.prisma
```

### 📝 Nota Importante

Según la documentación oficial de Bun, el sistema de carga dinámica de subcomandos de Prisma actualmente requiere que npm esté instalado junto con Bun. Esto afecta a ciertos comandos CLI como `prisma init`, `prisma migrate`, etc. El código generado funciona perfectamente con Bun usando el nuevo generador `prisma-client`.

### 📚 Recursos Adicionales

- [Guía Oficial Bun + Prisma](https://bun.com/docs/guides/ecosystem/prisma)
- [Documentación de Migraciones Prisma](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Documentación Oficial Prisma](https://www.prisma.io/docs/orm/prisma-client)
- [Documentación Oficial Neon, db](https://console.neon.tech/app/projects/broad-cherry-51873355/branches/br-silent-paper-anb9voe7/tables?database=neondb)
-> concepto semilla base de datos
path directorio: C:\cursos\05_chat-usuarios\bun-chat-websocket\seed


