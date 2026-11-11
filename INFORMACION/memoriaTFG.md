UNIVERSITAT POLITÈCNICA DE VALÈNCIA
Grado en Ingeniería Informática
SISTEMA WEB DE GESTIÓN DE CLÍNICAS
Reserva de citas, historiales clínicos y gestión de usuarios
TRABAJO FIN DE GRADO
Autor	Alberto Hernández San Pedro
Tutor	Francisco Rodriguez Ballester
Universidad	Universitat Politècnica de València
Curso académico	2026-2027
Fecha de presentación	
Valencia · 2026
RESUMEN
Este Trabajo Fin de Grado presenta el análisis, diseño e implementación de una aplicación web para una clínica podológica. La solución contempla cuatro roles: administrador, médico, recepcionista y paciente. Centraliza la gestión de usuarios, servicios, citas, vacaciones profesionales e historiales clínicos mediante una arquitectura cliente-servidor. El frontend utiliza Angular 13.3 e Ionic 6; el backend se apoya en NestJS, TypeORM y MariaDB. La versión actual incorpora autenticación JWT, agenda semanal interactiva, comprobación de horario, vacaciones y solapamientos, permisos por rol, confirmaciones de operaciones sensibles, internacionalización y consulta de historiales. Se describen asimismo las limitaciones de la versión actual y las líneas de trabajo futuro.
Palabras clave: gestión clínica, aplicación web, Angular, Ionic, NestJS, MariaDB, API REST, JWT, RBAC, internacionalización.
ABSTRACT
This Final Degree Project presents the analysis, design and implementation of a web application for a podiatry clinic. The system supports administrator, doctor, receptionist and patient roles, and centralises users, services, appointments, holidays and medical records. The frontend is based on Angular 13.3 and Ionic 6, while the backend uses NestJS, TypeORM and MariaDB. The current version includes JWT authentication, an interactive weekly schedule, working-hour and conflict checks, role-based permissions, confirmation dialogs, internationalisation and medical record access. The report also describes the limitations of the current version and the lines of future work.
Keywords: clinic management, web application, Angular, Ionic, NestJS, MariaDB, REST API, JWT, RBAC, internationalisation.
ÍNDICE GENERAL
RESUMEN	1
ABSTRACT	1
DEFINICIONES, ABREVIATURAS Y ACRÓNIMOS	1
1. INTRODUCCIÓN	1
1.1 Contexto	1
1.2 Estado del arte	1
1.3 Motivación y justificación	1
1.4 Objetivo general	1
1.5 Estructura de la memoria	1
2. CONCEPTOS GENERALES	1
2.1 Gestión clínica	1
2.2 Arquitectura cliente-servidor	1
2.3 API REST	1
2.4 Autenticación y autorización	1
2.5 Historial clínico	1
2.6 Marco normativo y protección de datos	1
3. METODOLOGÍA	1
3.1 Análisis y especificación	1
3.2 Diseño	1
3.3 Implementación	1
3.4 Pruebas	1
3.5 Despliegue y mantenimiento	1
4. ANÁLISIS Y ESPECIFICACIÓN DE REQUISITOS	1
4.1 Ámbito del sistema	1
4.2 Actores y características	1
4.3 Requisitos funcionales	1
4.4 Requisitos no funcionales	1
5. CASOS DE USO	1
5.1 Alta de persona	1
5.2 Iniciar sesión	1
5.3 Cambiar contraseña propia	1
5.4 Editar perfil propio	1
5.5 Crear cita	1
5.6 Ver mis citas	1
5.7 Modificar cita	1
5.8 Eliminar cita	1
5.9 Gestionar vacaciones	1
5.10 Registrar anotación clínica	1
5.11 Consultar historial clínico	1
5.12 Administrar usuarios	1
5.13 Consultar servicios	1
5.14 Asignar especialidades	1
5.15 Filtrar historial	1
5.16 Editar anotación	1
5.17 Eliminar anotación	1
5.18 Consultar agenda	1
5.19 Consultar huecos	1
5.20 Confirmar operación sensible	1
5.21 Seleccionar semana	1
5.22 Consultar ubicación	1
5.23 Editar otra persona	1
5.24 Matriz de trazabilidad y estado	1
6. DISEÑO	1
6.1 Contexto del sistema	1
6.2 Casos de uso por rol	1
6.3 Modelo de dominio	1
6.4 Arquitectura por capas	1
6.5 Decisiones de diseño	1
6.6 Esquema lógico de datos	1
6.7 Diagramas de secuencia	1
7. TECNOLOGÍAS Y HERRAMIENTAS	1
8. IMPLEMENTACIÓN	1
8.1 Autenticación y sesión	1
8.2 Gestión de usuarios	1
8.3 Agenda, citas y disponibilidad	1
8.4 Historial clínico	1
8.5 Interfaz y contenido público	1
8.6 Inventario de endpoints actuales	1
9. PRUEBAS	1
9.1 Estado de validación	1
9.2 Estrategia de pruebas	1
9.3 Casos funcionales propuestos para regresión	1
9.4 Evidencias pendientes	1
10. DESPLIEGUE	1
10.1 Entorno local	1
10.2 Variables de configuración	1
11. CONCLUSIONES	1
11.1 Objetivos alcanzados	1
11.2 Limitaciones	1
11.3 Líneas futuras	1
11.4 Valoración personal	1
12. BIBLIOGRAFÍA	1
13. ANEXOS	1
Anexo A. Tabla de mejoras y estado	1
Anexo B. Instalación rápida	1
Anexo C. Validación de DNI	1
Anexo D. Estructura de evidencias	1

ÍNDICE DE FIGURAS Y TABLAS
Las tablas y las figuras se numeran de forma correlativa a lo largo de la memoria.
Índice de figuras
Ilustración 1. Diagrama de casos de uso de acceso y cuenta de usuario	1
Ilustración 2. Diagrama de casos de uso de gestión de usuarios	1
Ilustración 3. Diagrama de casos de uso de agenda, citas y vacaciones	1
Ilustración 4. Diagrama de casos de uso del historial clínico	1
Ilustración 5. Arquitectura por capas del sistema	1
Ilustración 6. Diagrama entidad-relación de la base de datos	1
Ilustración 7. Diagrama de secuencia del inicio de sesión	1
Ilustración 8. Diagrama de secuencia de la creación de una cita	1
Ilustración 9. Diagrama de secuencia del registro de una anotación clínica	1
Ilustración 10. Pantalla de inicio de sesión (captura de pantalla)	1
Ilustración 11. Agenda semanal (captura de pantalla)	1
Ilustración 12. Historial clínico de un paciente (captura de pantalla)	1
Ilustración 13. Páginas públicas de servicios y contacto (captura de pantalla)	1

Índice de tablas
Tabla 1. Categorías de soluciones para la gestión de clínicas y comparación con este proyecto	1
Tabla 2. Actores del sistema y responsabilidades principales	1
Tabla 3. Requisitos funcionales	1
Tabla 4. Requisitos no funcionales	1
Tabla 5. Plantilla de casos de uso	1
Tabla 6. Caso de uso CU-001: Alta de persona	1
Tabla 7. Caso de uso CU-002: Iniciar sesión	1
Tabla 8. Caso de uso CU-003: Cambiar contraseña propia	1
Tabla 9. Caso de uso CU-004: Editar perfil propio	1
Tabla 10. Caso de uso CU-005: Crear cita	1
Tabla 11. Caso de uso CU-006: Ver mis citas	1
Tabla 12. Caso de uso CU-007: Modificar cita	1
Tabla 13. Caso de uso CU-008: Eliminar cita	1
Tabla 14. Caso de uso CU-009: Gestionar vacaciones	1
Tabla 15. Caso de uso CU-010: Registrar anotación clínica	1
Tabla 16. Caso de uso CU-011: Consultar historial clínico	1
Tabla 17. Caso de uso CU-012: Administrar usuarios	1
Tabla 18. Caso de uso CU-013: Consultar servicios	1
Tabla 19. Caso de uso CU-014: Asignar especialidades	1
Tabla 20. Caso de uso CU-015: Filtrar historial	1
Tabla 21. Caso de uso CU-016: Editar anotación	1
Tabla 22. Caso de uso CU-017: Eliminar anotación	1
Tabla 23. Caso de uso CU-018: Consultar agenda	1
Tabla 24. Caso de uso CU-019: Consultar huecos	1
Tabla 25. Caso de uso CU-020: Confirmar operación sensible	1
Tabla 26. Caso de uso CU-021: Seleccionar semana	1
Tabla 27. Caso de uso CU-022: Consultar ubicación	1
Tabla 28. Caso de uso CU-023: Editar otra persona	1
Tabla 29. Matriz de trazabilidad entre requisitos, casos de uso y estado de implementación	1
Tabla 30. Entidades del dominio, responsabilidades y relaciones	1
Tabla 31. Esquema lógico de la base de datos	1
Tabla 32. Tecnologías y herramientas empleadas	1
Tabla 33. Permisos por rol sobre las operaciones principales	1
Tabla 34. Inventario de endpoints de la API	1
Tabla 35. Resultados de las comprobaciones de validación	1
Tabla 36. Casos funcionales propuestos para la regresión	1
Tabla 37. Variables de configuración	1
Tabla 38. Mejoras incorporadas y su estado	1
Tabla 39. Comandos de instalación y ejecución	1

DEFINICIONES, ABREVIATURAS Y ACRÓNIMOS
Término	Definición
API	Interfaz de programación de aplicaciones
CORS	Intercambio de recursos entre orígenes
CRUD	Creación, lectura, actualización y eliminación
CU	Caso de uso
DNI	Documento Nacional de Identidad
HTTP	Protocolo de transferencia de hipertexto
i18n	Internacionalización
JSON	Notación de objetos de JavaScript
JWT	JSON Web Token
LOPDGDD	Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales
ORM	Mapeo objeto-relacional
PK / FK	Clave primaria / clave foránea
RBAC	Control de acceso basado en roles
REST	Estilo arquitectónico basado en recursos
RF / RNF	Requisito funcional / requisito no funcional
RGPD	Reglamento General de Protección de Datos
SPA	Aplicación de página única
TFG	Trabajo Fin de Grado
UML	Lenguaje unificado de modelado
WCAG	Pautas de accesibilidad para el contenido web

