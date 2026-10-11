# Guía de la Aplicación Móvil iOS - La Única Rugby Taldea

Esta aplicación ha sido reconvertida en una **aplicación móvil moderna para iOS** respetando el 100% de las funcionalidades del club (inventario, arqueo de caja de tercer tiempo, calendario de partidos, proveedores, pedidos y usuarios).

Tienes **dos formas** de utilizarla o distribuirla en dispositivos Apple (iPhone e iPad):

---

## 1. Modo App iOS Inmediata (PWA / Web App Standalone en Safari)
*No requiere Mac ni cuenta de desarrollador de Apple.*

1. Abre el enlace de la aplicación en el navegador **Safari** de tu iPhone o iPad.
2. Toca el botón **Compartir** (el icono de un cuadrado con una flecha hacia arriba en la barra inferior de Safari).
3. Desliza hacia abajo en las opciones y selecciona **"Añadir a la pantalla de inicio"** (con el icono del `+`).
4. Pulsa **"Añadir"** en la esquina superior derecha.

### Experiencia Nativa Obtenida:
* **Icono oficial del club** en la pantalla de inicio con diseño de balón de rugby y colores verde esmeralda y negro de La Única RT.
* **Pantalla completa (Standalone)**: Sin barras de navegación, barra de URL ni marcos de Safari.
* **Barra de navegación inferior nativa iOS (TabBar)** adaptada al pulgar con 5 secciones:
  - 🏠 **Inicio (Panel)**
  - 📦 **Stock (Inventario)** con contador de alertas
  - ⚡ **Bar Rápido** (Botón central destacado para el tercer tiempo en días de partido)
  - 📋 **Cierre (Cierre de Jornada y Arqueo)**
  - ⋯ **Más** (Partidos, Proveedores, Compras, Usuarios y Ajustes)
* **Compatibilidad completa con Safe Area**: Respeta el *Dynamic Island*, el *notch* y la barra inferior de gestos de iPhone.
* **Respuesta táctil y haptics** en botones y selectores.
* **Modo sin conexión**: Los datos se almacenan en el dispositivo y se sincronizan automáticamente con Firebase al recuperar la conexión.

---

## 2. Modo Nativo iOS con Xcode y Capacitor (App Store / TestFlight / IPA)
*Para compilar un paquete nativo de iOS e instalarlo con cable o subirlo al App Store.*

La configuración de Capacitor ya está integrada con el identificador:
`com.launicart.tercertiempo`

### Pasos para compilar en un Mac con Xcode:

1. **Construir el código web:**
   ```bash
   npm run build
   ```

2. **Inicializar la plataforma iOS nativa:**
   ```bash
   npx cap add ios
   ```

3. **Sincronizar cambios y recursos:**
   ```bash
   npx cap sync ios
   ```

4. **Abrir el proyecto en Xcode:**
   ```bash
   npx cap open ios
   ```

5. **En Xcode:**
   - Selecciona tu equipo de desarrollo en la pestaña **Signing & Capabilities**.
   - Selecciona un simulador de iPhone (por ejemplo, iPhone 16 Pro) o tu dispositivo físico conectado por USB.
   - Pulsa el botón **Play (Run)** para compilar y ejecutar la app nativa en iOS.
