# ClinicaTFG

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Instalación en otro ordenador

Consulta la [guía de instalación en otro PC](INFORMACION/GUIA_INSTALACION_OTRO_PC.md)
para configurar el frontend, el backend separado y la base de datos.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Sesión

El token de acceso se mantiene únicamente en memoria y se elimina cualquier
token antiguo de `sessionStorage` al iniciar. Al abrir o recargar la aplicación
se intenta restaurar la sesión con la cookie de renovación `HttpOnly`. Si no
es válida, se muestra la aplicación sin iniciar sesión; si el servidor falla,
se registra el error y se puede volver a intentar recargando. Esto no impide que
un ataque XSS activo acceda al token en memoria o realice acciones del usuario.

## Fotografías de servicios

Las fichas de servicios muestran fotografías locales con un marco centrado y
una proporción uniforme, adaptada al tamaño de la pantalla.

Las páginas principales adaptan su distribución a móvil y tableta. La agenda
semanal conserva desplazamiento horizontal para consultar todos los días en
pantallas estrechas. En Contacto se muestra la dirección y un mapa de Google
Maps en blanco y negro, cuya carga depende del servicio externo.

## Citas de pacientes

Tras iniciar sesión, «Citas de pacientes» permite buscar pacientes y consultar,
modificar o eliminar sus citas. Las citas nuevas se crean desde
«Administrar citas» en el encabezado. Los médicos solo pueden modificar o
eliminar sus propias citas; administración y recepción pueden gestionar las
citas de cualquier médico. En todos los casos,
el servidor comprueba los solapamientos tanto del médico como del paciente y
las vacaciones antes de guardar, incluso si las citas son con médicos distintos.
Las citas deben comenzar y terminar dentro del horario de apertura: lunes,
miércoles y viernes de 16:00 a 20:00; martes y jueves de 09:30 a 13:30.
Sábados y domingos están cerrados. Las vacaciones solo afectan a días
laborables, aunque su periodo pueda atravesar un fin de semana.
El formulario muestra horas de inicio libres cada 30 minutos para el médico,
el día y la duración elegidos y, cuando hay paciente seleccionado, excluye
también las horas que coinciden con sus otras citas. Los selectores de fecha
utilizan el formato DD/MM/AAAA. Las citas nuevas o modificadas solo admiten
duraciones de 30, 60 o 90 minutos. Las citas antiguas conservan su duración;
si esta es distinta, hay que escoger una duración permitida al editarlas.
La disponibilidad se vuelve a validar al guardar.
Las citas nuevas solo se pueden crear desde el día actual en adelante,
utilizando la fecha de la clínica en Madrid; las citas anteriores siguen
disponibles para su consulta y edición.
Desde «Administrar citas» se accede a una agenda semanal interactiva: el médico
consulta únicamente su propia agenda; administración y recepción seleccionan el
profesional. Se puede crear una cita pulsando un hueco libre de 30 minutos o
abrir una cita existente para modificarla. El formulario permite elegir otra
duración y vuelve a comprobar la disponibilidad.
El selector «Ir a la fecha» permite navegar directamente a cualquier semana.
La lista de profesionales se actualiza automáticamente al gestionar usuarios
y periódicamente para detectar cambios realizados desde otra sesión.
Administración y recepción pueden asignar servicios a un médico desde su
ficha en «Administrar usuarios». Una vez creado el médico, hay que abrir su
ficha y guardar los servicios que realiza. El formulario de citas solo ofrece
los servicios asignados al profesional seleccionado y el servidor vuelve a
comprobar la asignación al crear o editar. Si un médico no tiene servicios
asignados, no se pueden guardar citas nuevas para él. Las citas anteriores se
conservan al retirar una asignación, pero para editarlas hay que elegir un
servicio que siga asignado. Conviene revisar las asignaciones existentes antes
de activar esta versión.
Los pacientes se crean desde «Administrar usuarios». El médico puede crear y modificar
pacientes y modificar sus propios datos, sin eliminar usuarios. Recepción puede
crear, modificar y eliminar médicos y pacientes; administración puede gestionar
todos los roles. Los pacientes no administran usuarios, aunque conservan el
acceso a sus propios datos desde el perfil. El servidor comprueba los permisos
y el rol del usuario afectado.

Médicos y recepcionistas pueden gestionar sus propias vacaciones únicamente
desde «Mi perfil». No pueden modificar las vacaciones de otros usuarios; las
vacaciones de recepción no afectan a la disponibilidad de los médicos.
La eliminación de usuarios, citas y periodos de vacaciones, así como los
cambios de contraseña, requieren una confirmación antes de enviar la petición.
Cancelar la confirmación no realiza ningún cambio.

Al abrir una cita existente, «Abrir historial clínico» muestra las anotaciones
del paciente y permite vincular una nueva anotación a esa cita. Médicos y
administración pueden añadirlas; recepción puede consultarlas. Un médico puede
corregir o anular únicamente las anotaciones que haya creado; administración
puede hacerlo con cualquiera. Ambas operaciones requieren motivo y confirmación;
las versiones anteriores y las anotaciones anuladas se conservan. El paciente
puede consultar su propio historial desde el perfil. Solo médicos y administración
pueden consultar versiones anteriores, motivos y anotaciones anuladas; recepción
y pacientes ven únicamente anotaciones vigentes. El acceso se comprueba en
el servidor. Para estas funciones es necesario aplicar primero la migración
`005-historial-versiones-y-anulacion.sql` del backend, tras revisar y respaldar
la base de datos. No se aplica automáticamente.

La agenda permite navegar entre semanas y muestra las vacaciones. Las citas
antiguas sin hora o duración se identifican como incompletas; las que no tienen
fecha se indican sin asignarlas a un día.

Los pacientes pueden consultar sus propias citas, incluidas las pasadas, desde
«Mis citas» en su perfil. Esta vista es de consulta y no permite modificar ni
cancelar citas.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
