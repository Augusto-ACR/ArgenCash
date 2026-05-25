# TP Aplicación móvil con marca propia  
## ArgenCash - App desarrollada con React Native + Expo

### Autores
- **Augusto Rodríguez** – [augustocrodriguez2004@gmail.com](mailto:augustocrodriguez2004@gmail.com)  
- **Rolando Villegas** – [rolando.villegas@gmail.com](mailto:rolando.villegas@gmail.com)

---

## Descripción del proyecto

**ArgenCash** es una aplicación móvil desarrollada con React Native y Expo para consultar cotizaciones del dólar en Argentina y realizar conversiones entre pesos argentinos y distintos tipos de cambio.

## Funcionalidades

- Pantalla de inicio con identidad de marca.
- Listado de cotizaciones actualizado desde una API pública.
- Pantalla de detalle para cada tipo de dólar.
- Calculadora de conversión entre pesos y distintos tipos de dólar.
- Manejo de estados de carga y error.
- Navegación mediante Expo Router.

## Instalación

Para instalar las dependencias del proyecto, ejecutá:

```bash
npm install
```

## Ejecución

Para iniciar la aplicación con Expo, ejecutá:

```bash
npx expo start
```

Luego, se puede abrir la aplicación desde Expo Go escaneando el código QR o bien se puede ejecutar en un emulador Android/iOS compatible.

## Estructura del proyecto

```text
app/
  Pantallas y rutas de la aplicación.

components/
  Componentes reutilizables de interfaz.

services/
  Acceso a datos externos.

hooks/
  Lógica reutilizable relacionada con estado y obtención de datos.

types/
  Modelos TypeScript utilizados por la aplicación.

constants/
  Configuración visual base, como colores y estilos generales.
```

## API utilizada

La aplicación consume cotizaciones desde DolarAPI:

```text
https://dolarapi.com/v1/dolares
```

## Tecnologías utilizadas

- React Native
- Expo
- Expo Router
- TypeScript
- React Hooks
- DólarAPI