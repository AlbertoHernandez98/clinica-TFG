# Google Places Autocomplete - Guía de Implementación

## ¿Qué se ha implementado?

Se ha añadido un **buscador inteligente de domicilios** utilizando **Google Places API** en el formulario de creación/edición de usuarios. Cuando un usuario comience a escribir una dirección, se le mostrarán sugerencias automatizadas.

## 🎯 Características

✅ Autocompletado de direcciones en **tiempo real**
✅ Búsqueda restringida a **España**
✅ Obtención automática de coordenadas GPS
✅ Desglose de componentes de dirección (calle, número, ciudad, código postal)
✅ Debounce de 300ms para optimizar llamadas a API
✅ Manejo de errores y fallback
✅ Interfaz intuitiva con lista de sugerencias

## 📋 Archivos Implementados

### 1. **src/services/google-places.service.ts** (NUEVO)
Servicio completo que maneja toda la lógica de integración con Google Places:
- **getPredictions()** - Obtiene sugerencias de direcciones
- **getPlaceDetails()** - Obtiene detalles completos de un lugar
- **formatAddress()** - Formatea la dirección de manera legible

### 2. **src/app/shared/components/popups/user-detail/user-detail.component.ts** (MEJORADO)
Integración del servicio Google Places:
- `domicilioControl` - FormControl separado para el autocomplete
- `setupAddressAutocomplete()` - Configura listeners de cambio
- `onSelectPrediction()` - Maneja la selección de una dirección
- Limpieza automática de suscripciones con `OnDestroy`

### 3. **src/index.html** (MEJORADO)
Inclusión del script de Google Maps:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&language=es&region=ES"></script>
```

### 4. **src/app/shared/shared.module.ts** (MEJORADO)
Importación de módulos necesarios:
- `MatAutocompleteModule`
- `MatInputModule`

## 🔑 Obtener tu API Key de Google

### Paso 1: Crear un Proyecto en Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto (Botón "Crear proyecto")
3. Esperar a que se cree el proyecto

### Paso 2: Activar Google Places API

1. En la barra de búsqueda superior, buscar "Places API"
2. Hacer clic en "Places API"
3. Hacer clic en el botón "ACTIVAR"
4. Esperar a que se active

### Paso 3: Crear Credenciales

1. Ir a **Credenciales** (lado izquierdo)
2. Hacer clic en "Crear credenciales"
3. Seleccionar **"Clave de API"**
4. Se generará una nueva clave
5. Copiar la clave (algo como: `AIzaSyABCDEF...`)

### Paso 4: Configurar Restricciones (Recomendado)

1. Hacer clic en la clave de API creada
2. Ir a "Restricciones de aplicaciones"
3. Seleccionar **"Sitios web HTTP (referenciadores)"**
4. Agregar tu dominio (ej: `localhost:4200`, `tudominio.com`)
5. Ir a "Restricciones de API"
6. Seleccionar **"Seleccionar manualmente"**
7. Buscar y activar las siguientes APIs:
   - ✅ Google Places API
   - ✅ Maps JavaScript API
8. Guardar cambios

### Paso 5: Reemplazar la API Key en el Código

Reemplaza `AIzaSyAfakeyplaceholder` en `src/index.html`:

```html
<!-- ANTES -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAfakeyplaceholder&libraries=places&language=es&region=ES"></script>

<!-- DESPUÉS -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places&language=es&region=ES"></script>
```

## 💰 Precio

- **Primeros 28,500 requests/mes**: GRATIS
- **Después**: $0.017 USD por request + $0.017 USD por sesión

Para un uso moderado (100-500 usuarios/mes), el costo es prácticamente nulo.

## 🌐 Alternativa: Usar con Nominatim (Gratuito)

Si prefieres evitar costos, puedes reemplazar Google Places por **Nominatim** (OpenStreetMap):

1. No requiere registro ni API key
2. 100% gratuito
3. Más lento que Google Places
4. Funciona menos bien que Google Places

Contacta si deseas que implemente esta alternativa.

## 🚀 Cómo Usar en el Formulario

### Crear Usuario Nuevo:
1. Ve a **Administrar > Crear nuevo usuario**
2. En el campo "DOMICILIO", comienza a escribir la dirección
3. Selecciona de la lista desplegable
4. La dirección se capturará automáticamente con coordenadas GPS

### Ejemplo:
```
Input: "Calle Principal Madrid"

Sugerencias:
- Calle Principal, 1, 28001 Madrid, España
- Calle Principal, 15, 28002 Madrid, España
- Calle Principal de Torrejón, 28001 Torrejón, España
```

## 🔍 Validación

El campo domicilio sigue siendo obligatorio y se valida como:
- ✅ No vacío
- ✅ Formato correcto de dirección (obtenido de Google Places)
- ✅ Dentro de España (por configuración)

## 📊 Monitoreo y Debugging

Si algo no funciona, abre la consola del navegador (F12) y verifica:

```javascript
// En la consola:
typeof google !== 'undefined' // Debe ser true (Google Maps cargado)
google.maps.places                // Debe existir
```

Si ves errores, verifica:
1. ¿La API key está correcta?
2. ¿La API key tiene Google Places habilitada?
3. ¿Tu dominio está en la lista de referenciadores permitidos?

## 📝 Datos Capturados

Cuando seleccionas una dirección, se guardan:

```json
{
  "formatted_address": "Calle Principal 123, 28001 Madrid, España",
  "geometry": {
    "lat": 40.4168,
    "lng": -3.7038
  },
  "components": {
    "street_number": "123",
    "route": "Calle Principal",
    "postal_code": "28001",
    "locality": "Madrid",
    "administrative_area_level_2": "Madrid",
    "country": "España"
  }
}
```

## ❌ Solución de Problemas

### "No se encontraron direcciones"
→ Verifica que la API key sea válida y tenga habilitada Google Places API

### El autocomplete no aparece
→ Abre F12 → Console e verifica si hay errores de red

### Las direcciones no se rellenan
→ Asegúrate de que Google Places API esté activada en Google Cloud Console

## 🔐 Seguridad

- La API key está en el HTML, visible en el cliente
- Esto es normal y aceptado para Google Places
- Las restricciones por dominio protegen contra uso malicioso
- Las restricciones por API limitan qué servicios puede usar la clave

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola del navegador (F12)
2. Comprueba que la API key es válida
3. Asegúrate de que Google Places API esté activada
4. Valida que tu dominio esté en la lista blanca (si la has configurado)