1. INTRODUCCIÓN
1.1 Contexto
La transformación digital del sector sanitario exige coordinar de forma fiable pacientes, profesionales, servicios, agendas e información clínica. Cuando estas actividades se reparten entre papel, hojas de cálculo y herramientas no conectadas aparecen duplicidades, errores de registro, búsquedas lentas, baja trazabilidad y dificultades para escalar.
Este proyecto toma como caso de estudio una clínica podológica, en la que conviven cuatro perfiles de usuario (administración, personal médico, recepción y pacientes) y un horario de atención por franjas, con jornadas de tarde los lunes, miércoles y viernes y de mañana los martes y jueves. Coordinar de forma fiable esas agendas, evitar solapamientos entre citas y ausencias profesionales y mantener un historial clínico accesible solo para quien corresponde son los problemas que motivan el desarrollo de una aplicación web propia. Además, al tratarse de información de salud, la solución debe tener en cuenta el marco normativo de protección de datos descrito en el apartado 2.6.
1.2 Estado del arte
Las soluciones disponibles para la gestión de centros sanitarios pueden agruparse en tres categorías: los portales de reserva de citas, las suites clínicas empresariales y los servicios especializados en la nube. A ellas se añade la posibilidad de desarrollar una solución a medida, que es el enfoque adoptado en este proyecto. La Tabla 1 resume las ventajas y limitaciones de cada opción.
Categoría	Ventajas	Limitaciones
Portales de reserva de citas	Visibilidad del centro y facilidad para que el paciente solicite cita.	Orientados a la reserva; suelen cubrir de forma limitada la gestión interna de agendas, usuarios e historial clínico.
Suites clínicas empresariales	Funcionalidad amplia y soporte del proveedor.	Coste y complejidad de implantación; menor control sobre el modelo de datos y las reglas de negocio.
Servicios especializados en la nube	Puesta en marcha rápida y mantenimiento delegado en el proveedor.	Dependencia del proveedor y de su modelo de suscripción; los datos se alojan en infraestructura de terceros.
Solución a medida (este proyecto)	Reglas ajustadas a la clínica (horario, vacaciones, solapamientos) y control completo del modelo y de los datos.	Exige asumir el desarrollo, el mantenimiento y la seguridad; alcance funcional más reducido.
Tabla 1. Categorías de soluciones para la gestión de clínicas y comparación con este proyecto

El proyecto adopta una arquitectura cliente-servidor modular para separar interfaz, reglas de negocio y persistencia, conservando el control sobre el modelo de datos y las reglas de la clínica. Esta decisión permite, además, aplicar de forma realista los conocimientos adquiridos durante el grado.
1.3 Motivación y justificación
El proyecto permite aplicar de forma integrada análisis de requisitos, diseño, implementación full-stack, pruebas, seguridad, persistencia e internacionalización en un caso realista de gestión clínica. Desde el punto de vista profesional, permite abordar un problema real de gestión con los requisitos de seguridad y privacidad propios del ámbito sanitario.
1.4 Objetivo general
Diseñar e implementar una plataforma web funcional para gestionar usuarios, citas, disponibilidad profesional e información clínica mediante una interfaz clara y una API centralizada.
1.4.1 Objetivos específicos
Para alcanzar el objetivo general se plantean los siguientes objetivos específicos:
OE1	Definir los actores del sistema y el alcance del proyecto.
OE2	Especificar los requisitos funcionales y no funcionales.
OE3	Diseñar una arquitectura modular.
OE4	Modelar los datos.
OE5	Implementar la autenticación y los permisos por rol.
OE6	Integrar la gestión de citas y del historial clínico.
OE7	Incorporar la internacionalización de la interfaz (español, inglés y portugués).
OE8	Validar las funciones críticas.
OE9	Documentar las limitaciones y el trabajo pendiente.
1.5 Estructura de la memoria
La memoria se organiza en trece capítulos. El capítulo 1 presenta el contexto, la motivación y los objetivos; el 2 recoge los conceptos y el marco normativo necesarios; el 3 describe la metodología; los capítulos 4 y 5 contienen el análisis de requisitos y los casos de uso; el 6 expone el diseño; el 7 y el 8 describen las tecnologías empleadas y la implementación; el 9 se dedica a las pruebas y el 10 al despliegue; el 11 recoge las conclusiones, las limitaciones y las líneas futuras; el 12 la bibliografía y el 13 los anexos.
2. CONCEPTOS GENERALES
2.1 Gestión clínica
La gestión clínica integra procesos administrativos y asistenciales: la identificación de personas y roles, el catálogo de servicios, la planificación de agendas y citas, el control de las ausencias profesionales (vacaciones) y el registro del historial clínico. Un sistema de información de este tipo debe garantizar que cada dato esté disponible solo para quien corresponde y que las operaciones que afectan a la disponibilidad de los profesionales, como dar de alta una cita, respeten las reglas del centro.
2.2 Arquitectura cliente-servidor
En una arquitectura cliente-servidor, el cliente presenta la información y recoge las acciones del usuario, mientras que el servidor aplica las reglas de negocio, valida los permisos y persiste los datos; ambas capas intercambian JSON mediante HTTP. En este proyecto el cliente es una aplicación de página única (SPA) que se ejecuta en el navegador y que, una vez cargada, solo solicita datos a la API [1], [3]. Esta separación permite evolucionar la interfaz y la lógica de negocio de forma independiente y centralizar en el servidor las comprobaciones de seguridad, que no deben delegarse en el cliente.
2.3 API REST
Una API REST [9] organiza la funcionalidad en recursos identificados por rutas y manipulados mediante los métodos HTTP: GET para consultar, POST para crear, PUT para modificar y DELETE para eliminar. El resultado de cada operación se comunica mediante códigos de estado: 200 (correcto), 201 (recurso creado), 400 (petición no válida), 401 (no autenticado), 403 (sin permiso), 404 (no encontrado) y 409 (conflicto con el estado actual del recurso, como un solapamiento de citas).
2.4 Autenticación y autorización
La autenticación identifica al usuario; en este proyecto se realiza mediante DNI y contraseña, y el servidor emite un token JWT [6]. Un JWT es una cadena compacta que contiene afirmaciones, como la identidad del usuario y la fecha de caducidad, firmadas con una clave secreta del servidor (JWT_SECRET), de modo que este puede comprobar su validez sin mantener el estado de la sesión. La autorización determina qué operaciones puede realizar el usuario autenticado: se aplica un control de acceso basado en roles (RBAC), completado con comprobaciones de identidad y de propiedad del recurso; por ejemplo, un paciente solo puede consultar su propio historial.
2.5 Historial clínico
El historial clínico agrupa las anotaciones asociadas a un paciente, al profesional que las redacta, al servicio prestado y, opcionalmente, a una cita. La Ley 41/2002 [13] lo define, en esencia, como el conjunto de documentos con los datos, valoraciones e informaciones sobre la situación y la evolución clínica de un paciente. Su acceso exige especial atención a la privacidad, la trazabilidad y la conservación.
2.6 Marco normativo y protección de datos
Los datos de salud pertenecen a las categorías especiales de datos personales del Reglamento General de Protección de Datos (RGPD) [11], cuyo tratamiento exige garantías reforzadas. En España, el RGPD se complementa con la Ley Orgánica 3/2018 (LOPDGDD) [12], y la historia clínica y los derechos de información y acceso del paciente se regulan en la Ley 41/2002, de autonomía del paciente [13].
De este marco se derivan requisitos que el sistema debe atender: confidencialidad y minimización del acceso (permisos por rol e identidad), integridad y trazabilidad de las anotaciones, almacenamiento seguro de las credenciales y conservación de la documentación clínica durante los plazos legales. La Ley 41/2002 establece, con carácter general, un mínimo de cinco años de conservación desde la fecha de alta de cada proceso asistencial.
Este trabajo es un proyecto académico y no se ha sometido a una evaluación de cumplimiento normativo ni a un análisis de impacto sobre la protección de datos. Por ello, la versión actual no debe utilizarse con datos reales de pacientes (véase el apartado 11.2).
3. METODOLOGÍA
Se adopta una metodología secuencial con ciclos de refinamiento, adecuada para un proyecto individual con un alcance definido. El trabajo se organiza en fases (análisis, diseño, implementación, pruebas y despliegue) y cada módulo las recorre antes de integrarse en el conjunto, de modo que los resultados de las pruebas retroalimentan el diseño y la implementación. Como apoyo se emplean Git y GitHub para el control de versiones y Postman para la comprobación manual de la API.
3.1 Análisis y especificación
•	Identificación de actores y alcance
•	Definición de requisitos funcionales y no funcionales
•	Casos de uso con flujos principales y alternativos
3.2 Diseño
•	Arquitectura por capas
•	Modelo de dominio y esquema relacional
•	Diseño de componentes e interfaces
3.3 Implementación
•	Módulos backend
•	Vistas y servicios frontend
•	Integración de autenticación, citas e historial
3.4 Pruebas
•	Pruebas unitarias focalizadas
•	Pruebas de integración
•	Pruebas funcionales y revisión manual
3.5 Despliegue y mantenimiento
•	Variables de entorno
•	Migraciones controladas
•	Copias de seguridad y revisión de seguridad
4. ANÁLISIS Y ESPECIFICACIÓN DE REQUISITOS
4.1 Ámbito del sistema
El sistema cubre autenticación, perfil, usuarios, catálogo de servicios, agenda, citas, vacaciones e historial. Quedan fuera pagos, receta electrónica, firma digital, videoconferencia, interoperabilidad pública, aplicaciones nativas y reserva autónoma del paciente. La reserva de citas por parte del propio paciente se contempla como línea futura (apartado 11.3).
4.2 Actores y características
El sistema distingue cuatro roles autenticados (administrador, médico, recepcionista y paciente) y el visitante, que accede a la información pública sin autenticarse. El administrador dispone del mayor alcance de gestión, pero no de todos los flujos exclusivos de otros roles. El detalle de los permisos se recoge en la Tabla 33 (apartado 8.2).
Actor	Responsabilidades principales
Administrador	Gestiona usuarios de todos los roles, citas y agenda de todos los médicos, asignaciones de servicios e historial clínico.
Médico	Gestiona su agenda, sus citas, su horario y sus vacaciones (solo las de su propio usuario), así como los pacientes y las anotaciones clínicas.
Recepcionista	Gestiona citas, médicos y pacientes; consulta el historial, y la agenda y las vacaciones de todos los médicos; gestiona sus propias vacaciones.
Paciente	Consulta citas e historial propios y edita su perfil.
Visitante	Consulta información pública, servicios, contacto e inicio de sesión.
Tabla 2. Actores del sistema y responsabilidades principales

