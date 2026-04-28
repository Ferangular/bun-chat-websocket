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

## 🏗️ Arquitectura del Proyecto

### Visión General
El proyecto implementa una arquitectura de chat en tiempo real siguiendo patrones modernos de desarrollo web con una clara separación de responsabilidades:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cliente Web   │◄──►│   Servidor Bun  │◄──►│  PostgreSQL     │
│   (WebSocket)   │    │   (WebSocket)   │    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Arquitectura

1. **Capa de Presentación** (`public/`)
   - Cliente HTML5 con WebSocket nativo
   - TypeScript para tipado seguro
   - Autenticación vía JWT cookies

2. **Capa de Servidor** (`src/`)
   - Servidor Bun con manejo de WebSocket
   - Middleware de autenticación JWT
   - Sistema de canales para mensajería

3. **Capa de Datos** (`prisma/`)
   - PostgreSQL como motor de base de datos
   - Prisma ORM para acceso a datos
   - Migraciones versionadas

### Estructura Detallada del Proyecto

```
bun-chat-websocket/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 config/                   # Configuración del servidor
│   │   └── server-config.ts         # Variables de entorno y configuración
│   ├── 📁 generated/                # Código autogenerado
│   │   └── 📁 prisma/               # Cliente Prisma tipado
│   ├── 📁 handlers/                 # Manejadores de eventos WebSocket
│   │   ├── message.handler.ts       # Procesamiento de mensajes
│   │   ├── group-message.handlers.ts# Manejo de mensajes grupales
│   │   └── error.handlers.ts        # Manejo centralizado de errores
│   ├── 📁 handlers-rest/            # Endpoints API REST
│   │   └── index.ts                 # Login y autenticación
│   ├── 📁 services/                 # Lógica de negocio
│   │   ├── user.service.ts          # Gestión de usuarios
│   │   ├── message.service.ts       # Lógica de mensajes
│   │   └── auth.service.ts          # Servicios de autenticación
│   ├── 📁 types/                    # Definiciones de tipos TypeScript
│   │   ├── index.ts                 # Tipos principales
│   │   └── websocket.types.ts       # Tipos específicos de WebSocket
│   ├── 📁 utils/                    # Funciones utilitarias
│   │   ├── generate-uuid.ts          # Generador de IDs únicos
│   │   └── jwt-validation.ts        # Validación de tokens JWT
│   ├── 📁 schemas/                   # Esquemas de validación
│   │   └── message.schema.ts         # Validación con Zod
│   ├── 📁 store/                     # Almacenamiento en memoria
│   │   └── messages.store.ts         # Cache de mensajes
│   ├── server.ts                    # Configuración principal del servidor
│   └── index.ts                     # Punto de entrada de la aplicación
├── 📁 public/                       # Activos estáticos del cliente
│   ├── index.html                   # Interfaz principal
│   ├── script.ts                    # Lógica del cliente TypeScript
│   ├── styles.css                   # Estilos CSS
│   └── favicon.ico                  # Icono del sitio
├── 📁 prisma/                       # Configuración de base de datos
│   ├── schema.prisma                # Esquema de la base de datos
│   └── 📁 migrations/                # Migraciones SQL versionadas
├── 📁 seed/                         # Datos de prueba
│   └── index.ts                     # Script de seed
├── .env.template                    # Plantilla de variables de entorno
├── package.json                     # Dependencias y scripts
└── README.md                        # Documentación del proyecto
```

### Patrones Arquitectónicos Implementados

#### 1. **Arquitectura Orientada a Eventos**
- Los mensajes WebSocket se manejan mediante eventos (`open`, `message`, `close`)
- Sistema de publicación/suscripción para canales de comunicación
- Desacoplamiento entre emisor y receptor

#### 2. **Middleware de Autenticación**
- Validación JWT en cada conexión WebSocket
- Protección de endpoints REST
- Gestión de sesiones via cookies

#### 3. **Separación de Responsabilidades**
- **Handlers**: Procesamiento de eventos
- **Services**: Lógica de negocio
- **Utils**: Funciones reutilizables
- **Types**: Definiciones de tipos

#### 4. **Sistema de Canales**
```typescript
// Canal global para todos los usuarios
ws.subscribe(SERVER_CONFIG.defaultChannelName);

// Canal personal para mensajes directos
ws.subscribe(ws.data.userId);
```

## 📚 Guía de Estudio Técnico

### Conceptos Fundamentales

