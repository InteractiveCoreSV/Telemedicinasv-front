# TeleMedFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.14.

## Reporte de mantenimiento preventivo

### Una descripcion de lo que se hara
Se realiza una inspeccion tecnica sobre la configuracion de rutas del aplicativo, validando el control de accesos por roles y el manejo de errores de autenticacion. Como resultado, se corrigen riesgos que podian afectar la continuidad de sesion y la navegacion segura del sistema.

### JwtInterceptor: renovacion de token sin manejo de fallo (Critico)
Archivos afectados:
src/app/interceptors/jwt.interceptor.ts

Descripcion:
Cuando una peticion devolvia 401 (no autorizado), el sistema intentaba renovar el token, pero no controlaba correctamente el escenario en el que esa renovacion tambien fallaba. Esto podia dejar solicitudes pendientes y generar comportamientos inestables en la sesion del usuario.

Correccion:
Se reforzo el interceptor para centralizar el proceso de renovacion y reutilizar una sola renovacion en paralelo. Tambien se agrego control explicito para cerrar sesion cuando falla la renovacion, evitando ciclos de reintento y estados colgados.

### AppModule: inicializacion duplicada de rutas raiz (Alto)
Archivos afectados:
src/app/app.module.ts

Descripcion:
Se detecto una configuracion duplicada del router en el modulo principal. Este tipo de configuracion puede provocar comportamientos inconsistentes de navegacion y aumentar el riesgo de errores en produccion.

Correccion:
Se elimino la inicializacion redundante del router en el modulo principal para mantener una sola configuracion raiz, reduciendo riesgo de conflictos de enrutamiento.

### Control de accesos por rutas: validacion de permisos por rol (Preventivo)
Archivos afectados:
src/app/pages/pages-routing.module.ts
src/app/pages/dashboard-pages/dashboard-pages-routing.module.ts

Descripcion:
Se verifico que las rutas sensibles operan con guardas de permisos y redireccion segura cuando el usuario no tiene privilegios suficientes.

Correccion:
No se requirio ajuste de codigo en este punto. Se confirma que la estrategia actual de control de acceso por roles se encuentra aplicada en rutas clave del dashboard.

## Punto adicional: Verificacion de conectividad, configuracion e indices de MongoDB

### Una descripcion de lo que se hara
Se realiza la verificacion preventiva del flujo de conectividad hacia backend, la configuracion tecnica disponible en frontend y la trazabilidad de indices de MongoDB. El objetivo es confirmar riesgos visibles desde esta capa y documentar acciones para asegurar rendimiento y estabilidad de datos.

### Conectividad a backend de datos: endpoints base y disponibilidad (Alto)
Archivos afectados:
src/environments/environment.ts
src/environments/environment.prod.ts
src/app/auth/auth.service.ts

Descripcion:
El frontend consume servicios REST del backend por medio de urlApi y urlApiPure en archivos de entorno. Desde este repositorio no se encontraron cadenas de conexion MongoDB, por lo que la conectividad directa a base de datos no ocurre en cliente, sino en el servidor API.

Correccion:
No se requirio cambio de codigo para conectividad en este punto. Se valida que las rutas base de API estan parametrizadas por ambiente y centralizadas, reduciendo riesgo de configuracion manual por modulo.