4.3 Requisitos funcionales
Los requisitos se identifican con los códigos RF (funcionales) y RNF (no funcionales) y se han redactado siguiendo las recomendaciones de la norma IEEE 830-1998 [8] y de su sucesora, ISO/IEC/IEEE 29148:2018 [14].
Código	Requisito	Prioridad	Descripción
RF-001	Registrar usuario	Alta	Personal autorizado crea usuarios; DNI no duplicado.
RF-002	Autenticar usuario	Alta	Login con JWT de acceso almacenado en memoria.
RF-003	Renovar sesión	Alta	El token de acceso se renueva mediante una cookie HttpOnly y una sesión revocable de siete días.
RF-004	Gestionar perfil	Media	Actualizar datos personales y correo.
RF-005	Foto de perfil	Retirado	No forma parte de la versión actual.
RF-006	Cambiar contraseña	Media	Cambio con confirmación y almacenamiento mediante hash; las contraseñas antiguas se convierten al iniciar sesión.
RF-007	Domicilio	Retirado	No forma parte del modelo actual.
RF-008	Crear servicio	Alta	No implementado; solo se dispone de consulta del catálogo (CU-013).
RF-009	Modificar servicio	Media	Pendiente.
RF-010	Eliminar servicio	Media	Pendiente.
RF-011	Asignar especialidades	Alta	Administración y recepción asignan los servicios que puede realizar cada médico; las citas solo se guardan con servicios asignados.
RF-012	Horario de clínica	Alta	Lunes, miércoles y viernes de 16:00 a 20:00; martes y jueves de 09:30 a 13:30.
RF-013	Gestionar vacaciones	Media	Médico y recepción gestionan solo las propias; recepción y administración pueden consultar las vacaciones médicas en la agenda.
RF-014	Comprobar disponibilidad	Alta	Horario, vacaciones y conflictos de médico y paciente.
RF-015	Crear cita	Alta	Personal autorizado desde agenda.
RF-016	Ver citas propias	Alta	Paciente consulta citas pasadas y futuras.
RF-017	Modificar cita	Media	Permisos por rol; 30, 60 o 90 minutos.
RF-018	Eliminar cita	Alta	Requiere confirmación.
RF-019	Crear anotación clínica	Alta	Médico o administrador; cita opcional.
RF-020	Consultar historial	Alta	Acceso según rol e identidad.
RF-021	Modificar historial	Media	Médico: anotaciones propias; administrador: cualquiera. Motivo obligatorio y conservación de versiones.
RF-022	Eliminar historial	Baja	Anulación sin borrado físico por el autor médico o por administración, con motivo y trazabilidad.
RF-023	Crear usuario por rol	Alta	Alcance distinto para admin, médico y recepción.
RF-024	Listar usuarios	Alta	Búsqueda y alcance por rol.
RF-025	Editar usuario	Media	Permisos sobre roles y cuentas afectadas.
RF-026	Eliminar usuario	Media	Admin o recepción dentro de su alcance.
RF-027	Navegar agenda	Media	Semana por fecha y actualización automática.
RF-028	Confirmar acciones	Alta	Eliminar usuario, cita, vacaciones y cambiar contraseña.
RF-029	Formato de fecha	Media	DD/MM/AAAA en interfaz; ISO en API.
RF-030	Fotografías de servicios	Media	Imágenes locales 16:9 sin vídeo.
RF-031	Consultar ubicación	Media	Dirección y mapa externo en contacto.
Tabla 3. Requisitos funcionales

4.4 Requisitos no funcionales
Los requisitos no funcionales abordan la seguridad, el rendimiento, la usabilidad, la accesibilidad (conforme a las pautas WCAG 2.1 [7]), la portabilidad y la mantenibilidad. En la columna de descripción se indica, cuando procede, el estado actual de cada requisito.
Código	Categoría	Descripción y estado
RNF-001	Seguridad	Contraseñas con hash seguro; objetivo no satisfecho actualmente.
RNF-002	Autenticación	JWT válido en operaciones protegidas.
RNF-003	Autorización	Comprobación de rol e identidad.
RNF-004	CORS	Orígenes permitidos controlados.
RNF-005	Datos sensibles	No exponer secretos ni contraseñas.
RNF-006	Rendimiento	Medición reproducible pendiente.
RNF-007	Base de datos	Índices y revisión de esquema.
RNF-008	Usabilidad	Navegación coherente y errores claros.
RNF-009	Accesibilidad	Evaluación WCAG 2.1 AA pendiente.
RNF-010	Responsive	Pruebas completas pendientes.
RNF-011	Mantenibilidad	Módulos con responsabilidades delimitadas.
RNF-012	Documentación	API y código documentados.
RNF-013	Portabilidad	Docker reproducible pendiente de validación.
RNF-014	Navegadores	Matriz cross-browser pendiente.
RNF-015	Auditoría	Registro completo de operaciones pendiente.
RNF-016	Trazabilidad de datos	Aplicación global de la baja lógica y de las marcas de tiempo pendiente de verificar.
RNF-017	Validación	Validación backend independiente del cliente.
RNF-018	Errores	Tratamiento sin exponer detalles internos.
Tabla 4. Requisitos no funcionales

5. CASOS DE USO
En este capítulo se detallan los requisitos funcionales del sistema mediante casos de uso, que describen el comportamiento de la aplicación desde la perspectiva de cada actor. Para cada caso de uso se ha definido una plantilla con las características que recoge la Tabla 5.
Nombre del caso de uso
Descripción	Explicación breve del propósito de la funcionalidad.
Actor	Entidad (rol o usuario) que realiza la acción descrita por el caso de uso.
Relaciones	Vínculos con otros casos de uso: inclusión, extensión o dependencia.
Precondición	Condiciones que deben cumplirse antes de ejecutar el caso de uso.
Secuencia	Pasos, en orden, que componen el flujo normal de la funcionalidad.
Postcondición	Estado en el que queda el sistema tras ejecutar correctamente la secuencia.
Comentarios	Observaciones, restricciones y requisitos asociados que conviene tener en cuenta.
Tabla 5. Plantilla de casos de uso
Los casos de uso se agrupan por área funcional: acceso y cuenta de usuario (Ilustración 1), gestión de usuarios (Ilustración 2), agenda, citas y vacaciones (Ilustración 3) e historial clínico (Ilustración 4). Desde la Tabla 6 hasta la Tabla 28 se especifica cada caso de uso según la plantilla anterior. Los permisos dependen del caso y de la identidad del actor; el médico solo accede a su propia agenda, mientras que recepcionista y administrador pueden consultar las agendas de los médicos. Las funcionalidades CU-014, CU-016 y CU-017 se han incorporado al código; el historial requiere aplicar la migración correspondiente antes de utilizar las nuevas operaciones. El estado de validación se recoge en 5.24 y 9.1.
 
Ilustración 1. Diagrama de casos de uso de acceso y cuenta de usuario
 
Ilustración 2. Diagrama de casos de uso de gestión de usuarios
 
Ilustración 3. Diagrama de casos de uso de agenda, citas y vacaciones
 
Ilustración 4. Diagrama de casos de uso del historial clínico
5.1 Alta de persona
CU-001: Alta de persona
Descripción	Crear una cuenta de usuario dentro del alcance permitido a cada rol.
Actor	Administrador, médico y recepcionista
Relaciones	Relacionado con CU-012 y CU-023.
Precondición	Estar autenticado con un perfil con permiso de creación (el administrador puede crear todos los roles, el médico pacientes y recepción médicos y pacientes).
Secuencia	1. Rellenar los datos de la persona (DNI, nombre, apellidos, teléfono, correo y rol).
2. Pulsar el botón de guardar.
3. El servidor valida el DNI, el correo y el rol, y comprueba que la operación está autorizada.
Postcondición	Si los datos son válidos y la operación está autorizada, la cuenta se almacena en la base de datos; en caso contrario se comunica el error.
Comentarios	El servidor comprueba si el DNI ya existe (RF-001) y valida su longitud, pero no verifica la letra ni cuenta con una garantía de unicidad ante altas simultáneas. La validación del formato en la interfaz no sustituye a la del servidor.
Tabla 6. Caso de uso CU-001: Alta de persona

5.2 Iniciar sesión
CU-002: Iniciar sesión
Descripción	Autenticar al usuario mediante DNI y contraseña.
Actor	Todos los usuarios registrados
Relaciones	-
Precondición	Disponer de una cuenta dada de alta en el sistema.
Secuencia	1. Introducir el DNI y la contraseña.
2. Pulsar el botón de inicio de sesión.
3. El servidor valida las credenciales y devuelve un token JWT.
4. El cliente guarda el token e inicia la sesión.
Postcondición	Si las credenciales son correctas, se inicia la sesión y se muestra la interfaz correspondiente al rol; en caso contrario se informa del error.
Comentarios	El token de acceso se almacena en memoria y caduca a los quince minutos; una cookie HttpOnly permite renovarlo hasta siete días (RF-002 y RF-003).
Tabla 7. Caso de uso CU-002: Iniciar sesión

5.3 Cambiar contraseña propia
CU-003: Cambiar contraseña propia
Descripción	Actualizar la contraseña de la cuenta propia.
Actor	Todos los roles
Relaciones	Incluye CU-020 (confirmación de operación sensible).
Precondición	Estar autenticado.
Secuencia	1. Abrir el perfil.
2. Introducir la contraseña actual y la nueva, y confirmar la nueva.
3. Confirmar la operación en el diálogo de confirmación.
4. Enviar el formulario.
Postcondición	La contraseña queda actualizada si los datos son válidos.
Comentarios	Las contraseñas se almacenan actualmente sin cifrar (RF-006; véase el apartado 11.2).
Tabla 8. Caso de uso CU-003: Cambiar contraseña propia

