# Sistema Web de Gestión de Clínicas: Reserva de Citas, Historiales Clínicos y Gestión de Usuarios

## Trabajo Fin de Grado

**Grado en Ingeniería Informática**

**Autor:** [Tu Nombre]

**Tutor:** [Nombre del Tutor]

**Año Académico:** 2025-2026

---

## RESUMEN

Este trabajo se centra en el diseño e implementación de una plataforma web completa para la gestión integral de clínicas. La aplicación proporciona herramientas para la administración de citas médicas, gestión de historiales clínicos, manejo de usuarios con diferentes roles, y servicios médicos, utilizando tecnologías modernas de desarrollo web.

La solución está compuesta por un frontend responsive construido con Angular e Ionic, y un backend robusto implementado en NestJS con TypeORM y MySQL. El sistema permite a médicos, pacientes y personal administrativo interactuar de manera eficiente en un entorno seguro y escalable.

El proyecto implementa buenas prácticas de desarrollo incluyendo autenticación basada en JWT, validaciones personalizadas avanzadas, integración con Google Places para geolocalización, y un sistema de gestión de roles y permisos.

**Palabras clave:** Angular, Ionic, NestJS, MySQL, TypeORM, JWT, REST API, Gestión Clínica, Reserva de Citas, Historiales Clínicos

---

## TABLA DE CONTENIDOS

