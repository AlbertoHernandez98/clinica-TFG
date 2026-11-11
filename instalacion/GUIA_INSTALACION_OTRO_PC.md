# Guía para levantar la aplicación en otro ordenador

Esta guía está orientada a **Windows y PowerShell** y permite preparar un
entorno de desarrollo local. La aplicación tiene tres partes: el frontend
Angular, un backend NestJS separado y una base de datos MariaDB/MySQL.

> **Antes de empezar:** el repositorio del frontend no contiene el backend.
> En el ordenador original, el backend se encuentra en otro repositorio y
> tiene cambios sin publicar, incluidos los scripts de migración. Clonarlo
> desde GitHub no garantiza obtener la versión que se está utilizando ahora.
> Hay que publicar esos cambios previamente o transferir una copia de trabajo
> completa por un medio seguro. No compartas contraseñas, datos reales de
> pacientes ni archivos de configuración con secretos a través de Git.

## 1. Requisitos

- Git para Windows: <https://git-scm.com/download/win>.
- Node.js **16.20.x** y npm **9.x**: Angular 13.3 es compatible con Node 16;
  npm 9 puede utilizar los archivos `package-lock.json` de versión 3.
  Node 16 ya no recibe actualizaciones de seguridad: úsalo solo para este
  entorno de desarrollo y no para un despliegue público.
- Un servidor MariaDB local y un cliente gráfico como MySQL Workbench o
  HeidiSQL. El backend actual está configurado para MariaDB en `localhost`,
  puerto `3306`, base de datos `test`.
- Acceso a los dos repositorios y conexión a Internet para las dependencias.
- Un navegador actual.

Comprueba las herramientas en una terminal nueva:

```powershell
git --version
node --version
npm --version
```

Si tienes Node 16 pero otra versión de npm, puedes instalar npm 9 con
`npm install -g npm@9.9.4`. Si `npm` no se reconoce después de instalar
Node, cierra y vuelve a abrir la terminal.

## 2. Obtener el código

Escoge una carpeta de trabajo, por ejemplo `C:\proyectos`, y ejecuta:

```powershell
mkdir C:\proyectos
cd C:\proyectos
git clone https://github.com/AlbertoHernandez98/clinica-TFG.git
git clone --branch master-back https://github.com/AlbertoHernandez98/clinica-tfg-back.git
```

El segundo comando necesita permisos de acceso al repositorio del backend.
Si `C:\proyectos` ya existe, no es necesario crearla de nuevo.

**Importante:** en el momento de redactar esta guía, los cambios del backend
que implementan funciones recientes no están confirmados en Git y
`database.sql` y `migrations\` tampoco están versionados. Antes de continuar:

1. Publica esos cambios en la rama que se vaya a clonar, o copia de forma
   segura la versión actual del backend al nuevo PC, incluidos `src\`,
   `package.json`, `package-lock.json`, `database.sql` y `migrations\`.
2. No es necesario copiar `node_modules\` ni `dist\`: se regeneran en el
   nuevo equipo. Comprueba que la copia no incluya secretos ni datos clínicos.
3. Asegúrate de que ambas carpetas, `clinica-TFG` y `clinica-tfg-back`,
   corresponden a versiones compatibles. Si no se transfieren los cambios
   recientes, las citas o el historial pueden no funcionar como en el PC original.

## 3. Preparar la base de datos

1. Instala y arranca el servicio MariaDB. Crea un usuario local con contraseña
   y permisos para la base de datos de desarrollo.
2. Abre `clinica-tfg-back\src\app.module.ts` y adapta la configuración de
   TypeORM: `host`, `port`, `username`, `password` y `database` deben coincidir
   con tu servidor. La configuración actual utiliza `localhost`, `3306` y
   `test`; `synchronize` está desactivado. No subas tus credenciales a Git.
3. Conéctate al servidor desde tu cliente SQL. Para una instalación nueva,
   abre y ejecuta **una sola vez** el archivo
   `clinica-TFG\instalacion\CODIGO OK SQL SCRIPT BBDD.sql`.

   **Aviso:** este script es solo para una base nueva `test`. No lo ejecutes
   sobre una base existente ni en un servidor compartido. No elimina el esquema
   anterior: si ya existe, detén la ejecución ante el primer error. Incluye
   el esquema actualizado hasta la migración 010 y no crea cuentas.

4. Si has creado la base con este script actualizado, **no ejecutes de nuevo
   las migraciones 001 a 010**, pues sus cambios ya están incorporados. Si
   partes de un esquema antiguo, revisa qué cambios tiene y aplica solamente
   las migraciones pendientes del backend, en orden y una sola vez:

   - `migrations\001-persona-auto-increment.sql`
   - `migrations\002-persona-email.sql`
   - `migrations\003-disponibilidad.sql`
   - `migrations\004-historial-clinico.sql`
   - `migrations\005-historial-versiones-y-anulacion.sql`
   - `migrations\006-password-hash.sql`
   - `migrations\007-refresh-sessions.sql`
   - `migrations\008-auditoria-historial.sql`
   - `migrations\009-rotacion-refresh.sql`
   - `migrations\010-refresh-margen.sql`

   Estos archivos parten del esquema inicial; no deben repetirse a ciegas
   porque crean columnas e índices. Si restauras una copia de una base ya
   migrada, revisa su esquema y las migraciones aplicadas antes de ejecutar
   ninguna. Haz una copia de seguridad antes de modificar datos existentes.
   Las citas antiguas pueden necesitar una duración manual tras la migración
   003. La migración 005 no se aplica automáticamente.

5. En una instalación nueva, crea una primera cuenta de administración mediante
   el cliente SQL local, introduciendo un documento y una contraseña propios:

   ```sql
   INSERT INTO persona (dni, nombre, apellidos, idRolNativo, password)
   VALUES ('DOCUMENTO', 'Admin', 'Local', 1, 'CONTRASENA_LOCAL');
   ```

   Sustituye los valores de ejemplo; no compartas ni subas la contraseña.
   Esta contraseña inicial se almacena temporalmente en texto plano y se
   transforma en hash al iniciar sesión por primera vez. Usa una contraseña
   temporal local y cámbiala después; no expongas el servidor a Internet ni
   utilices datos reales sin una revisión de seguridad. Las cuentas nuevas creadas
   en la aplicación guardan directamente un hash. Desde esa cuenta podrás crear
   usuarios y asignar servicios a cada médico; sin servicios asignados no se
   pueden guardar citas para él.

Para llevar los datos existentes al otro ordenador se necesita una copia de
seguridad compatible con esa versión del backend, no solo el script inicial.
Trata los datos clínicos como sensibles: utiliza un medio seguro y no incluyas
datos reales en repositorios.

## 4. Instalar y arrancar el backend

En una primera ventana de PowerShell:

```powershell
cd C:\proyectos\clinica-tfg-back
npm ci
```

Si `npm ci` informa de un conflicto `ERESOLVE` entre dependencias, prueba
`npm ci --legacy-peer-deps`. Si falta o no corresponde el archivo
`package-lock.json` de la versión transferida, utiliza `npm install` y revisa
su resultado. Después, en esa misma ventana:

```powershell
$env:JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run start:dev
```

Mantén la ventana abierta. El backend debe indicar que Nest ha arrancado y
escuchar en `http://localhost:3000`. La variable anterior solo dura en esa
ventana: si cambia al reiniciar, las sesiones anteriores dejarán de ser
válidas. Para mantener sesiones entre reinicios, configura un secreto seguro y
persistente fuera del repositorio. Sin `JWT_SECRET`, el backend actual genera
una clave temporal al iniciar.