5.4 Editar perfil propio
CU-004: Editar perfil propio
Descripción	Modificar los datos personales de la cuenta propia.
Actor	Todos los roles
Relaciones	-
Precondición	Estar autenticado.
Secuencia	1. Abrir el perfil.
2. Modificar el nombre, los apellidos, el DNI, el teléfono o el correo.
3. Guardar los cambios.
Postcondición	El perfil queda actualizado.
Comentarios	Los datos se validan siempre en el servidor (RNF-017).
Tabla 9. Caso de uso CU-004: Editar perfil propio

5.5 Crear cita
CU-005: Crear cita
Descripción	Crear una cita a partir de un hueco libre de la agenda.
Actor	Administrador, médico y recepcionista
Relaciones	Incluye CU-019 (consultar huecos). Se inicia desde CU-018.
Precondición	Estar autenticado con un perfil con permiso sobre citas y existir el paciente y el servicio.
Secuencia	1. Seleccionar el profesional (cuando proceda), el paciente y el servicio.
2. Elegir la duración (30, 60 o 90 minutos), la fecha y la hora entre los huecos libres.
3. Pulsar el botón de guardar.
4. El servidor valida los permisos, el horario, las vacaciones y los solapamientos.
Postcondición	Si no existe conflicto, la cita queda guardada y visible en la agenda; en caso contrario se informa del motivo.
Comentarios	La fecha de una cita nueva no puede ser anterior a la actual. El médico gestiona solo sus citas; recepcionista y administrador gestionan las de cualquier médico (apartado 8.2).
Tabla 10. Caso de uso CU-005: Crear cita

5.6 Ver mis citas
CU-006: Ver mis citas
Descripción	Consultar las citas propias, tanto pasadas como futuras.
Actor	Paciente
Relaciones	-
Precondición	Estar autenticado como paciente.
Secuencia	1. Abrir el perfil.
2. Acceder a la sección «Mis citas».
Postcondición	Se muestra el listado de citas propias en modo consulta.
Comentarios	El paciente no puede crear, modificar ni eliminar citas desde esta pantalla. El personal consulta las citas mediante las vistas de gestión correspondientes.
Tabla 11. Caso de uso CU-006: Ver mis citas

5.7 Modificar cita
CU-007: Modificar cita
Descripción	Reprogramar una cita existente dentro de los permisos del rol.
Actor	Administrador, médico y recepcionista
Relaciones	Incluye CU-019 (consultar huecos).
Precondición	Estar autenticado con un perfil con permiso sobre la cita y existir la cita.
Secuencia	1. Abrir la cita desde la agenda.
2. Cambiar los datos necesarios.
3. Guardar los cambios.
4. El servidor vuelve a comprobar la disponibilidad, excluyendo la propia cita del cálculo de conflictos.
Postcondición	La cita queda actualizada si no existe conflicto.
Comentarios	Las duraciones admitidas son 30, 60 y 90 minutos (RF-017). El médico modifica solo sus citas; recepcionista y administrador, las de cualquier médico.
Tabla 12. Caso de uso CU-007: Modificar cita

5.8 Eliminar cita
CU-008: Eliminar cita
Descripción	Eliminar una cita existente dentro de los permisos del rol.
Actor	Administrador, médico y recepcionista
Relaciones	Incluye CU-020 (confirmación de operación sensible).
Precondición	Estar autenticado con un perfil con permiso sobre la cita y existir la cita.
Secuencia	1. Seleccionar la cita.
2. Solicitar su eliminación.
3. Confirmar la operación en el diálogo de confirmación.
Postcondición	La cita se elimina si los permisos son válidos.
Comentarios	La eliminación requiere confirmación (RF-018 y RF-028). El médico elimina solo sus citas; recepcionista y administrador, las de cualquier médico.
Tabla 13. Caso de uso CU-008: Eliminar cita

5.9 Gestionar vacaciones
CU-009: Gestionar vacaciones
Descripción	Registrar o eliminar los periodos de vacaciones propios.
Actor	Médico y recepcionista
Relaciones	Incluye CU-020 al eliminar un periodo. Relacionado con CU-018.
Precondición	Estar autenticado como médico o recepcionista.
Secuencia	1. Acceder a la gestión de vacaciones.
2. Indicar el periodo, que debe incluir al menos un día laborable, y guardarlo; o bien seleccionar un periodo existente y eliminarlo confirmando la operación.
Postcondición	El periodo queda guardado o eliminado.
Comentarios	Médico y recepción gestionan solo sus propias vacaciones (RF-013); administración y recepción pueden consultar las vacaciones médicas en la agenda (CU-018). Las vacaciones médicas bloquean los huecos; las de recepción no afectan a la agenda médica.
Tabla 14. Caso de uso CU-009: Gestionar vacaciones

5.10 Registrar anotación clínica
CU-010: Registrar anotación clínica
Descripción	Añadir una anotación al historial clínico de un paciente.
Actor	Médico y administrador
Relaciones	Relacionado con CU-011.
Precondición	Estar autenticado como médico o administrador y existir el paciente.
Secuencia	1. Abrir el historial del paciente desde una cita.
2. Redactar la anotación.
3. Guardarla.
4. El servidor obtiene el autor a partir de la sesión y comprueba la coherencia entre paciente, servicio y cita.
Postcondición	La anotación queda asociada al paciente, al autor, al servicio y, opcionalmente, a la cita.
Comentarios	El médico autor y el administrador pueden corregir o anular la anotación con motivo y trazabilidad (RF-021 y RF-022; CU-016 y CU-017).
Tabla 15. Caso de uso CU-010: Registrar anotación clínica

5.11 Consultar historial clínico
CU-011: Consultar historial clínico
Descripción	Mostrar las anotaciones del historial según el rol y la identidad del usuario.
Actor	Administrador, médico, recepcionista y paciente
Relaciones	Es extendido por CU-015 (filtrar historial).
Precondición	Estar autenticado.
Secuencia	1. Abrir el historial.
2. Aplicar, si se desea, los filtros disponibles.
3. Ordenar las anotaciones por fecha.
Postcondición	Se muestra el historial al que el usuario tiene acceso.
Comentarios	El paciente solo accede a su propio historial; recepción dispone de acceso de consulta; el administrador accede a todos los historiales. Solo médicos y administración pueden consultar anotaciones anuladas, versiones anteriores y motivos; recepción y pacientes ven únicamente anotaciones vigentes (apartado 8.4).
Tabla 16. Caso de uso CU-011: Consultar historial clínico

5.12 Administrar usuarios
CU-012: Administrar usuarios
Descripción	Crear, editar o eliminar cuentas de usuario según el rol.
Actor	Administrador, médico y recepcionista
Relaciones	Incluye CU-001 y CU-023; incluye CU-020 al eliminar.
Precondición	Estar autenticado con un perfil con permiso de gestión de usuarios.
Secuencia	1. Buscar a la persona.
2. Ejecutar la operación deseada (crear, editar o eliminar).
3. El servidor valida los permisos sobre la cuenta afectada.
Postcondición	Los datos quedan actualizados o se comunica el error.
Comentarios	La eliminación de usuarios corresponde al administrador y a recepción dentro de su alcance (RF-026).
Tabla 17. Caso de uso CU-012: Administrar usuarios

5.13 Consultar servicios
CU-013: Consultar servicios
Descripción	Consultar el catálogo de servicios de la clínica y sus fotografías.
Actor	Visitante y usuarios
Relaciones	-
Precondición	Ninguna.
Secuencia	1. Acceder a la página de servicios.
2. Abrir una categoría o el detalle de un servicio.
Postcondición	Se muestra la información del servicio.
Comentarios	Las fotografías son imágenes locales con contenedor 16:9, sin vídeo (RF-030).
Tabla 18. Caso de uso CU-013: Consultar servicios

5.14 Asignar especialidades
CU-014: Asignar especialidades
Descripción	Asignar o retirar los servicios que puede realizar cada médico.
Actor	Administrador y recepcionista
Relaciones	Condiciona la selección del servicio en CU-005 y CU-007.
Precondición	Usuario autorizado y médico existente.
Secuencia	1. Abrir la ficha del médico desde la administración de usuarios.
2. Seleccionar uno o varios servicios, o retirar los que ya no correspondan.
3. Guardar la selección; el servidor comprueba el rol y la validez de los servicios.
Postcondición	Las asignaciones del médico quedan actualizadas; no se modifican citas existentes.
Comentarios	Las citas nuevas o editadas requieren un servicio asignado al médico. Si no tiene ninguno, no puede recibir nuevas citas. Una cita anterior se conserva al retirar su asignación, pero no puede guardarse una edición hasta seleccionar un servicio asignado (RF-011).
Tabla 19. Caso de uso CU-014: Asignar especialidades

5.15 Filtrar historial
CU-015: Filtrar historial
Descripción	Filtrar las anotaciones del historial por profesional o servicio.
Actor	Administrador, médico, recepcionista y paciente
Relaciones	Extiende CU-011.
Precondición	Estar autenticado y haber abierto un historial.
Secuencia	1. Abrir el historial.
2. Aplicar los criterios de filtrado.
Postcondición	Se muestra la vista filtrada dentro del alcance autorizado.
Comentarios	-
Tabla 20. Caso de uso CU-015: Filtrar historial

5.16 Editar anotación
CU-016: Editar anotación
Descripción	Corregir una anotación existente sin perder su versión anterior.
Actor	Médico autor de la anotación o administrador.
Relaciones	Relacionado con CU-011 y CU-020.
Precondición	Sesión autorizada, anotación activa existente y migración del historial aplicada.
Secuencia	1. Abrir la anotación autorizada y modificar el texto.
2. Indicar el motivo de la corrección y confirmar la operación.
3. El servidor comprueba la identidad y conserva la versión previa con el autor y la fecha del cambio.
Postcondición	La anotación queda corregida y se mantiene el registro de la modificación.
Comentarios	El médico no puede editar anotaciones de otro autor; administración puede editar cualquier anotación. Recepción y paciente no pueden editar (RF-021).
Tabla 21. Caso de uso CU-016: Editar anotación

