# ClinicaTFG

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

## Instalación en otro ordenador

Consulta la [guía de instalación en otro PC](INFORMACION/GUIA_INSTALACION_OTRO_PC.md)
para configurar el frontend, el backend separado y la base de datos.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Citas de pacientes

Tras iniciar sesión, el acceso «Citas de pacientes» permite buscar pacientes.
El médico puede crear citas para sí mismo; administración y recepción pueden
consultar, crear y modificar citas con cualquier médico. En todos los casos,
el servidor comprueba los solapamientos y las vacaciones antes de guardar.
Las citas deben comenzar y terminar dentro del horario de apertura: lunes,
miércoles y viernes de 16:00 a 20:00; martes y jueves de 09:30 a 13:30.
Sábados y domingos están cerrados. Las vacaciones solo afectan a días
laborables, aunque su periodo pueda atravesar un fin de semana.
El formulario muestra horas de inicio libres cada 30 minutos para el médico,
el día y la duración elegidos. La disponibilidad se vuelve a validar al guardar.
Desde «Administrar citas» se accede a una agenda semanal interactiva: el médico
consulta únicamente su propia agenda; administración y recepción seleccionan el
profesional. Se puede crear una cita pulsando un hueco libre de 30 minutos o
abrir una cita existente para modificarla. El formulario permite elegir otra
duración y vuelve a comprobar la disponibilidad.
Desde esta pantalla, administración, médicos y recepción también pueden
añadir pacientes. Médicos y recepción no pueden crear usuarios de otros roles.

Al abrir una cita existente, «Abrir historial clínico» muestra las anotaciones
del paciente y permite vincular una nueva anotación a esa cita. Médicos y
administración pueden añadirlas; recepción puede consultarlas. El paciente
puede consultar su propio historial desde el perfil. El acceso se comprueba en
el servidor.

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
