# Mejoras de Validación en Formulario de Usuarios

## Resumen
Se han implementado validaciones personalizadas avanzadas en el formulario de creación/edición de usuarios en la sección "Administrar > Crear nuevo usuario".

## Archivos Modificados

### 1. **src/app/shared/validators/custom.validators.ts** (NUEVO)
Archivo con validadores personalizados reutilizables:

#### `emailValidator()`
- **Formato**: `usuario@dominio.extensión`
- **Patrón**: Acepta cualquier formato de email estándar
- **Ejemplo válido**: `juan@ejemplo.com`

#### `documentValidator()`
- **Soporta tres tipos de documentos**:
  - **DNI**: 8 dígitos + 1 letra (Ej: 12345678A)
  - **NIE**: X/Y/Z + 7 dígitos + 1 letra (Ej: X1234567B)
  - **Pasaporte**: 3 letras + 6 dígitos (Ej: ABC123456)

#### `phoneValidator()`
- **Restricción**: Solo números (9-15 dígitos)
- **Ejemplo válido**: `612345678`

#### `passwordValidator()`
- **Requisitos**:
  - Mínimo 6 caracteres
  - Al menos 1 mayúscula (A-Z)
  - Al menos 1 minúscula (a-z)
  - Al menos 1 número (0-9)
- **Ejemplo válido**: `Password123`

### 2. **src/app/shared/components/popups/user-detail/user-detail.component.ts** (MEJORADO)

#### Cambios principales:
- ✅ Importación de validadores personalizados
- ✅ Interfaz `Rol` para tipado de datos
- ✅ Métodos para cargar y mostrar roles con descripción (idRol - descripción)
- ✅ Aplicación de validadores a todos los campos
- ✅ Método `getErrorMessage()` para mostrar mensajes de error específicos
- ✅ Validación de forma completa antes de enviar
- ✅ Actualización de URLs de localhost:8080 → localhost:3000
- ✅ Cambio de campos (username → dni, password → contraseña)

#### Campos del formulario validados:
1. **nombre** - Requerido
2. **apellidos** - Requerido
3. **dni** - DNI/NIE/Pasaporte válido
4. **newUsuario** - Requerido (usuario para login)
5. **password** - Contraseña fuerte (6+ caracteres con mayúscula, minúscula, número)
6. **email** - Formato email válido
7. **telefono** - Solo números (9-15 dígitos)
8. **domicilio** - Requerido
9. **idRolNativo** - Rol requerido

### 3. **src/app/shared/components/popups/user-detail/user-detail.component.html** (MEJORADO)

#### Cambios de UX:
- ✅ Reordenamiento lógico de campos (nombre, apellidos, documento, etc.)
- ✅ Indicadores de campos requeridos (asterisco rojo)
- ✅ Placeholders descriptivos para cada campo
- ✅ Mensajes de error específicos debajo de cada campo
- ✅ Rol mostrado como "idRol - descripción" (Ej: "1 - Admin")
- ✅ Estilos de error visuales en campos inválidos
- ✅ Input type="tel" para teléfono con inputmode="numeric"
- ✅ Mejor organización y legibilidad del formulario

### 4. **src/app/shared/components/popups/user-detail/user-detail.component.scss** (MEJORADO)

#### Nuevos estilos:
- ✅ `.error` - Clase para campos con error (borde rojo + fondo rojo claro)
- ✅ `.required` - Asterisco rojo para campos obligatorios
- ✅ `.form-error` - Mensaje de error en rojo
- ✅ Mejora de hover y focus en inputs
- ✅ Aumento de altura máxima del formulario (300px → 600px)
- ✅ Mejor visualización del select de roles
- ✅ Transiciones suaves en cambios de estado

## Ejemplos de Validación

### ✅ Datos Válidos
```
Nombre: Juan
Apellidos: García López
DNI: 12345678A (o X1234567B para NIE, o ABC123456 para Pasaporte)
Usuario: jgarcia
Contraseña: MyPassword123
Email: juan.garcia@ejemplo.com
Teléfono: 612345678
Domicilio: Calle Principal 123, Madrid
Rol: 1 - Admin
```

### ❌ Datos Inválidos
```
DNI: 123456 (menos de 8 dígitos)
Email: correo.invalido (sin @)
Teléfono: 123abc (contiene letras)
Contraseña: abc123 (sin mayúscula)
Rol: (vacío)
```

## Funcionalidad Adicional

### Métodos públicos útiles:
- `getRoleDescription(idRol: number)` - Obtiene la descripción formateada del rol
- `getErrorMessage(key: string)` - Obtiene el mensaje de error específico del campo
- `getTouchedAndError(key: string)` - Detecta campos tocados con errores
- `markFormGroupTouched(formGroup)` - Marca todos los campos como tocados (para mostrar errores)

## Testing Manual

Para probar las validaciones:

1. **Email**: Intenta escribir `corrueo` (sin @) → Verás el error: "Email debe tener formato: usuario@dominio.ext"

2. **DNI**: Intenta escribir `123456` (menos de 8 dígitos) → Error: "DNI/NIE debe tener 8 dígitos + 1 letra..."

3. **Teléfono**: Intenta escribir `123abc` (con letras) → Error: "Teléfono debe contener solo números..."

4. **Contraseña**: Intenta escribir `password` (sin números) → Error: "Contraseña: mín 6 caracteres, 1 mayúscula, 1 minúscula, 1 número"

5. **Rol**: Abre el dropdown → Verás: "1 - Admin", "2 - Médico", "3 - Recepcionista", "4 - Cliente"

## URLs Actualizadas

Se actualizaron las siguientes URL de endpoints:
- ✅ Crear usuario: `http://localhost:3000/persona` (antes: localhost:8080)
- ✅ Actualizar usuario: `http://localhost:3000/persona/changeUser` (antes: localhost:8080)
- ✅ Eliminar usuario: `http://localhost:3000/persona/{id}` (antes: localhost:8080)

## Próximas Mejoras Sugeridas

1. **Autocomplete de Dirección**: Integrar librería ng-google-places-autocomplete o similar para sugerencias de direcciones
2. **Validación en Tiempo Real**: Mensajes de validación mientras el usuario escribe
3. **Endpoint de Roles**: Crear endpoint `/api/roles` para cargar roles dinámicamente desde la BD
4. **Confirmación de Contraseña**: Agregar campo para confirmar contraseña
5. **Búsqueda de Usuarios**: Agregar búsqueda para detectar DNI duplicados antes de crear

## Compatibilidad

- Angular: 12+
- TypeScript: 4.3+
- Reactive Forms: Angular FormBuilder y Validators
- Material: mat-dialog, mat-select, etc.