5.17 Eliminar anotación
CU-017: Eliminar anotación
Descripción	Anular una anotación del historial sin borrarla físicamente.
Actor	Médico autor de la anotación o administrador.
Relaciones	Incluye CU-020; relacionado con CU-011.
Precondición	Sesión autorizada, anotación activa existente y migración del historial aplicada.
Secuencia	1. Seleccionar la anotación autorizada.
2. Indicar el motivo y confirmar la anulación.
3. El servidor comprueba el permiso y registra el usuario, la fecha y el motivo.
Postcondición	La anotación queda anulada y conservada junto con su trazabilidad.
Comentarios	El médico solo anula sus anotaciones; administración puede anular cualquiera. Recepción y paciente no pueden anular (RF-022). La conservación implementada no equivale por sí sola a una evaluación legal completa.
Tabla 22. Caso de uso CU-017: Eliminar anotación

5.18 Consultar agenda
CU-018: Consultar agenda
Descripción	Visualizar la semana con las citas, las vacaciones y los huecos libres.
Actor	Administrador, médico y recepcionista
Relaciones	Incluye CU-021. Desde ella se inician CU-005, CU-007 y CU-008.
Precondición	Estar autenticado con un perfil con acceso a la agenda.
Secuencia	1. Abrir la agenda.
2. Elegir el profesional (recepcionista y administrador); el médico accede directamente a su propia agenda.
3. Navegar por las semanas.
Postcondición	Se muestra la agenda de la semana seleccionada.
Comentarios	El médico solo consulta su propia agenda, horario y vacaciones; recepcionista y administrador pueden consultar los de todos los médicos. La agenda incorpora desplazamiento horizontal para pantallas estrechas.
Tabla 23. Caso de uso CU-018: Consultar agenda

5.19 Consultar huecos
CU-019: Consultar huecos
Descripción	Obtener los comienzos libres para una fecha, un profesional y una duración.
Actor	Administrador, médico y recepcionista
Relaciones	Es incluido por CU-005 y CU-007.
Precondición	Estar autenticado con un perfil con acceso a la agenda y haber indicado fecha, profesional y duración.
Secuencia	1. Solicitar los huecos indicando fecha, profesional y duración.
2. El servidor aplica el horario de la clínica, las vacaciones y los conflictos del profesional.
Postcondición	Se devuelve la lista de comienzos posibles, cada 30 minutos.
Comentarios	El médico solo consulta los huecos de su propia agenda. El procedimiento de cálculo se describe en el apartado 8.3.
Tabla 24. Caso de uso CU-019: Consultar huecos

5.20 Confirmar operación sensible
CU-020: Confirmar operación sensible
Descripción	Pedir confirmación al usuario antes de ejecutar una operación que no se puede deshacer fácilmente.
Actor	Usuario con permiso
Relaciones	Es incluido por CU-003, CU-008, CU-009 y CU-012.
Precondición	Haber iniciado una operación sensible.
Secuencia	1. Mostrar el diálogo de confirmación.
2. Confirmar o cancelar la operación.
Postcondición	La petición solo se envía al servidor después de confirmar.
Comentarios	Afecta a la eliminación de usuarios, citas y vacaciones y al cambio de contraseña (RF-028).
Tabla 25. Caso de uso CU-020: Confirmar operación sensible

5.21 Seleccionar semana
CU-021: Seleccionar semana
Descripción	Saltar directamente a una semana concreta de la agenda.
Actor	Administrador, médico y recepcionista
Relaciones	Es incluido por CU-018.
Precondición	Estar en la agenda.
Secuencia	1. Elegir una fecha con formato DD/MM/AAAA.
2. La aplicación recalcula el lunes de esa semana.
Postcondición	La semana seleccionada queda visible.
Comentarios	Una de las pruebas automatizadas del selector de fecha falla actualmente (apartado 9.1).
Tabla 26. Caso de uso CU-021: Seleccionar semana

5.22 Consultar ubicación
CU-022: Consultar ubicación
Descripción	Mostrar la dirección y el mapa de la clínica.
Actor	Visitante y usuarios
Relaciones	-
Precondición	Ninguna.
Secuencia	1. Abrir la página de Contacto.
2. Se muestra la dirección y se carga el mapa si el servicio externo responde.
Postcondición	La dirección es visible y el mapa se muestra de forma opcional.
Comentarios	El mapa depende del servicio externo Google Maps (RF-031).
Tabla 27. Caso de uso CU-022: Consultar ubicación

5.23 Editar otra persona
CU-023: Editar otra persona
Descripción	Modificar la cuenta de otra persona según los permisos del rol.
Actor	Administrador, médico y recepcionista
Relaciones	Extiende CU-012.
Precondición	Estar autenticado con permiso sobre la cuenta afectada.
Secuencia	1. Seleccionar a la persona.
2. Editar los campos necesarios.
3. Guardar los cambios.
4. El servidor valida el rol de la cuenta afectada.
Postcondición	La cuenta queda actualizada si la operación está autorizada.
Comentarios	Los permisos dependen del rol del usuario y del rol de la cuenta afectada (RF-025).
Tabla 28. Caso de uso CU-023: Editar otra persona

5.24 Matriz de trazabilidad y estado
Requisito	Casos de uso	Estado	Límite principal
RF-001	CU-001, CU-012	I	Personal autorizado crea usuarios; DNI no duplicado.
RF-002	CU-002	I	Login con JWT almacenado en memoria.
RF-003	CU-002	I	Renovación con cookie HttpOnly y sesión revocable de duración máxima siete días.
RF-004	CU-004	I	Actualizar datos personales y correo.
RF-005	Retirado	R	No forma parte de la versión actual.
RF-006	CU-003, CU-020	I	Cambio con confirmación y hash; los valores anteriores se migran tras el inicio de sesión.
RF-007	Retirado	R	No forma parte del modelo actual.
RF-008	CU-013 (consulta)	N	No implementado; solo se dispone de consulta del catálogo (CU-013).
RF-009	CU-013 (consulta)	N	Pendiente.
RF-010	CU-013 (consulta)	N	Pendiente.
RF-011	CU-014	I	Administración y recepción asignan servicios por médico; citas nuevas y editadas requieren una asignación válida.
RF-012	CU-005, CU-018, CU-019	I	Lunes, miércoles y viernes de 16:00 a 20:00; martes y jueves de 09:30 a 13:30.
RF-013	CU-009	I	Médico y recepción gestionan solo las propias; recepción y administración consultan las médicas en la agenda.
RF-014	CU-005, CU-018, CU-019	I	Horario, vacaciones y conflictos de médico y paciente.
RF-015	CU-005	I	Personal autorizado desde agenda.
RF-016	CU-006	I	Paciente consulta citas pasadas y futuras.
RF-017	CU-007	I	Permisos por rol; 30, 60 o 90 minutos.
RF-018	CU-008, CU-020	I	Requiere confirmación.
RF-019	CU-010	I	Médico o administrador; cita opcional.
RF-020	CU-011, CU-015	I	Acceso según rol e identidad.
RF-021	CU-016	I	Médico autor o administrador; motivo y versiones conservadas; requiere migración.
RF-022	CU-017	I	Anulación con motivo y trazabilidad por médico autor o administrador; requiere migración.
RF-023	CU-001, CU-012	I	Alcance distinto para admin, médico y recepción.
RF-024	CU-012	I	Búsqueda y alcance por rol.
RF-025	CU-004, CU-012, CU-023	I	Permisos sobre roles y cuentas afectadas.
RF-026	CU-012, CU-020	I	Admin o recepción dentro de su alcance.
RF-027	CU-018, CU-021	P	Semana por fecha y actualización automática.
RF-028	CU-003, CU-008, CU-009, CU-012, CU-020	I	Eliminar usuario, cita, vacaciones y cambiar contraseña.
RF-029	CU-005, CU-007, CU-009, CU-021	P	DD/MM/AAAA en interfaz; ISO en API.
RF-030	CU-013	I	Imágenes locales 16:9 sin vídeo.
RF-031	CU-022	I	Dirección y mapa externo en contacto.
Tabla 29. Matriz de trazabilidad entre requisitos, casos de uso y estado de implementación

Leyenda
I = implementado en el alcance descrito; P = parcial o sin validación suficiente; N = no implementado; R = retirado.
6. DISEÑO
6.1 Contexto del sistema
Los cuatro perfiles autenticados y el visitante interactúan con el frontend. El frontend consume la API principal, el backend aplica las reglas de negocio y accede a MariaDB. Google Maps se utiliza únicamente para la visualización pública del mapa de contacto. La Ilustración 5 muestra la arquitectura general del sistema.
6.2 Casos de uso por rol
El paciente consulta información propia; el médico gestiona su agenda, sus pacientes y las anotaciones clínicas; recepción coordina las citas y los usuarios operativos; y administración dispone del mayor alcance de gestión. Los diagramas de casos de uso por rol se presentan en el capítulo 5 (Ilustración 1 a Ilustración 4). El caso de uso CU-020 (confirmación de operaciones sensibles) se aplica de forma transversal a las operaciones de eliminación y de cambio de contraseña.
6.3 Modelo de dominio
Las entidades centrales son Persona, Rol, Servicio, Vacaciones, Cita, HistorialClinico y MedicoHasServicio. La Tabla 30 describe la responsabilidad y las relaciones de cada entidad, y la Ilustración 6 muestra su traducción al esquema relacional. Un mismo registro de Persona puede actuar como paciente o como profesional según su rol, por lo que las citas y las anotaciones clínicas referencian a la tabla de personas en dos papeles distintos.
6.4 Arquitectura por capas
La capa de presentación se implementa como una SPA con Angular 13.3 e Ionic 6, que incluye las vistas, los servicios de acceso a la API, un interceptor que añade el token JWT a las peticiones protegidas y ngx-translate para los idiomas español, inglés y portugués. La lógica de aplicación y la API se implementan con NestJS, que organiza el backend en módulos; la autenticación se resuelve con Passport/JWT y los permisos se comprueban en el servidor. TypeORM gestiona la persistencia relacional sobre MariaDB. El único servicio externo es Google Maps, empleado en la página de contacto.
 