1. [Introducción](#1-introducción)
2. [Objetivos](#2-objetivos)
3. [Estado del Arte](#3-estado-del-arte)
4. [Análisis de Requisitos](#4-análisis-de-requisitos)
5. [Casos de Uso](#5-casos-de-uso)
6. [Diseño](#6-diseño)
7. [Implementación](#7-implementación)
8. [Pruebas y Resultados](#8-pruebas-y-resultados)
9. [Despliegue](#9-despliegue)
10. [Conclusiones](#10-conclusiones)
11. [Referencias](#11-referencias)
12. [Anexos](#12-anexos)

---

## 1. INTRODUCCIÓN

### 1.1 Contexto

La gestión moderna de clínicas requiere sistemas integrados que permitan organizar eficientemente la atención al paciente. Las soluciones tradicionales, frecuentemente basadas en papel o sistemas monolíticos antiguos, presentan limitaciones significativas:

- Dificultad en la organización de citas
- Falta de acceso rápido a historiales clínicos
- Problemas en la comunicación entre profesionales médicos
- Experiencia de usuario deficiente

### 1.2 Motivación

Este proyecto surge de la necesidad de modernizar la gestión clínica mediante una aplicación web que:

- **Mejore la experiencia del paciente:** Reserva de citas online, acceso a historiales
- **Optimize el trabajo del personal médico:** Gestión centralizada de información
- **Facilite la administración:** Control de usuarios, servicios y disponibilidad
- **Garantice seguridad:** Protección de datos sensibles mediante autenticación robusta

### 1.3 Alcance del Proyecto

Este TFG cubre el diseño e implementación de:

✅ **Frontend:** Aplicación web responsive con Angular e Ionic
✅ **Backend:** API REST con NestJS
✅ **Base de Datos:** Modelo relacional con MySQL
✅ **Autenticación:** Sistema JWT con roles y permisos
✅ **Características avanzadas:** Validaciones custom, Google Places integration, búsqueda y filtros

**Fuera del alcance:**
- Sistema de pagos online
- Expedición de recetas digitales
- Integración con sistemas de citas de terceros
- Análisis estadístico avanzado

---

## 2. OBJETIVOS

### 2.1 Objetivo General

Desarrollar una plataforma web completa y funcional para la gestión integral de clínicas que permita a diferentes actores (médicos, pacientes, administradores) interactuar de manera eficiente, segura y con una experiencia de usuario óptima.

### 2.2 Objetivos Específicos

1. **Análisis y especificación:** Definir requisitos claros del sistema siguiendo estándares IEEE
2. **Diseño arquitectónico:** Implementar arquitectura escalable con separación de capas
3. **Modelado de datos:** Crear modelo relacional que represente entidades clínicas
4. **Desarrollo frontend:** Construir interfaz responsive y accesible con Angular + Ionic
5. **Desarrollo backend:** Implementar API REST con lógica de negocio robusta en NestJS
6. **Seguridad:** Implementar autenticación, autorización y validaciones
7. **Pruebas:** Validar funcionalidad mediante pruebas unitarias y de integración
8. **Documentación:** Generar documentación técnica completa y API

---

## 3. ESTADO DEL ARTE

### 3.1 Sistemas Similares Existentes

#### 3.1.1 Doctoralia / Zocdoc
- **Características:** Plataforma de reserva de citas online
- **Limitaciones:** Enfocada principalmente en búsqueda y reserva, no en gestión clínica completa
- **Modelo:** Centralizado, datos en servidores de terceros

#### 3.1.2 MedicalTIS
- **Características:** Sistema de gestión hospitalaria completo
- **Limitaciones:** Solución empresarial cara, difícil de personalizar
- **Modelo:** On-premise o cloud privado

#### 3.1.3 Nextdoor Health
- **Características:** Plataforma de salud digital
- **Limitaciones:** Enfoque en telemedicina, no en clínicas locales
- **Modelo:** Cloud SaaS

#### 3.1.4 Odesk / Fiverr (Inspiration)
- **Características:** Plataformas de servicios con perfiles de prestadores
- **Ventaja:** Modelo escalable de usuario-servicio
- **Aplicable:** Adaptación para servicios médicos

### 3.2 Análisis de Tecnologías Utilizadas

#### Frontend

**Angular 13.3**
- Framework completo con TypeScript
- Gestión de estado con servicios
- Routing avanzado con lazy loading
- Amplia comunidad y documentación

**Ionic 6.7**
- Compilación a web y mobile (PWA)
- Componentes UI orientados a mobile
- Integración perfecta con Angular
- Desarrollo multiplataforma

**Angular Material 13.3**
- Componentes UI Material Design
- Accesibilidad incluida
- Temas personalizables
- Componentes complejos (tablas, árboles, etc.)

#### Backend

**NestJS 9.4**
- Arquitectura modular y escalable
- Decoradores para reducir boilerplate
- Inyección de dependencias nativa
- Soporte para GraphQL y REST
- TypeScript first

**Express**
- Middleware robusto
- Ecosistema maduro
- Compatible con NestJS

**TypeORM 0.3**
- ORM con soporte SQL completo
- Migraciones automáticas
- Relaciones tipo-seguras
- Mejor alternativa a Sequelize en TypeScript

**JWT (JSON Web Tokens)**
- Estándar industrial para autenticación stateless
- Información codificada en el token
- Validación sin necesidad de sesión en BD

#### Base de Datos

**MySQL**
- SGBD relacional maduro
- Amplia adopción
- Buen rendimiento para aplicaciones web
- Interfaz simple con TypeORM

---

## 4. ANÁLISIS DE REQUISITOS

### 4.1 Introducción a Requisitos

Los requisitos definen las características y funcionalidades que debe cumplir el sistema. Se siguió el estándar **IEEE 830-1998** para su especificación.

### 4.2 Descripción General del Sistema

#### 4.2.1 Usuarios del Sistema

**Roles identificados:**

- **Patient (Paciente):** Usuario que solicita servicios médicos
- **Doctor (Médico):** Profesional que presta servicios
- **Admin (Administrador):** Gestiona usuarios y configuración del sistema
- **Staff (Personal):** Asistente que ayuda en la administración

#### 4.2.2 Funcionalidades Principales

| Funcionalidad | Descripción | Usuario |
|---------------|-------------|---------|
| Autenticación | Login/Registro con JWT | Todos |
| Gestión de Perfil | Editar datos personales, cambiar contraseña | Todos |
| Reserva de Citas | Buscar disponibilidad y agendar citas | Paciente |
| Listado de Citas | Ver citas próximas | Paciente/Médico |
| Historial Clínico | Registrar y consultar historiales | Médico/Paciente |
| Gestión de Servicios | Administrar servicios médicos | Admin |
| Disponibilidad Médica | Definir horarios de atención | Médico/Admin |
| Gestión de Usuarios | CRUD de usuarios con roles | Admin |

### 4.3 Requisitos Específicos

#### 4.3.1 Requisitos Funcionales

**RF-001: Autenticación de Usuarios**
- **Prioridad:** Alta
- **Descripción:** Los usuarios pueden registrarse e iniciar sesión
- **Criterios de aceptación:**
  - El sistema valida email y contraseña
  - Se genera token JWT válido por 1 hora
  - Se implementa refresh token para renovación
  - Las contraseñas se almacenan hasheadas

**RF-002: Reserva de Citas**
- **Prioridad:** Alta
- **Descripción:** Pacientes pueden reservar citas con médicos disponibles
- **Criterios de aceptación:**
  - Búsqueda por servicio médico
  - Búsqueda por médico
  - Visualización de disponibilidad
  - Confirmación de cita
  - Notificación al médico

**RF-003: Gestión de Historiales Clínicos**
- **Prioridad:** Alta
- **Descripción:** Médicos pueden registrar y consultar historiales
- **Criterios de aceptación:**
  - Crear entrada de historial con comentarios
  - Registrar fecha y hora
  - Vincular a cita específica
  - Filtrar por médico, servicio
  - Visualizar completo con paginación

**RF-004: Gestión de Servicios Médicos**
- **Prioridad:** Media
- **Descripción:** Administrador puede CRUD de servicios
- **Criterios de aceptación:**
  - Crear nuevo servicio
  - Modificar nombre y descripción
  - Eliminar servicio
  - Asignar médicos a servicios

**RF-005: Gestión de Usuarios**
- **Prioridad:** Alta
- **Descripción:** Administrador gestiona usuarios del sistema
- **Criterios de aceptación:**
  - Crear usuario con rol específico
  - Modificar datos del usuario
  - Cambiar rol del usuario
  - Eliminar usuario (soft delete)
  - Validar email único
  - DNI/NIE/Pasaporte válido
  - Teléfono formato correcto
  - Contraseña con requisitos mínimos

**RF-006: Cambio de Contraseña**
- **Prioridad:** Media
- **Descripción:** Usuarios pueden cambiar su contraseña
- **Criterios de aceptación:**
  - Validar contraseña actual
  - Validar requisitos de nueva contraseña
  - Actualizar en BD
  - Notificar al usuario

**RF-007: Perfil de Usuario**
- **Prioridad:** Media
- **Descripción:** Usuarios pueden editar su información
- **Criterios de aceptación:**
  - Actualizar nombre, teléfono
  - Subir/cambiar foto de perfil
  - Autocomplete de dirección con Google Places
  - Actualizar datos profesionales (médicos)

**RF-008: Búsqueda de Médicos por Disponibilidad**
- **Prioridad:** Media
- **Descripción:** Pacientes pueden filtrar médicos con disponibilidad
- **Criterios de aceptación:**
  - Filtrar por servicio
  - Filtrar por fecha
  - Mostrar disponibilidad horaria
  - Ordenar resultados

#### 4.3.2 Requisitos No Funcionales

| Requisito | Descripción | Métrica |
|-----------|-------------|---------|
| **Rendimiento** | Tiempo de respuesta API | < 200ms |
| **Seguridad** | Encriptación de datos sensibles | AES-256 |
| **Disponibilidad** | Uptime del sistema | 99.5% |
| **Escalabilidad** | Soporte para N usuarios concurrentes | Mín. 1000 |
| **Usabilidad** | Accessibilidad WCAG 2.1 | Nivel AA |
| **Mantenibilidad** | Cobertura de pruebas | > 70% |
| **Portabilidad** | Múltiples navegadores | Chrome, Firefox, Safari |
| **Compatibilidad** | Responsive design | Móvil, tablet, desktop |

#### 4.3.3 Restricciones

- Las citas solo pueden reservarse dentro de horarios disponibles
- No se permite sobreagendamiento
- Los historiales clínicos son privados (solo médico y paciente)
- Los datos solicitados en registro son obligatorios
- El email debe ser único en el sistema

---

## 5. CASOS DE USO

### 5.1 Actores del Sistema

| Actor | Descripción | Ejemplo |
|-------|-------------|---------|
| **Patient** | Persona que solicita servicios médicos | Juan García, paciente |
| **Doctor** | Profesional médico prestador de servicios | Dra. María López, cardióloga |
| **Admin** | Administrador del sistema | Carlos Admin |
| **System** | Sistema automatizado | Motor de validaciones |

### 5.2 Diagrama de Casos de Uso

```
                    ┌─────────────────────┐
                    │   Sistema Clínica   │
                    └─────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌─────────┐        ┌──────────┐      ┌──────────┐
   │ Patient │        │  Doctor  │      │  Admin   │
   └────┬────┘        └────┬─────┘      └────┬─────┘
        │                  │                  │
        ├─ Registrarse     ├─ Registrarse    ├─ Gestionar Usuarios
        ├─ Login           ├─ Login          ├─ Gestionar Servicios
        ├─ Ver Perfil      ├─ Ver Perfil     ├─ Gestionar Roles
        ├─ Editar Perfil   ├─ Editar Perfil  └─ Ver Estadísticas
        ├─ Reservar Cita   ├─ Ver Citas
        ├─ Ver Citas       ├─ Ver Historial
        └─ Ver Historial   └─ Crear Historial
```

### 5.3 Descripción de Casos de Uso

#### CU-001: Registrarse en el Sistema

| Atributo | Valor |
|----------|-------|
| **Nombre** | Registrarse en el Sistema |
| **Actores** | Usuario no registrado |
| **Precondiciones** | - |
| **Flujo Principal** | 1. Usuario accede a página de registro<br/>2. Completa formulario (email, contraseña, datos personales)<br/>3. Sistema valida datos<br/>4. Sistema crea cuenta y envía confirmación<br/>5. Usuario recibe acceso al sistema |
| **Flujos Alternativos** | Si email existe: mostrar error y sugerir login |
| **Postcondiciones** | Usuario cuenta creada, puede iniciar sesión |

#### CU-002: Iniciar Sesión

| Atributo | Valor |
|----------|-------|
| **Nombre** | Iniciar Sesión |
| **Actores** | Usuario registrado |
| **Precondiciones** | Usuario debe estar registrado |
| **Flujo Principal** | 1. Usuario accede a login<br/>2. Ingresa email y contraseña<br/>3. Sistema valida credenciales<br/>4. Sistema genera JWT token<br/>5. Usuario accede al dashboard |
| **Flujos Alternativos** | Si credenciales incorrectas: mostrar error |
| **Postcondiciones** | Usuario autenticado, token válido 1 hora |

#### CU-003: Ver y Editar Perfil

| Atributo | Valor |
|----------|-------|
| **Nombre** | Ver y Editar Perfil |
| **Actores** | Patient, Doctor, Admin |
| **Precondiciones** | Usuario debe estar autenticado |
| **Flujo Principal** | 1. Usuario accede a perfil<br/>2. Sistema muestra datos actuales<br/>3. Usuario modifica campos deseados<br/>4. Usuario guarda cambios<br/>5. Sistema valida y actualiza BD |
| **Flujos Alternativos** | Si validación falla: mostrar errores específicos |
| **Postcondiciones** | Datos de usuario actualizados |

#### CU-004: Cambiar Contraseña

| Atributo | Valor |
|----------|-------|
| **Nombre** | Cambiar Contraseña |
| **Actores** | Cualquier usuario autenticado |
| **Precondiciones** | Usuario debe estar autenticado |
| **Flujo Principal** | 1. Usuario accede a seguridad/contraseña<br/>2. Ingresa contraseña actual<br/>3. Ingresa nueva contraseña (2 veces)<br/>4. Sistema valida requisitos (6+ chars, may/min, números)<br/>5. Sistema actualiza contraseña hasheada |
| **Flujos Alternativos** | Si contraseña actual incorrecta: error<br/>Si no cumple requisitos: mostrar validación |
| **Postcondiciones** | Contraseña actualizada, requiere re-login |

#### CU-005: Subir Foto de Perfil

| Atributo | Valor |
|----------|-------|
| **Nombre** | Subir Foto de Perfil |
| **Actores** | Cualquier usuario autenticado |
| **Precondiciones** | Usuario autenticado, editar perfil |
| **Flujo Principal** | 1. Usuario accede a editar perfil<br/>2. Selecciona imagen (drag-drop o file picker)<br/>3. Sistema valida formato (JPG, PNG)<br/>4. Sistema comprime imagen<br/>5. Sistema guarda en servidor |
| **Flujos Alternativos** | Si formato inválido: mostrar error<br/>Si tamaño > 5MB: mostrar error |
| **Postcondiciones** | Foto actualizada en perfil |

#### CU-006: Buscar y Reservar Cita

| Atributo | Valor |
|----------|-------|
| **Nombre** | Buscar y Reservar Cita |
| **Actores** | Patient |
| **Precondiciones** | Patient autenticado, existen médicos/servicios |
| **Flujo Principal** | 1. Patient accede a "Reservar Cita"<br/>2. Selecciona servicio médico<br/>3. Visualiza médicos disponibles<br/>4. Selecciona médico<br/>5. Sistema muestra disponibilidad horaria<br/>6. Patient selecciona fecha/hora<br/>7. Confirma cita<br/>8. Sistema registra cita y notifica médico |
| **Flujos Alternativos** | Si no hay disponibilidad: sugerir otras fechas<br/>Si médico no ofrece servicio: mostrar error |
| **Postcondiciones** | Cita registrada, confirmación enviada |

#### CU-007: Ver Historial de Citas

| Atributo | Valor |
|----------|-------|
| **Nombre** | Ver Historial de Citas |
| **Actores** | Patient, Doctor |
| **Precondiciones** | Usuario autenticado |
| **Flujo Principal** | 1. Usuario accede a "Mis Citas"<br/>2. Sistema muestra lista de citas (próximas/pasadas)<br/>3. Usuario puede filtrar por fecha, médico, servicio<br/>4. Usuario puede ver detalles de cada cita<br/>5. Usuario puede descargar resumen |
| **Flujos Alternativos** | Si no hay citas: mostrar mensaje |
| **Postcondiciones** | Citas visualizadas |

#### CU-008: Crear Entrada de Historial Clínico

| Atributo | Valor |
|----------|-------|
| **Nombre** | Crear Entrada de Historial |
| **Actores** | Doctor |
| **Precondiciones** | Doctor autenticado, paciente visitado |
| **Flujo Principal** | 1. Doctor accede a "Historial" del paciente<br/>2. Crea nueva entrada de historial<br/>3. Ingresa comentarios médicos<br/>4. Selecciona servicio tratado<br/>5. Ingresa fecha/hora<br/>6. Vincula a cita específica (opcional)<br/>7. Guarda historial<br/>8. Sistema registra en BD |
| **Flujos Alternativos** | Si paciente no existe: mostrar error |
| **Postcondiciones** | Entrada de historial registrada |

#### CU-009: Ver Historial Clínico Completo

| Atributo | Valor |
|----------|-------|
| **Nombre** | Ver Historial Clínico Completo |
| **Actores** | Doctor, Patient (propio) |
| **Precondiciones** | Acceso autorizado al paciente |
| **Flujo Principal** | 1. Usuario accede a historial<br/>2. Sistema obtiene todas las entradas<br/>3. Ordena por fecha (reciente primero)<br/>4. Pagina resultados (5 por página)<br/>5. Permite filtro por médico/servicio<br/>6. Muestra detalles al expandir |
| **Flujos Alternativos** | Si no hay historial: mostrar "Sin historial" |
| **Postcondiciones** | Historial visualizado |

#### CU-010: Gestionar Usuarios (Admin)

| Atributo | Valor |
|----------|-------|
| **Nombre** | Gestionar Usuarios |
| **Actores** | Admin |
| **Precondiciones** | Admin autenticado |
| **Flujo Principal** | 1. Admin accede a "Gestión de Usuarios"<br/>2. Ve lista de usuarios con filtros<br/>3. Puede crear nuevo usuario<br/>4. Puede editar datos de usuario<br/>5. Puede cambiar rol<br/>6. Puede eliminar usuario (soft delete)<br/>7. Sistema valida DNI/NIE/Pasaporte<br/>8. Sistema valida email único |
| **Flujos Alternativos** | Si email duplicado: mostrar error<br/>Si DNI inválido: mostrar validación |
| **Postcondiciones** | Usuarios gestionados |

#### CU-011: Gestionar Servicios Médicos (Admin)

| Atributo | Valor |
|----------|-------|
| **Nombre** | Gestionar Servicios |
| **Actores** | Admin |
| **Precondiciones** | Admin autenticado |
| **Flujo Principal** | 1. Admin accede a "Servicios"<br/>2. Ve listado de servicios<br/>3. Puede crear nuevo servicio<br/>4. Puede modificar nombre/descripción<br/>5. Puede asignar médicos a servicio<br/>6. Puede eliminar servicio<br/>7. Sistema actualiza relaciones |
| **Flujos Alternativos** | Si hay citas con servicio: confirmar eliminación |
| **Postcondiciones** | Servicios actualizados |

#### CU-012: Gestionar Disponibilidad (Doctor/Admin)

| Atributo | Valor |
|----------|-------|
| **Nombre** | Gestionar Disponibilidad |
| **Actores** | Doctor, Admin |
| **Precondiciones** | Doctor autenticado |
| **Flujo Principal** | 1. Doctor accede a "Mi Disponibilidad"<br/>2. Selecciona días de atención<br/>3. Define horarios (inicio/fin)<br/>4. Selecciona servicios que ofrece<br/>5. Guarda configuración<br/>6. Sistema permite búsqueda por disponibilidad |
| **Flujos Alternativos** | Si horarios conflictivos: mostrar advertencia |
| **Postcondiciones** | Disponibilidad registrada |

---

## 6. DISEÑO

### 6.1 Modelo Cliente-Servidor

La aplicación utiliza una arquitectura **Cliente-Servidor** donde:

- **Cliente (Frontend):** Interfaz interactiva en navegador
- **Servidor (Backend):** Procesa lógica y accede a datos
- **Comunicación:** Proto REST sobre HTTP/HTTPS

```
┌─────────────────────────────┐
│   CLIENTE (Angular/Ionic)   │
│  ┌────────────────────────┐ │
│  │ Interfaz Usuario (UI)  │ │
│  │ Lógica de Presentación │ │
│  │ Gestión de Estado      │ │
│  └──────────┬─────────────┘ │
└─────────────┼────────────────┘
              │
        HTTP/REST
              │
┌─────────────┼────────────────┐
│ SERVIDOR (NestJS)            │
│  ┌──────────┴─────────────┐  │
│  │ API REST Controllers   │  │
│  │ Lógica de Negocio      │  │
│  │ Validaciones           │  │
│  │ Seguridad (JWT, CORS)  │  │
│  └──────────┬─────────────┘  │
│             │                │
│  ┌──────────┴─────────────┐  │
│  │ Base de Datos (MySQL)  │  │
│  │ ORM (TypeORM)          │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

### 6.2 Arquitectura por Capas (Backend)

Se implementó arquitectura de **N-capas** con separación clara de responsabilidades:

#### Capa de Presentación (Controllers)
- Recibe peticiones HTTP
- Valida formato de entrada
- Retorna respuestas JSON
- Gestiona códigos HTTP

#### Capa de Negocio (Services)
- Implementa reglas de negocio
- Valida datos de negocio
- Transforma DTOs a entidades
- Coordina acceso a datos

#### Capa de Dominio (Repositories)
- Acceso a BD
- Operaciones CRUD
- Queries complejas
- Manejo de relaciones

#### Capa de Datos (Entities)
- Modelos de datos
- Mapeo ORM (TypeORM)
- Relaciones entre entidades
- Validaciones de esquema

#### Componentes Transversales
- **Autenticación (JWT):** Validación de tokens
- **Autorización (Roles):** Verificación de permisos
- **Manejo de Errores:** Excepción centralizada
- **Validación:** Decoradores para DTO
- **Logging:** Registro de operaciones

### 6.3 Base de Datos Relacional

#### 6.3.1 Diagrama Entidad-Relación

```
persona (idPersona, dni, nombre, apellidos, telefono, fotoPerfil, idRolNativo)
   │
   ├─→ rol (idRol, descripcion)
   │
   ├─→ persona_has_rol (idPersona, idRol) [N:M]
   │
   ├─→ cita (idCita, fechaInicio, duracion, idCliente, idMedico, idServicio)
   │
   └─→ historialclinico (idHistorialClinico, comentarios, fecha, hora, idCliente, idMedico, idServicio)
        │
        └─→ servicio (idServicio, servicio)
             │
             └─→ medico_has_servicio (idMedico, idServicio) [N:M]
```

#### 6.3.2 Descripción de Tablas

| Tabla | Campos | Descripción |
|-------|--------|-------------|
| **persona** | idPersona (PK), dni, nombre, apellidos, telefono, password, idRolNativo (FK), fotoPerfil | Usuarios del sistema |
| **rol** | idRol (PK), descripcion | Roles disponibles (Patient, Doctor, Admin, Staff) |
| **persona_has_rol** | idPersona (FK), idRol (FK) | Asignación de roles a personas (N:M) |
| **cita** | idCita (PK, AI), fechaInicio, duracion, idCliente (FK), idMedico (FK), idServicio (FK) | Citas médicas |
| **historialclinico** | idHistorialClinico (PK, AI), comentarios, fecha, hora, idCliente (FK), idMedico (FK), idServicio (FK) | Registros clínicos por paciente |
| **servicio** | idServicio (PK), servicio, descripcion | Servicios médicos |
| **medico_has_servicio** | idMedico (FK), idServicio (FK) | Servicios que ofrece cada médico (N:M) |

### 6.4 Modelos de Datos (Frontend)

```typescript
// Modelos utilizados en frontend
interface User {
  idPersona: number;
  dni: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  fotoPerfil?: string;
  rol?: Rol;
}

interface Cita {
  idCita: number;
  fechaInicio: Date;
  duracion: number; // en minutos
  idCliente: number;
  idMedico: number;
  idServicio: number;
}

interface HistorialClinico {
  idHistorialClinico: number;
  comentarios: string;
  fecha: Date;
  hora: string;
  idCliente: number;
  idMedico: number;
  idServicio: number;
}
```

---

## 7. IMPLEMENTACIÓN

### 7.1 Tecnologías y Herramientas

#### Frontend
- **Angular 13.3:** Framework completo con TypeScript
- **Ionic 6.7:** Componentes mobile-optimizados
- **Angular Material 13.3:** Componentes UI profesionales
- **ngx-translate 14.0:** Internacionalización (ES, EN, PT)
- **RxJS 7.5:** Programación reactiva
- **TypeScript 4.6:** Lenguaje tipado

#### Backend
- **NestJS 9.4:** Framework NodeJS empresarial
- **Express:** Servidor HTTP
- **TypeORM 0.3:** ORM para SQL
- **MySQL:** Base de datos relacional
- **JWT (jsonwebtoken):** Autenticación stateless
- **bcrypt:** Hasheado de contraseñas
- **Passport:** Estrategias de auth (Local, JWT)
- **Multer:** Upload de archivos
- **Node 16+:** Runtime

#### Desarrollo
- **Visual Studio Code:** Editor de código
- **Visual Studio 2019:** IDE (backend)
- **Git:** Control de versiones
- **npm:** Gestor de paquetes
- **TypeScript:** Tipado estático

#### Pruebas y Validación
- **Karma + Jasmine:** Unit testing (Angular)
- **Jest:** Unit testing (NestJS)
- **Postman:** Pruebas de API
- **Browser DevTools:** Debugging

### 7.2 Estructura del Proyecto

```
clinica-tfg/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── reserva-cita/
│   │   │   ├── historial/
│   │   │   ├── perfil-usuario/
│   │   │   ├── access-menu/
│   │   │   ├── clinica/
│   │   │   ├── contacto/
│   │   │   └── servicios-menu/
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   ├── database/
│   │   │   ├── lang/
│   │   │   └── local-storage/
│   │   ├── providers/
│   │   │   ├── datos.service.ts
│   │   │   ├── usuario.ts
│   │   │   └── app-state/
│   │   └── shared/
│   │       ├── components/
│   │       ├── pipes/
│   │       └── validators/
│   ├── assets/
│   │   ├── i18n/ (es.json, en.json, pt.json)
│   │   ├── icons/
│   │   └── img/
│   └── environments/
├── package.json
├── angular.json
└── tsconfig.json
```

```
clinica-tfg-back/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   ├── persona/
│   │   ├── persona.controller.ts
│   │   ├── persona.service.ts
│   │   ├── persona.entity.ts
│   │   └── persona.module.ts
│   ├── citas/
│   │   ├── citas.controller.ts
│   │   ├── citas.service.ts
│   │   ├── citas.entity.ts
│   │   └── citas.module.ts
│   ├── historialclinico/
│   ├── servicios/
│   ├── medico-has-servicio/
│   └── photos/
├── database.sql
└── package.json
```

### 7.3 Autenticación y Seguridad

#### 7.3.1 Flujo de Autenticación JWT

```
1. User registra credenciales
   ↓
2. Sistema hashea contraseña con bcrypt
   ↓
3. Se almacena en BD
   ↓
4. User solicita login
   ↓
5. Sistema valida contraseña
   ↓
6. Si válido: genera JWT con userId
   ↓
7. JWT enviado al cliente
   ↓
8. Cliente almacena en localStorage
   ↓
9. Todas las peticiones incluyen JWT en header
   ↓
10. Servidor valida JWT antes de procesar
```

#### 7.3.2 Validaciones Custom

Se implementaron validadores personalizados reutilizables:

**emailValidator():**
- Formato: usuario@dominio.ext
- Patrón regex estándar

**documentValidator():**
- DNI: 8 dígitos + 1 letra (ej: 12345678A)
- NIE: X/Y/Z + 7 dígitos + 1 letra (ej: X1234567B)
- Pasaporte: 3 letras + 6 dígitos (ej: ABC123456)

**phoneValidator():**
- Solo números
- 9-15 dígitos
- Formato internacional

**passwordValidator():**
- Mínimo 6 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número

### 7.4 API REST Endpoints

#### Autenticación
```
POST   /auth/register      - Registrar nuevo usuario
POST   /auth/login         - Iniciar sesión
POST   /auth/logout        - Cerrar sesión
POST   /auth/refresh       - Renovar JWT token
```

#### Usuarios
```
GET    /persona                    - Listar usuarios
POST   /persona                    - Crear usuario
GET    /persona/:id                - Obtener usuario
PUT    /persona/:id                - Actualizar usuario
DELETE /persona/:id                - Eliminar usuario
POST   /persona/:id/change-password - Cambiar contraseña
POST   /persona/:id/upload-photo   - Subir foto perfil
```

#### Citas
```
GET    /citas                      - Listar citas (del usuario)
POST   /citas                      - Crear cita
GET    /citas/:id                  - Obtener detalle cita
PUT    /citas/:id                  - Actualizar cita
DELETE /citas/:id                  - Cancelar cita
GET    /citas/disponibilidad/:medico-fecha - Disponibilidad
```

#### Historial Clínico
```
GET    /historialclinico           - Listar historiales (del paciente)
POST   /historialclinico           - Crear entrada
GET    /historialclinico/:id       - Obtener detalle
PUT    /historialclinico/:id       - Actualizar entrada
DELETE /historialclinico/:id       - Eliminar entrada
```

#### Servicios
```
GET    /servicios                  - Listar servicios
POST   /servicios                  - Crear servicio
PUT    /servicios/:id              - Actualizar servicio
DELETE /servicios/:id              - Eliminar servicio
POST   /servicios/:id/medicos      - Asignar médicos
```

### 7.5 Internacionalización (i18n)

Soporta 3 idiomas: **Español, Inglés, Portugués**

Estructura de recursos:
```
assets/i18n/
├── es.json
├── en.json
└── pt.json

Estructura de archivo:
{
  "BREADCUMTEXT": {
    "MENU": "Menú Principal",
    "RESERVA_CITA": "Reservar Cita"
  },
  "HEADERS": {
    "LOGIN": "Iniciar Sesión"
  }
}
```

### 7.6 Características Especiales

#### 7.6.1 Google Places Integration
- Autocomplete de direcciones
- Geolocalización GPS
- Validación de dirección real
- Desglose de componentes (calle, ciudad, código postal)

#### 7.6.2 Upload de Archivos
- Drag-and-drop interface
- Validación de tipo MIME
- Compresión de imágenes
- Almacenamiento seguro en servidor

#### 7.6.3 Componentes Reutilizables
- InputTextComponent
- InputPasswordComponent
- ButtonBaseComponent
- FormCardComponent
- ErrorSuccessComponent (popups)
- SpinnerComponent (loading)

---

## 8. PRUEBAS Y RESULTADOS

### 8.1 Pruebas Unitarias

**Framework de pruebas:** Karma + Jasmine (Frontend), Jest (Backend)

**Cobertura esperada:** > 70%

**Ejemplos de pruebas:**

```typescript
// Frontend (Karma/Jasmine)
describe('LoginComponent', () => {
  it('should validate email format', () => {
    const component = new LoginComponent();
    expect(component.emailValidator('test@example.com')).toBeTruthy();
    expect(component.emailValidator('invalid-email')).toBeFalsy();
  });

  it('should hashpassword before sending to API', () => {
    const mockPassword = 'Password123';
    expect(component.hashPassword(mockPassword)).toBeDefined();
  });
});

// Backend (Jest)
describe('PersonaService', () => {
  it('should create new user with hashed password', async () => {
    const user = {
      dni: '12345678A',
      nombre: 'Juan',
      apellidos: 'García',
      password: 'Pass123'
    };
    const result = await service.addPersona(user);
    expect(result).toBeDefined();
    expect(result.password).not.toEqual('Pass123');
  });

  it('should throw error for duplicate DNI', async () => {
    await expect(service.addPersona(duplicateUser)).rejects.toThrow();
  });
});
```

### 8.2 Pruebas de Integración

Usando **Postman** para validar flujos end-to-end:

**Flujo de prueba 1: Registro e Inicio de sesión**
1. POST /auth/register → Status 201 Created
2. POST /auth/login → Status 200 OK + JWT token
3. GET /persona (con JWT) → Status 200 OK

**Flujo de prueba 2: Reserva de cita**
1. GET /citas/disponibilidad/medico1-2025-12-15 → Horarios disponibles
2. POST /citas (crear reserva) → Status 201 Created
3. GET /citas/:id → Verificar cita creada

**Flujo de prueba 3: Historial clínico**
1. POST /historialclinico (crear entrada) → Status 201
2. GET /historialclinico (listar) → Paginado
3. PUT /historialclinico/:id (actualizar) → Status 200

### 8.3 Pruebas de Usabilidad

- Validar navegación intuitiva
- Confirmar accesibilidad WCAG 2.1
- Pruebas en múltiples navegadores
- Revisión responsive (móvil, tablet, desktop)

---

## 9. DESPLIEGUE

### 9.1 Estrategia de Despliegue

Se utiliza **Docker** para reproducibilidad y escalabilidad:

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./clinica-tfg
    ports:
      - "4200:4200"
    environment:
      - API_URL=http://localhost:3000

  backend:
    build: ./clinica-tfg-back
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/clinica
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=clinica
      - MYSQL_ROOT_PASSWORD=password
    volumes:
      - ./database:/var/lib/mysql
    ports:
      - "3307:3306"
```

### 9.2 Requisitos de Infraestructura

- **Servidor:** Ubuntu 18.04 LTS
- **Procesador:** Intel Core i5 (mínimo)
- **RAM:** 8GB (recomendado 16GB)
- **Almacenamiento:** 128GB SSD (mínimo)
- **Docker:** Versión 20.10+

### 9.3 Instrucciones de Instalación

```bash
# 1. Clonar repositorios
git clone https://github.com/usuario/clinica-tfg.git
git clone https://github.com/usuario/clinica-tfg-back.git

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores locales

# 3. Instalar dependencias
npm install (en ambas carpetas)

# 4. Crear base de datos
mysql -u root -p < database.sql

# 5. Iniciar desarrollo
npm start (frontend en 4200)
npm run start:dev (backend en 3000)

# O con Docker:
docker-compose up -d
```

---

## 10. CONCLUSIONES

### 10.1 Logros Alcanzados

✅ Se ha desarrollado una plataforma web completa y funcional para gestión de clínicas

✅ Implementación de autenticación segura con JWT y validaciones custom avanzadas

✅ Arquitectura escalable y mantenible con separación clara de capas

✅ Interfaz responsive y accesible con Angular + Ionic

✅ Multiidioma (español, inglés, portugués) plenamente operativo

✅ Integración con servicios externos (Google Places)

✅ Documentación técnica exhaustiva

### 10.2 Desafíos Encontrados y Solucionados

| Desafío | Solución |
|---------|----------|
| Validaciones complejas | Implementar validadores reutilizables custom |
| Sincronización BD | Usar TypeORM con relaciones tipadas |
| Autenticación segura | Implementar JWT + bcrypt + CORS |
| Responsive design | Ionic + Media queries + Flex layout |
| Gestión de errores | Manejador centralizado en backend |

### 10.3 Propuestas Futuras

- 🔜 **Notificaciones en tiempo real:** WebSockets para alertas de citas
- 🔜 **Videollamadas:** Telemedicina integrada
- 🔜 **Reportes PDF:** Exportación de historiales
- 🔜 **Sistema de pagos:** Integración Stripe/PayPal
- 🔜 **Analytics:** Dashboard con estadísticas
- 🔜 **Aplicación móvil nativa:** React Native o Flutter
- 🔜 **Machine Learning:** Predicción de no-shows

### 10.4 Valoración Personal

Este proyecto ha supuesto un reto significativo que ha consolidado mis conocimientos en:

- **Arquitecturas web modernas:** Cliente-servidor, microservicios
- **Full-stack development:** Desde frontend hasta BD
- **Metodologías:** Análisis de requisitos, diseño, implementación
- **DevOps:** Containerización y despliegue
- **Mejores prácticas:** SOLID, clean code, testing

La experiencia adquirida será fundamental para mi carrera profesional en ingeniería de software.

---

## 11. REFERENCIAS

[1] Angular Documentation. (2022). https://angular.io/

[2] Ionic Framework Documentation. (2022). https://ionicframework.com/

[3] NestJS Documentation. (2022). https://nestjs.com/

[4] TypeORM Documentation. (2022). https://typeorm.io/

[5] JWT.io. (2022). Introduction to JSON Web Tokens. https://jwt.io/introduction

[6] IEEE Std 830-1998. Software Requirements Specification Standard.

[7] MySQL Documentation. (2022). https://dev.mysql.com/doc/

[8] Express.js Documentation. (2022). https://expressjs.com/

[9] Angular Material Components. (2022). https://material.angular.io/

[10] Google Places API Documentation. (2022). https://developers.google.com/maps/documentation/places

---

## 12. ANEXOS

### Anexo A: Manual de Instalación Completo
### Anexo B: Guía de Usuario
### Anexo C: Diccionario de Términos Técnicos
### Anexo D: Capturas de pantalla de la aplicación
### Anexo E: Script SQL de base de datos
### Anexo F: Documentación API con Swagger

---

**Fin de la Memoria de TFG**

---

**Fecha de Compilación:** 23 de Septiembre de 2026
**Versión:** 1.0
**Estado:** Documento Completo