Si aparece un error de conexión, revisa que MariaDB esté arrancado, que exista
la base `test` y que coincidan el usuario, contraseña, puerto y permisos
configurados en `app.module.ts`.

## 5. Instalar y arrancar el frontend

Abre **otra** ventana de PowerShell y ejecuta:

```powershell
cd C:\proyectos\clinica-TFG
npm ci
npm start
```

Si la instalación muestra un conflicto `ERESOLVE`, prueba
`npm ci --legacy-peer-deps`. Espera a que Angular indique que ha compilado
correctamente y abre <http://localhost:4200/>. Deja abiertas las dos
terminales mientras utilices la aplicación. Para detener cada proceso, pulsa
`Ctrl+C` en su ventana.

## 6. Comprobar que todo funciona

1. Comprueba que MariaDB está en marcha y que las dos terminales no muestran
   errores de arranque.
2. Abre <http://localhost:4200/> y verifica que se ve la página.
3. Inicia sesión con una cuenta válida de la base de desarrollo y prueba una
   función que consulte el servidor, como el perfil o las citas. Si creaste
   la base con el script inicial, revisa su usuario de prueba y su
   compatibilidad con la versión del backend; no supongas que sirve para
   producción.
4. Si la página abre pero fallan los datos, revisa la terminal del backend y,
   en el navegador, F12 → **Red** y **Consola**. La aplicación utiliza
   normalmente `http://localhost:3000` para la API; el navegador puede
   mostrar errores de conexión, autenticación o CORS.

## Problemas frecuentes

- **Solo se ve la interfaz o falla el inicio de sesión:** el frontend puede
  arrancar sin el backend, pero necesita la API y la base de datos para las
  funciones conectadas. Comprueba también que copiaste los cambios recientes
  y las migraciones del backend.
- **Puerto 4200 o 3000 ocupado:** identifica qué proceso lo está utilizando y
  ciérralo solo si corresponde. Si cambias el puerto de la API, actualiza
  `clinica-TFG\src\app\services\config\config.service.ts` y revisa CORS. El
  archivo `src\proxy.conf.json` existe, pero `npm start` no lo activa
  automáticamente; no lo uses como única configuración de la API.
- **Error de autenticación de base de datos:** verifica credenciales, permisos
  y compatibilidad del servidor y del controlador configurado en el backend.
- **Faltan columnas o tablas:** comprueba el esquema y las migraciones 001 a
  010 pendientes, sin volver a aplicar las ya incorporadas.
- **Errores de CORS:** abre la interfaz con `localhost:4200`, comprueba el
  origen permitido por el backend y revisa la consola del navegador.

Esta configuración es para desarrollo local, no para producción: el backend
documenta contraseñas heredadas en texto plano y no incorpora por sí solo las
medidas necesarias para publicar la aplicación o almacenar datos clínicos reales.