Ilustración 5. Arquitectura por capas del sistema
6.5 Decisiones de diseño
Las principales decisiones de diseño son las siguientes:
•	Separar presentación, reglas de negocio y datos para poder evolucionar cada capa de forma independiente.
•	Comprobar la autorización en el servidor (RNF-003 y RNF-017): las validaciones del cliente mejoran la experiencia de uso, pero pueden eludirse y no sustituyen al control de acceso.
•	Exigir confirmación en la interfaz para las operaciones sensibles (RF-028), con el fin de evitar acciones accidentales.
•	Representar a todas las personas en una única entidad con rol, de modo que un mismo modelo sirve para pacientes, médicos, recepción y administración.
•	Vincular el historial clínico opcionalmente a una cita, para poder registrar anotaciones que no se originen en una cita concreta.
Entidad	Responsabilidad	Relaciones
Persona	Identidad, perfil y rol	Citas como paciente o médico; anotaciones como paciente o autor
Rol	Clasificación de permisos	Persona
Servicio	Prestación clínica	Citas, historial y asociaciones
Vacaciones	Ausencias profesionales	Persona
Cita	Atención programada	Paciente, médico, servicio e historial opcional
HistorialClinico	Anotación clínica	Paciente, autor, servicio y cita opcional
MedicoHasServicio	Asociación profesional-servicio	Persona y servicio
Tabla 30. Entidades del dominio, responsabilidades y relaciones

6.6 Esquema lógico de datos
La Tabla 31 recoge el esquema lógico de la base de datos MariaDB y la Ilustración 6 su diagrama entidad-relación. Las claves primarias (PK) identifican cada registro y las claves foráneas (FK) expresan las relaciones entre tablas. El campo idRolNativo de la tabla persona referencia el rol de cada persona.
Tabla	Campos principales
persona	idPersona, dni, nombre, apellidos, teléfono, email, password, idRolNativo
servicio	idServicio, servicio
vacaciones_medico	idVacacion, idMedico, fechaInicio, fechaFin
cita	idCita, fecha, hora, duración, idCliente, idMedico, idServicio, historial (campo heredado)
historialclinico	idHistorialClinico, comentarios, fecha, hora, idCliente, idMedico, idServicio, idCita opcional
medico_has_servicio	idPersona, idServicio
Tabla 31. Esquema lógico de la base de datos

La tabla cita conserva un campo de historial heredado de una versión anterior del modelo; el historial clínico vigente se gestiona en la tabla historialclinico, que se vincula opcionalmente a una cita mediante idCita.
 
Ilustración 6. Diagrama entidad-relación de la base de datos
6.7 Diagramas de secuencia
Los diagramas de secuencia siguientes describen la interacción entre el usuario, el frontend, el backend y la base de datos en tres flujos representativos: el inicio de sesión (Ilustración 7), la creación de una cita (Ilustración 8) y el registro de una anotación clínica (Ilustración 9).
 
Ilustración 7. Diagrama de secuencia del inicio de sesión
 
Ilustración 8. Diagrama de secuencia de la creación de una cita
 
Ilustración 9. Diagrama de secuencia del registro de una anotación clínica
7. TECNOLOGÍAS Y HERRAMIENTAS
Área	Tecnología	Uso
Frontend	Angular 13.3	Estructura modular y componentes
Frontend	Ionic 6.7.5	Interfaz adaptable
Frontend	ngx-translate 14	Español, inglés y portugués
Frontend	RxJS 7.5	Flujos reactivos y servicios
Backend	NestJS 9.4	API modular en TypeScript
Backend	TypeORM 0.3	Mapeo de entidades y acceso a datos
Backend	Passport/JWT	Autenticación y sesión
Datos	MariaDB	Persistencia relacional
Herramientas	Git y GitHub	Control de versiones
Herramientas	Postman	Pruebas manuales de API
Herramientas	Jest / Karma / Jasmine	Pruebas automatizadas
Servicios externos	Google Maps	Mapa de la página de Contacto
Despliegue	Docker	Propuesta pendiente de validación
Tabla 32. Tecnologías y herramientas empleadas

La elección de las tecnologías responde a los siguientes criterios:
•	Angular e Ionic: Angular proporciona la estructura de la SPA basada en componentes y servicios [1], e Ionic aporta componentes de interfaz adaptables a distintos tamaños de pantalla [2].
•	NestJS: framework de TypeScript que organiza el backend en módulos, comparte lenguaje con el frontend e integra la autenticación con Passport y JWT [3].
•	TypeORM y MariaDB: mapeo de entidades y base de datos relacional de código abierto [4], [5], adecuada para datos con integridad referencial (personas, citas e historial).
•	ngx-translate: permite ofrecer la interfaz en español, inglés y portugués sin duplicar vistas [10].
•	Jest, Karma y Jasmine: herramientas de pruebas habituales en los ecosistemas de NestJS y Angular, respectivamente.
Las versiones empleadas (Angular 13.3, Ionic 6.7.5 y NestJS 9.4) no son las más recientes; su actualización se contempla como línea futura (apartado 11.3).
8. IMPLEMENTACIÓN
8.1 Autenticación y sesión
POST /auth/login recibe DNI y contraseña. Si son válidos, devuelve un JWT de acceso de quince minutos y una cookie HttpOnly de renovación. El cliente conserva el JWT solo en memoria; al abrir o recargar la aplicación intenta restaurar la sesión con la cookie. El interceptor renueva y reintenta tras una respuesta 401. Cada renovación sustituye el token de renovación y conserva su hash anterior. Durante cinco segundos el predecesor inmediato puede recuperar el mismo token sucesor si sigue vigente, sin iniciar otra rotación. Fuera de ese margen o si ya hay otro sucesor, la reutilización revoca la familia; la duración máxima sigue siendo siete días desde el inicio. El sucesor se deriva mediante HMAC-SHA-256 con JWT_SECRET, sin almacenar el token en claro. El navegador coordina renovación y cierre entre pestañas mediante Web Locks cuando está disponible. GET /auth/me recupera identidad y rol. El cierre de sesión revoca la familia en el servidor; un JWT ya emitido sigue siendo válido hasta su caducidad. La Ilustración 7 (apartado 6.7) muestra el flujo anterior y requiere actualizarse.
Limitación crítica
Las contraseñas nuevas o modificadas se almacenan con bcrypt sobre un resumen SHA-256. Las existentes se convierten después del primer inicio de sesión correcto, por lo que las cuentas que aún no hayan iniciado sesión y las copias anteriores pueden contener contraseñas en texto plano. Deben protegerse las copias y revisarse las rutas protegidas antes de cualquier uso real.
El inicio de sesión valida el formato de la solicitud y limita a cinco los intentos fallidos por cuenta y dirección IP en una ventana de quince minutos; Helmet añade cabeceras HTTP de seguridad. El límite se mantiene en memoria del proceso, se pierde al reiniciar y no se comparte entre instancias; para un despliegue público hace falta una solución compartida y una configuración explícita de proxies de confianza.

[Insertar aquí una captura de la pantalla de inicio de sesión]
Ilustración 10. Pantalla de inicio de sesión (captura de pantalla)
8.2 Gestión de usuarios
El administrador gestiona todos los roles. El médico crea y modifica pacientes, pero no elimina usuarios. Recepción crea, modifica y elimina médicos y pacientes. El paciente edita únicamente su propio perfil.
El servidor valida la forma de la solicitud, longitudes y tipos del documento, nombre, apellidos, rol, correo y teléfono antes de guardar. Se aceptan formatos antiguos de documento y no se verifica la letra del DNI. El teléfono se almacena como entero con máximo 2147483647, por lo que no se conservan ceros iniciales ni se admiten números internacionales largos. La validación de otros endpoints sigue pendiente de revisión sistemática.
En la asignación de servicios, el servidor valida que los identificadores del médico y de los servicios estén dentro del rango entero sin signo de la base de datos, que la lista no contenga duplicados y que las entidades existan antes de sustituir las asignaciones.
La Tabla 33 resume los permisos de cada rol sobre las operaciones principales. Las comprobaciones de las operaciones descritas se aplican en el servidor; la interfaz no sustituye al control de acceso. La autorización global requiere una revisión de seguridad adicional.
Operación	Administrador	Médico	Recepcionista	Paciente
Consultar y editar el perfil propio	Sí	Sí	Sí	Sí
Crear usuarios	Todos los roles	Pacientes	Médicos y pacientes	—
Modificar usuarios	Todos los roles	Pacientes	Médicos y pacientes	Solo su perfil
Eliminar usuarios	Todos los roles	—	Médicos y pacientes	—
Consultar agenda, horario y vacaciones	De todos los médicos	Solo los propios	De todos los médicos	—
Crear, modificar y eliminar citas	De cualquier médico	Solo las propias	De cualquier médico	—
Consultar «Mis citas»	—	—	—	Sí
Gestionar vacaciones	—	Propias	Propias	—
Registrar anotaciones clínicas	Sí	Sí	—	—
Editar o anular anotaciones	Cualquiera	Solo las propias	—	—
Asignar servicios a médicos	Sí	—	Sí	—
Consultar el historial clínico	Sí	Sí	Sí (solo consulta)	Solo el propio
Consultar versiones anteriores y anotaciones anuladas	Sí	Sí	—	—
Tabla 33. Permisos por rol sobre las operaciones principales

8.3 Agenda, citas y disponibilidad
•	Agenda semanal con navegación entre semanas y salto por fecha.
•	Horario común: lunes, miércoles y viernes de 16:00 a 20:00; martes y jueves de 09:30 a 13:30.
•	Duraciones admitidas: 30, 60 y 90 minutos.
•	Comprobación de vacaciones, solapamiento del médico y solapamiento del paciente.
•	Las citas nuevas no pueden ser anteriores a la fecha actual de Europe/Madrid.
•	Al editar se excluye la propia cita del cálculo de conflictos.
•	Al crear o editar, el servicio debe estar asignado al médico; retirar una asignación no modifica las citas existentes.
•	Las solicitudes de citas, disponibilidad y vacaciones comprueban tipos y límites de identificadores antes de operar; los parámetros de ruta malformados y cuerpos inválidos se rechazan con error 400.
Cálculo de huecos y comprobación de conflictos
Para consultar los huecos libres (CU-019), el cliente envía a POST /citas/huecos la fecha, el profesional y la duración deseada. El servidor calcula los comienzos posibles de la siguiente forma:
1.	Obtiene la franja de atención del día según el horario común de la clínica; si el día no tiene franja, no hay huecos.
2.	Descarta el día completo si el profesional tiene registradas unas vacaciones que lo incluyan.
3.	Genera los comienzos candidatos cada 30 minutos dentro de la franja, de modo que la cita termine antes del cierre (comienzo + duración ≤ cierre).
4.	Elimina los candidatos que se solapan con otras citas del profesional.
La comprobación definitiva se realiza en el servidor al crear o modificar una cita (POST /citas/disponibilidad y operaciones sobre /citas), donde se añade la verificación de que el paciente no tenga otra cita solapada y de que la fecha no sea anterior a la actual en Europe/Madrid. Al editar, la propia cita se excluye del cálculo de conflictos. El procedimiento se resume en el siguiente pseudocódigo:
función huecos(fecha, médico, duración):
    franja = horarioClínica(díaSemana(fecha))
    si franja no existe o médicoDeVacaciones(médico, fecha):
        devolver []
    citas = citasDelMédico(médico, fecha)
    resultado = []
    para inicio desde franja.apertura hasta franja.cierre - duración, cada 30 min:
        fin = inicio + duración
        si ninguna cita c cumple (inicio < c.fin y c.inicio < fin):
            resultado.añadir(inicio)
    devolver resultado