### Indices MongoDB: ausencia de definicion en frontend y alcance real de verificacion (Informativo)
Archivos afectados:
src/app/** (revision de alcance)

Descripcion:
No se localizaron esquemas, modelos o creacion de indices (createIndex, unique, mongoose.Schema) en este frontend, lo cual es correcto por arquitectura. La gestion de indices MongoDB pertenece al backend y no puede auditarse de forma completa desde este repositorio.

Correccion:
No aplica correccion de indices en este repositorio. Se recomienda ejecutar en backend una revision de indices por coleccion, validando campos de busqueda frecuente, filtros por estado/fecha y llaves unicas de negocio.

### Documentacion tecnica: referencia incorrecta a MongoDB en carga de archivos (Bajo)
Archivos afectados:
src/app/services/upload-img.service.ts

Descripcion:
Se detecto un comentario tecnico que indicaba que MongoDB solo acepta FormData. Esa afirmacion puede inducir a error en mantenimiento porque FormData es un formato HTTP de carga y no una restriccion propia del motor MongoDB.

Correccion:
Se actualizo el comentario para reflejar el comportamiento correcto: el endpoint de carga espera multipart/form-data.

## Punto adicional: Pruebas de rendimiento y ajustes sobre metodos de uso intensivo

### Una descripcion de lo que se hara
Se realiza una evaluacion tecnica de metodos de alto uso en vistas con alto volumen de datos, enfocada en tiempos de respuesta percibidos y consumo de recursos del cliente (CPU por ciclos de render y trabajo de deteccion de cambios). Se aplican ajustes para reducir recalculos repetitivos sin alterar la funcionalidad del negocio.

### Tabla de resumen de fichas medicas: recalculo repetitivo de campos por celda (Alto)
Archivos afectados:
src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component.ts
src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component.html

Descripcion:
Se identifico un patron de uso intensivo en el modal de resumen de fichas: para cada celda se ejecutaban busquedas repetidas en arreglos (find sobre secciones y campos), ademas de multiples invocaciones por cada ciclo de render en plantilla. En escenarios con muchas filas y columnas, este patron incrementa uso de CPU y puede afectar la fluidez de la interfaz.

Correccion:
Se incorporo cache por registro (WeakMap) para resolver valores de campos en acceso O(1) despues del primer calculo, eliminando busquedas repetitivas sobre arreglos en cada celda. Tambien se agregaron funciones trackBy en listas principales (resumen, secciones, campos y tratamientos) para reducir trabajo de renderizado y recreacion de nodos DOM durante cambios de estado.

### Resultado de pruebas tecnicas en frontend (Preventivo)
Archivos afectados:
src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component.ts
src/app/components/modals/ficha-medica/view-summary-fichas-medicas/view-summary-fichas-medicas.component.html

Descripcion:
La validacion se realizo a nivel de codigo y comportamiento de render (sin instrumentacion de backend). Se verifico que los ajustes compilan sin errores y que la complejidad de consulta de datos en la vista se reduce significativamente al evitar recorridos repetitivos por cada celda.

Correccion:
No se requirieron cambios adicionales en este punto. Queda recomendada una siguiente fase opcional con medicion en navegador (Performance tab) para establecer metricas base y comparativas por volumen de datos real.

## Development server
## Punto adicional: Revision de flujos de generacion de citas y llenado de ficha medica

### Una descripcion de lo que se hara
Se realiza una inspeccion tecnica completa sobre el flujo de agendamiento de citas (nuevo appointment, pasos 1 al 5) y el flujo de llenado de ficha medica (creacion, campos, secciones, tratamientos). Se evaluan riesgos de seguridad, errores funcionales, fugas de memoria y estabilidad del estado entre sesiones. Todos los hallazgos con impacto real son corregidos.

### Envio de datos sensibles del paciente a consola (Alto)
Archivos afectados:
src/app/services/appointments.service.ts

Descripcion:
El metodo reprogramarAppointment() ejecutaba un console.log(info) antes de la llamada HTTP. El objeto info contiene datos personales del paciente: nombre, telefono y codigo de pais. Este tipo de registro en consola representa un riesgo de exposicion de informacion en entornos de produccion.

Correccion:
Se elimino el console.log(info) del metodo. La logica de construccion del payload no fue alterada.

### Comentario de cita nunca enviado al backend (Alto)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form3-new-appointment/form3-new-appointment.component.ts
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form4-new-appointment/form4-new-appointment.component.ts

Descripcion:
El campo commentAppointment del paso 4 del formulario de cita era ingresado por el usuario pero nunca llegaba al backend. El componente form4 intentaba guardar el comentario mutando un objeto snapshot en memoria, sin actualizar el control reactivo de form3 donde el metodo de pago lo lee. Como resultado, el campo commentAppointment siempre se enviaba vacio o indefinido.

Correccion:
Se agrego el control commentAppointment al FormGroup de form3. En form4, nextForm() ahora escribe el valor directamente sobre ese control mediante form3.get('commentAppointment')?.setValue(), garantizando que el valor este disponible al momento del envio en el paso 5.

### Excepcion no controlada en envio de pago por campos nulos (Alto)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form5-new-appointment/form5-new-appointment.component.ts

Descripcion:
Los metodos payment() y paymentCard() accedian directamente a propiedades anidadas como urgency.name, medico._id, hour._id y service.map() sin verificar que los valores previos estuvieran cargados. Si algun paso previo quedaba incompleto, el envio generaba una excepcion TypeError en tiempo de ejecucion que colapsaba el flujo silenciosamente.

Correccion:
Se agregaron guardas de validacion al inicio de cada metodo de pago. Si alguno de los campos criticos es nulo o invalido, el spinner se oculta y se muestra un aviso al usuario en lugar de ejecutar la llamada HTTP con datos incompletos.

### ID de subsidiaria enviado como objeto en citas virtuales (Alto)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form5-new-appointment/form5-new-appointment.component.ts

Descripcion:
En citas virtuales, el control subsidiary de form3 es deshabilitado por Angular, lo que hace que su valor quede excluido de form.value. El fallback utilizado tomaba medico.subsidiary directamente, que es un objeto SubsidiaryI completo en lugar del string con el ID. El backend recibe el ID como campo obligatorio, por lo que este comportamiento generaba errores silenciosos o rechazos en el registro de la cita virtual.

Correccion:
Se actualizo la expresion de fallback para extraer el _id del objeto de subsidiaria: medico.subsidiary?._id ?? medico.subsidiary. Esto garantiza que siempre se envie un identificador valido independientemente del tipo de cita.

### Estado global del formulario no se reinicia entre sesiones (Alto)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/new-appointment-forms.service.ts
src/app/components/modals/appointments/new-appointment-modal/new-appointment-modal.component.ts

Descripcion:
El servicio NewAppointmentFormsService esta provisto como singleton global. Al abrir el modal de nueva cita por segunda vez sin recargar la pagina, todos los formularios, BehaviorSubjects y valores previos se conservaban del flujo anterior. Esto podia provocar datos pre-cargados, totales incorrectos y comportamientos inesperados en sesiones subsecuentes.

Correccion:
Se agrego el metodo reset() al servicio, que limpia forms, currentSlide, totalAppointment$, appointmentRegistered$, remitida$, medicoDisponible$ y appointmeRemision$. Este metodo es invocado al cerrar el modal en new-appointment-modal.component.ts.

### Fuga de memoria en suscripciones no gestionadas (Alto)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form1-new-appointment/form1-new-appointment.component.ts
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form2-new-appointment/form2-new-appointment.component.ts
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form5-new-appointment/form5-new-appointment.component.ts

Descripcion:
Se identificaron tres suscripciones que no eran gestionadas por el mecanismo de limpieza de la clase: la suscripcion a valueChanges de referencedAppointment en form1, la suscripcion a reloadSubsidiaries en form2 (que ademas carecia de ngOnDestroy), y la suscripcion a dismissed del modal de iframe en form5. Al destruir los componentes, estas suscripciones permanecian activas en memoria.

Correccion:
Se registraron las suscripciones en this.subs para que queden gestionadas por el mecanismo de limpieza existente. Se agrego ngOnDestroy con subs.unsubscribe() a form2. Se agrego tambien un manejador de error al metodo getSubsidiaries() en form2 que anteriormente dejaba el estado de carga indefinido ante un fallo de red.

### Campo tipo del componente de ficha medica excluido al guardar (Alto)
Archivos afectados:
src/app/components/modals/ficha-medica/add-campo-ficha-medica/add-campo-ficha-medica.component.ts

Descripcion:
El control type del formulario de campo de ficha medica era deshabilitado programaticamente para controlar su edicion segun el componente seleccionado. Al guardar, el metodo close() utilizaba form.value, que excluye controles deshabilitados en Angular. Esto provocaba que el campo type fuera omitido del objeto guardado, pese a tener validacion Validators.required.

Correccion:
Se cambio form.value por form.getRawValue() en saveCampo(), que incluye todos los controles independientemente de su estado habilitado o deshabilitado. Adicionalmente, se corrigio la limpieza de opciones del selector al cambiar de tipo de componente: se reemplazaron las llamadas a removeAt(0) por optionsSelect.clear(), que elimina correctamente la totalidad de las opciones y no solo el primer elemento.

### Spinner bloqueante en cambio de medico de tratamiento (Medio)
Archivos afectados:
src/app/components/modals/ficha-medica/generate-tratamiento/generate-tratamiento.component.ts

Descripcion:
El metodo changeMedico() mostraba el spinner de carga antes de iniciar la conversion de archivos a base64. Si alguna de las promesas fallaba, el bloque then() no se ejecutaba y el spinner quedaba visible de forma permanente, bloqueando la interfaz del usuario sin posibilidad de recuperacion.

Correccion:
Se agrego un bloque .finally() al Promise.all() para garantizar que el spinner se oculte siempre al finalizar, independientemente de si las promesas resolvieron o fallaron. Tambien se corrigio la inicializacion de firma y sello en ngOnInit() para el modo edicion: el componente cargaba valores undefined cuando edit era true porque firma y sello aun no estaban asignadas al momento del init; ahora siempre se toman del objeto medico como fuente inicial.

### Datos de tarjeta de credito transmitidos a traves del servidor propio (Critico - Recomendacion)
Archivos afectados:
src/app/pages/dashboard-pages/appointments-page/new-appointment-page/form5-new-appointment/form5-new-appointment.component.ts

Descripcion:
El metodo paymentCard() incluye el objeto cardMethodForm.value (numero de tarjeta, CVV, fecha de vencimiento) en el payload enviado al backend propio bajo el campo dataCard. Transmitir datos de tarjeta a traves de un servidor intermedio propietario impone requisitos de cumplimiento PCI-DSS de nivel 1 sobre toda la infraestructura y aumenta significativamente el riesgo ante compromisos de seguridad.

Correccion:
No se realizo cambio de codigo en este punto ya que la integracion con la pasarela de pago (PowerTranz) puede requerir este flujo de forma intencional segun el contrato de procesamiento. Se documenta como hallazgo para revision por parte del equipo responsable de la infraestructura y cumplimiento normativo.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

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