#### 1. **WebSocket vs HTTP**
- **WebSocket**: Comunicación bidireccional en tiempo real
- **HTTP**: Solicitudes unidireccionales
- **Ventajas**: Latencia baja, persistencia de conexión

#### 2. **JWT (JSON Web Tokens)**
- **Estructura**: Header + Payload + Signature
- **Uso en el proyecto**: Autenticación sin estado
- **Ventajas**: Escalabilidad, seguridad, portabilidad

#### 3. **Prisma ORM**
- **Tipado estático**: Seguridad en tiempo de compilación
- **Migraciones**: Control de versiones de esquema
- **Query Builder**: Construcción segura de consultas

### Flujo de Datos Completo

```
1. Login Usuario
   ├── POST /api/login
   ├── Validación credenciales
   ├── Generación JWT
   └── Set cookie X-Token

2. Conexión WebSocket
   ├── Upgrade HTTP → WebSocket
   ├── Validación JWT cookie
   ├── Asignación de ID único
   └── Suscripción a canales

3. Envío de Mensaje
   ├── Cliente → Servidor (WebSocket)
   ├── Validación y procesamiento
   ├── Persistencia en BD
   └── Broadcast a destinatarios

4. Recepción de Mensaje
   ├── Servidor → Cliente (WebSocket)
   ├── Renderizado en UI
   └── Actualización de estado
```

### Tecnologías Clave y Su Rol

#### **Bun Runtime**
- **Rendimiento**: 3x más rápido que Node.js
- **Integrado**: Bundler, test runner, package manager
- **Nativo**: Soporte WebSocket sin dependencias externas

#### **PostgreSQL + Prisma**
- **ACID**: Integridad de datos garantizada
- **Relacional**: Modelado de relaciones complejas
- **Tipado**: Autocompletado y validación

#### **TypeScript**
- **Seguridad**: Detección de errores en compilación
- **Mantenibilidad**: Código autodocumentado
- **Refactoring**: Cambios seguros con IDE

### Patrones de Diseño Aplicados

#### 1. **Observer Pattern**
```typescript
// Publicación a canal
ws.publish(channelId, message);

// Suscripción a canal
ws.subscribe(channelId);
```

#### 2. **Repository Pattern**
```typescript
// Abstracción de acceso a datos
export const userService = {
  getSenderById: (id: string) => prisma.user.findUnique({where: {id}})
};
```

#### 3. **Factory Pattern**
```typescript
// Creación de servidor configurado
export const createServer = () => {
  return Bun.serve<WebSocketData>({...});
};
```

### Mejores Prácticas Implementadas

#### **Seguridad**
- ✅ JWT con expiración configurable
- ✅ Validación de entradas con Zod
- ✅ Hash de contraseñas (recomendado bcrypt)
- ✅ CORS configurado

#### **Rendimiento**
- ✅ Conexiones persistentes WebSocket
- ✅ Tipado estático para optimización
- ✅ Queries eficientes con Prisma
- ✅ Cache en memoria opcional

#### **Mantenibilidad**
- ✅ Separación de responsabilidades
- ✅ Configuración centralizada
- ✅ Logs estructurados
- ✅ Manejo centralizado de errores

### Escalabilidad y Futuras Mejoras

#### **Corto Plazo**
- [ ] Implementar reconnect automático
- [ ] Agregar typing indicator
- [ ] Sistema de notificaciones push
- [ ] Validación de mensajes con Zod

#### **Mediano Plazo**
- [ ] Microservicios con message queue
- [ ] Redis para cache y sesiones
- [ ] CDN para assets estáticos
- [ ] Sistema de roles y permisos

#### **Largo Plazo**
- [ ] Arquitectura de eventos (Event Sourcing)
- [ ] GraphQL API
- [ ] Tests automatizados (unit + integration)
- [ ] CI/CD pipeline

### Recursos de Aprendizaje Recomendados

#### **Fundamentos**
- 📖 [WebSocket API MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- 📖 [JWT.io](https://jwt.io/) - Understanding JWT
- 📖 [Prisma Docs](https://www.prisma.io/docs)

#### **Avanzado**
- 📖 [Bun Documentation](https://bun.com/docs)
- 📖 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 📖 [PostgreSQL Documentation](https://www.postgresql.org/docs/)

#### **Patrones de Diseño**
- 📖 [Node.js Design Patterns](https://www.packtpub.com/product/node-js-design-patterns-third-edition/9781839212731)
- 📖 [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Nota**: Este proyecto fue creado usando `bun init` en Bun v1.3.13. [Bun](https://bun.com) es un runtime JavaScript rápido e integral.

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