[Insertar aquí una captura de la agenda semanal con citas, vacaciones y huecos libres]
Ilustración 11. Agenda semanal (captura de pantalla)
8.4 Historial clínico
Desde una cita existente se abre el historial del paciente. Médico y administrador pueden añadir anotaciones; recepción consulta; el paciente solo accede al suyo. El servidor obtiene el autor de la sesión y comprueba la coherencia de paciente, servicio y cita. Un médico puede corregir o anular sus anotaciones y administración las de cualquier autor, con confirmación y motivo. Se conserva la versión anterior con usuario, fecha y motivo, y la anulación no borra físicamente la anotación. Solo médicos y administración pueden consultar las versiones anteriores y las anotaciones anuladas; recepción y pacientes ven únicamente anotaciones vigentes. Antes de utilizar esta versión debe revisarse y aplicarse la migración 005-historial-versiones-y-anulacion.sql después de la 004, con copia de seguridad; no se aplica automáticamente. La Ilustración 9 (apartado 6.7) describe el flujo de registro de una anotación.
La migración 008 incorpora un registro de consultas, altas, ediciones y anulaciones, incluidos los intentos denegados por permisos de usuarios autenticados. Conserva usuario, rol, operación, resultado, fecha UTC e identificadores disponibles, sin texto clínico. Las escrituras autorizadas y su evento se guardan en la misma transacción; solo administración puede consultar el registro mediante la API o desde la cabecera. No se registran intentos sin autenticar ni errores de validación y no hay eliminación automática. Es necesario definir medidas de protección y retención tras una evaluación legal y de seguridad.
Las solicitudes del historial validan la forma del cuerpo, los identificadores positivos dentro del rango de la base de datos y la longitud de los comentarios y motivos antes de iniciar una escritura. La paginación de auditoría valida el rango entero de 64 bits sin convertir el cursor a número JavaScript.
[Insertar aquí una captura del historial clínico de un paciente]
Ilustración 12. Historial clínico de un paciente (captura de pantalla)
8.5 Interfaz y contenido público
•	Interfaz disponible en español, inglés y portugués mediante ngx-translate [10].
•	Fechas con formato DD/MM/AAAA en la interfaz e ISO en la API (RF-029).
•	Fotografías locales de servicios con contenedor 16:9.
•	Página Contacto con dirección y mapa externo en escala de grises.
•	Diseño adaptable en encabezado, pie, inicio, clínica, personal, contacto y servicios.
•	Desplazamiento horizontal deliberado en la agenda para pantallas estrechas.

[Insertar aquí una captura de la página de servicios y de la página de contacto]
Ilustración 13. Páginas públicas de servicios y contacto (captura de pantalla)
8.6 Inventario de endpoints actuales
Método	Ruta	Función
POST	/auth/login	Autenticación
GET	/auth/me	Identidad y rol
GET/POST	/persona	Listado y alta según permisos
PUT	/persona/:id	Modificación según rol
DELETE	/persona/:id	Eliminación autorizada
GET	/citas/agenda	Agenda semanal
GET	/citas/mis-citas	Citas del paciente autenticado
POST	/citas/huecos	Cálculo de disponibilidad
POST	/citas/disponibilidad	Comprobación de conflictos
POST/PUT/DELETE	/citas	Gestión de citas
GET/POST/DELETE	/medicos/:id/vacaciones	Vacaciones propias
GET	/historialclinico/paciente/:id	Historial autorizado
GET	/historialclinico/cita/:id	Contexto de cita
POST	/historialclinico	Crear anotación
PATCH	/historialclinico/:id	Editar anotación con motivo y conservar versión anterior
POST	/historialclinico/:id/anular	Anular anotación con motivo sin borrado físico
GET	/historialclinico/auditoria	Consultar eventos del historial, solo administración; paginación con antes
PUT	/medico_has_servicio/:id	Asignar servicios a un médico (administración y recepción)
POST	/photos/upload	Subida de archivos; sin uso en la interfaz actual
Tabla 34. Inventario de endpoints de la API

9. PRUEBAS
9.1 Estado de validación
La validación del sistema combina el análisis de código, la compilación, pruebas automatizadas focalizadas, comprobaciones locales y observación manual. La Tabla 35 distingue las comprobaciones anteriores de las focalizadas sobre los nuevos casos; no equivalen a una auditoría de seguridad, a una medición de cobertura integral ni a la validación completa de todos los roles, navegadores y dispositivos.
Comprobación	Resultado y límite
Backend global, ejecución anterior	14 de 15 suites y 144 pruebas aprobadas; el comando global terminó con error por app.controller.spec.ts. No se repitió como validación global de los cambios nuevos.
Frontend focalizado, ejecución anterior	7 pruebas aprobadas y 1 fallida; el selector esperaba 03/02/2031 y recibió cadena vacía.
Citas y asignaciones, 11/11/2026	11 suites y 91 pruebas backend focalizadas aprobadas.
Historial, 11/11/2026	2 suites y 20 pruebas backend focalizadas aprobadas, incluidas reglas de acceso y trazabilidad.
Interfaz de historial, citas y ficha de usuario, 11/11/2026	37 pruebas focalizadas aprobadas en Brave Headless.
Compilación, 11/11/2026	Compilación del backend y compilaciones de desarrollo y producción del frontend completadas.
Renovación de sesión, 11/11/2026	62 pruebas focalizadas de backend y 6 de frontend aprobadas; se comprobaron en la API local la cookie HttpOnly, la renovación y la revocación. No constituye una auditoría de seguridad.
Rotación de renovación, 11/11/2026	34 pruebas focalizadas de backend y 7 de frontend aprobadas. En MariaDB aislada se verificaron migración, reutilización, concurrencia, aislamiento de sesiones y rollback; la rotación y revocación también se comprobaron en la API local. No constituye una auditoría de seguridad.
Recuperación de renovación, 11/11/2026	37 pruebas focalizadas de backend y 9 de frontend aprobadas. En MariaDB aislada se comprobaron el margen, las peticiones simultáneas y la revocación; la recuperación y su caducidad también se comprobaron en la API local. No constituye una auditoría de seguridad.
Validación de agenda, 11/11/2026	136 pruebas focalizadas de backend aprobadas, incluidas solicitudes HTTP con identificadores y cuerpos inválidos, y regresiones de permisos, horario y disponibilidad. Las pruebas HTTP utilizan autenticación y base de datos simuladas.
Validación del historial, 11/11/2026	48 pruebas focalizadas de backend y 11 de frontend aprobadas; se comprobaron límites, solicitudes HTTP inválidas, permisos y auditoría con autenticación y base de datos simuladas en las pruebas HTTP.
Token de acceso en memoria, 11/11/2026	Pruebas focalizadas de inicialización, renovación e inicio de sesión; en navegador se comprobó la restauración de la cabecera tras recargar con una respuesta de renovación simulada y la ausencia del token en sessionStorage y localStorage. La simulación no acredita una prueba de integración completa ni una auditoría de seguridad.
Auditoría del historial, 11/11/2026	25 pruebas focalizadas backend aprobadas; verificación con MariaDB aislada de operaciones, denegaciones, roles y rollback; comprobación de accesos permitido y denegado en la API local.
Base de datos, ejecución anterior	Escritura y lectura de anotación vinculada dentro de transacción revertida; no valida la migración 005 ni las nuevas operaciones.
Migración 005, 11/11/2026	Probada con datos sintéticos en una base aislada y aplicada después en la base local tras una copia de seguridad de historialclinico. Se comprobó que sus dos anotaciones se conservan y que la consulta del historial del paciente de prueba responde a administrador y paciente.
Responsive	Revisión focalizada a 320, 375, 768 y 1280 px; quedan estados y pantallas pendientes.
Mapa	Visible en Brave local; carga abortada en visor integrado de VS Code.
Tabla 35. Resultados de las comprobaciones de validación

En la ejecución global anterior del backend se superaron 14 de las 15 suites y 144 pruebas; el error procedía de app.controller.spec.ts. En la ejecución anterior focalizada del frontend, una de las ocho pruebas falló porque el selector de fecha devolvió una cadena vacía en lugar de 03/02/2031, lo que afecta al requisito de formato de fecha (RF-029). Ambos fallos permanecen como trabajo pendiente (apartado 9.4).
9.2 Estrategia de pruebas
•	Pruebas unitarias para reglas aisladas.
•	Pruebas de integración para API y persistencia.
•	Pruebas funcionales por caso de uso y rol.
•	Pruebas manuales para interfaz, responsive y servicios externos.
•	Registro de evidencias, fecha, entorno y resultado reproducible.
9.3 Casos funcionales propuestos para regresión
La Tabla 36 define los casos funcionales de regresión por escenario y objetivo. Su ejecución sistemática por rol queda pendiente (apartado 9.4).
ID	Escenario	Objetivo
PF-01	Login válido	JWT y sesión
PF-02	Credenciales inválidas	Rechazo 401
PF-03	Crear cita válida	Alta y disponibilidad
PF-04	Conflicto de franja	Rechazo por solapamiento
PF-05	Consulta de historial	Permisos y filtros
PF-06	Acceso no autorizado	Rechazo 403
PF-07	Archivo inválido	Tipo y tamaño
PF-08	Cambio de idioma	ES/EN/PT
PF-09	Domicilio retirado	Ausencia de campo
PF-10	Diseño móvil	Controles y desplazamiento
PF-11	Listar usuarios	Alcance por rol
PF-12	Crear usuario	Validaciones
PF-13	Cambiar contraseña	Confirmación y almacenamiento
PF-14	Listar servicios	Consulta pública
PF-15	Relaciones médico-servicio	Lectura
PF-16	Modificar cita	Revalidación
PF-17	Crear anotación	Autor y vínculo
PF-18	Editar historial	Permisos, motivo y conservación de versión anterior
PF-19	Anular historial	Permisos, motivo y conservación sin borrado físico
Tabla 36. Casos funcionales propuestos para la regresión

9.4 Evidencias pendientes
•	Capturas reales con fecha y versión de la aplicación.
•	Matriz de pruebas extremo a extremo por rol.
•	Benchmark reproducible de rendimiento.
•	Auditoría de seguridad y protección de datos.
•	Prueba real de despliegue Docker.
•	Matriz de navegadores e idiomas.
10. DESPLIEGUE
El funcionamiento local se ha comprobado con frontend en el puerto 4200, backend en el 3000 y MariaDB. Docker se mantiene como propuesta de despliegue pendiente de validación.
10.1 Entorno local
1.	Preparar MariaDB y revisar el script de inicialización.
2.	Configurar la conexión del backend y aplicar migraciones de forma controlada.
3.	Definir JWT_SECRET fuera del repositorio.
4.	Ejecutar npm install y npm run start:dev en el backend.
5.	Ejecutar npm install y npm start en el frontend.
6.	Acceder a http://localhost:4200 y verificar la API en el puerto 3000.
Precaución
Las instrucciones de Docker, eliminación de volúmenes y migraciones no deben ejecutarse sobre datos existentes sin copia de seguridad y revisión previa.
10.2 Variables de configuración
Variable	Finalidad
JWT_SECRET	Firma de tokens
DATABASE_HOST	Servidor de base de datos
DATABASE_PORT	Puerto de MariaDB
DATABASE_USER	Usuario de conexión
DATABASE_PASSWORD	Credencial fuera del repositorio
DATABASE_NAME	Esquema de trabajo
CORS_ORIGIN	Origen autorizado del frontend
Tabla 37. Variables de configuración

11. CONCLUSIONES
11.1 Objetivos alcanzados
Se resume a continuación el grado de consecución de los objetivos específicos planteados en el apartado 1.4.1:
•	Arquitectura cliente-servidor modular (OE3).
•	Autenticación JWT y recuperación de identidad (OE5).
•	Gestión de usuarios y perfiles con correo electrónico (OE5).
•	Agenda semanal y citas con reglas de horario, vacaciones y conflictos (OE6).
•	Permisos diferenciados para administrador, médico, recepción y paciente (OE5).
•	Historial clínico vinculado opcionalmente a citas (OE6).
•	Internacionalización y mejoras de presentación adaptable (OE7).
Los objetivos OE1, OE2 y OE4 se desarrollan en los capítulos 4 a 6; el objetivo OE8 se ha cubierto de forma parcial (capítulo 9) y el OE9 se recoge en los apartados 9.4 y 11.2.
11.2 Limitaciones
•	Las contraseñas antiguas se convierten a hash al iniciar sesión; hasta entonces pueden permanecer en texto plano, al igual que en copias de seguridad anteriores.
•	Las modificaciones y anulaciones clínicas requieren aplicar la migración del historial; la trazabilidad implementada no sustituye una auditoría de seguridad ni una evaluación legal.
•	La gestión del catálogo de servicios se limita a su consulta (RF-008 a RF-010); sí se pueden asignar servicios existentes a médicos (RF-011).
•	El JWT de acceso se almacena solo en memoria, pero un ataque XSS activo aún podría acceder a él o actuar como el usuario. La renovación rotatoria exige HTTPS y una revisión adicional antes de producción. El margen de cinco segundos mejora la recuperación ante una respuesta perdida, pero también permite que quien posea el token anterior obtenga el nuevo durante ese intervalo. El cliente reintenta una vez tras un error de red; si llega tarde, tras otra rotación o tras cambiar JWT_SECRET, puede revocarse una sesión legítima. Sin Web Locks persisten riesgos por respuestas simultáneas. No hay limpieza automática de sesiones caducadas.
•	El despliegue con Docker no se ha validado.
•	No se ha realizado una auditoría completa de seguridad, privacidad, accesibilidad ni rendimiento, ni se ha evaluado el cumplimiento del RGPD.
•	La validación responsive y entre navegadores es incompleta.
•	Persisten una suite de backend y una prueba de frontend con resultado fallido (apartado 9.1).
•	Las versiones de Angular, Ionic y NestJS empleadas no son las más recientes.
11.3 Líneas futuras
•	Hashing seguro y migración de credenciales.
•	Revisión integral de autorización y auditoría.
•	Notificaciones por correo o SMS.
•	Exportación PDF de documentos autorizados.
•	Cuadros de mando y estadísticas.
•	Pagos, firma electrónica y videoconsulta como evolución posterior.
•	Reserva de citas por parte del propio paciente.
•	Revisión de la renovación de sesión para despliegue público y actualización de las dependencias del proyecto.
•	Evaluación del cumplimiento del RGPD y de la LOPDGDD antes de cualquier uso con datos reales.
11.4 Valoración personal
El proyecto ha permitido integrar competencias de análisis, desarrollo full-stack, persistencia, pruebas, seguridad y documentación. La principal lección es la necesidad de separar claramente lo diseñado, lo implementado y lo validado mediante evidencia reproducible.
12. BIBLIOGRAFÍA
[1]	Angular, documentación oficial. [En línea] [fecha de consulta: 10 de noviembre de 2026]. Disponible en https://angular.dev
[2]	Ionic Framework, documentación oficial. [En línea] [fecha de consulta: 10 de noviembre de 2026]. Disponible en https://ionicframework.com/docs
[3]	NestJS, documentación oficial. [En línea] [fecha de consulta: completar]. Disponible en https://docs.nestjs.com
[4]	TypeORM, documentación oficial. [En línea] [fecha de consulta: completar]. Disponible en https://typeorm.io
[5]	MariaDB Server, documentación. [En línea] [fecha de consulta: 10 de noviembre de 2026]. Disponible en https://mariadb.com/docs/server/
[6]	JONES, M., BRADLEY, J. y SAKIMURA, N. JSON Web Token (JWT), RFC 7519. IETF, mayo de 2015. [En línea] [fecha de consulta: completar]. Disponible en https://www.rfc-editor.org/rfc/rfc7519
[7]	W3C. Web Content Accessibility Guidelines (WCAG) 2.1. Recomendación del W3C, 2018. [En línea] [fecha de consulta: completar]. Disponible en https://www.w3.org/TR/WCAG21/
[8]	IEEE Recommended Practice for Software Requirements Specifications, IEEE Std 830-1998.
[9]	Microsoft REST API Guidelines. [En línea] [fecha de consulta: completar]. Disponible en https://github.com/microsoft/api-guidelines
[10]	ngx-translate, documentación. [En línea] [fecha de consulta: 10 de noviembre de 2026]. Disponible en https://ngx-translate.org
[11]	Reglamento (UE) 2016/679, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales (RGPD). DOUE L 119, 4 de mayo de 2016. [En línea] [fecha de consulta: completar]. Disponible en https://eur-lex.europa.eu/eli/reg/2016/679/oj
[12]	Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales. BOE n.º 294, 6 de diciembre de 2018. [En línea] [fecha de consulta: completar]. Disponible en https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
[13]	Ley 41/2002, de 14 de noviembre, básica reguladora de la autonomía del paciente y de derechos y obligaciones en materia de información y documentación clínica. BOE n.º 274, 15 de noviembre de 2002. [En línea] [fecha de consulta: completar]. Disponible en https://www.boe.es/buscar/act.php?id=BOE-A-2002-22188
[14]	ISO/IEC/IEEE 29148:2018. Systems and software engineering. Life cycle processes. Requirements engineering.
13. ANEXOS
Anexo A. Tabla de mejoras y estado
ID	Área	Mejora	Estado
M-01	Agenda	Semana interactiva y salto por fecha	Implementado (véase M-11)
M-02	Citas	Duraciones 30/60/90	Implementado
M-03	Citas	Conflicto de paciente y médico	Implementado
M-04	Usuarios	Permisos detallados por rol	Implementado
M-05	Vacaciones	Gestión exclusivamente propia	Implementado
M-06	Historial	Vínculo opcional con cita	Implementado
M-07	Seguridad	Hash de contraseñas	Pendiente crítico
M-08	Servicios	Fotografías locales 16:9	Implementado
M-09	Contacto	Mapa externo y dirección	Implementado con dependencia
M-10	Responsive	Ajustes de páginas principales	Parcialmente validado
M-11	Fechas	DD/MM/AAAA e ISO	Parcial; una prueba falla
M-12	Confirmación	Operaciones sensibles	Implementado
M-13	Trazabilidad	Matriz RF-CU-pruebas	Documentado
M-14	Pruebas	Ejecuciones focalizadas	Realizadas con límites
M-15	Docker	Despliegue reproducible	Pendiente
Tabla 38. Mejoras incorporadas y su estado

Anexo B. Instalación rápida
Los pasos previos (base de datos, variables de entorno y migraciones) se describen en el apartado 10.1. Una vez preparados, los comandos de instalación y ejecución son los siguientes:
Componente	Comandos	Puerto
Backend	npm install
npm run start:dev	3000
Frontend	npm install
npm start	4200
Tabla 39. Comandos de instalación y ejecución
Tras arrancar ambos componentes, la aplicación está disponible en http://localhost:4200 y la API en el puerto 3000.
Anexo C. Validación de DNI
La letra del DNI se obtiene mediante el resto de dividir el número entre 23 y consultar la secuencia TRWAGMYFPDXBNJZSQVHLCKE. Por ejemplo, para el número 12345678 el resto es 14 y la letra correspondiente es Z.
Anexo D. Estructura de evidencias
Las evidencias de validación se organizan en el repositorio del proyecto en las siguientes carpetas:
/evidencias/capturas
/evidencias/pruebas-backend
/evidencias/pruebas-frontend
/evidencias/base-datos
/evidencias/rendimiento
/evidencias/despliegue
