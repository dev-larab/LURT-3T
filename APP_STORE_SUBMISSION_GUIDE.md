# Guía Oficial para Subir la App a la App Store de Apple (iOS)

El proyecto nativo de iOS para **La Única Rugby Taldea - Tercer Tiempo** ya ha sido compilado, estructurado y sincronizado en el directorio `ios/App/` con las siguientes configuraciones de producción:

- **Nombre de la App**: `La Única RT`
- **Bundle Identifier (App ID)**: `com.launicart.tercertiempo`
- **Versión**: `1.0.0` (Build 1)
- **App Icon**: Icono oficial de 1024x1024 px generado en `Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- **Exención de Criptografía configurada**: `ITSAppUsesNonExemptEncryption = false` en `Info.plist` (evita cuestionarios de exportación de Apple).
- **Assets de Producción**: HTML/JS/CSS minificado y Service Worker PWA sincronizados en `ios/App/App/public/`.

---

## Método 1: Subida Directa desde Xcode (Recomendado con Mac)

### Paso 1: Abrir el proyecto en Xcode
En la terminal de tu Mac, dentro de la raíz del proyecto, ejecuta:
```bash
npx cap open ios
```
*(O haz doble clic directamente en el archivo `ios/App/App.xcodeproj`).*

### Paso 2: Configurar Firma y Certificados (Signing)
1. En la barra lateral izquierda de Xcode, haz clic en el icono azul superior **App**.
2. Ve a la pestaña **Signing & Capabilities**.
3. En la sección **Team**, selecciona tu cuenta de desarrollador de Apple (*Apple Developer Program* o tu Apple ID).
4. Asegúrate de que el **Bundle Identifier** sea:
   `com.launicart.tercertiempo`
   *(Xcode generará automáticamente el Provisioning Profile de firma).*

### Paso 3: Crear el Archivo de Producción (Archive)
1. En la barra superior de Xcode, en el selector de destino (junto al botón de Play), cambia el simulador por:
   **Any iOS Device (arm64)**
2. En el menú superior de Xcode, haz clic en:
   **Product** > **Archive**
3. Xcode compilará el binario binario nativo de iOS. Al terminar, se abrirá automáticamente la ventana del **Organizer**.

### Paso 4: Subir a App Store Connect / TestFlight
1. En la ventana del Organizer, selecciona tu compilación y haz clic en el botón azul **Distribute App** (a la derecha).
2. Selecciona **App Store Connect** > **Upload** (Subir).
3. Mantén marcadas las opciones recomendadas por defecto:
   - *Upload your app's symbols (para informes de errores)*
   - *Automatically manage signing*
4. Pulsa **Next** y luego **Upload**.
5. En unos 2-5 minutos, el paquete estará subido en los servidores de Apple.

---

## Método 2: Compilación Automatizada en la Nube con GitHub Actions
Si utilizas un repositorio en GitHub, hemos incluido el flujo `.github/workflows/build-ios.yml`:
1. Sube este código a tu repositorio de GitHub.
2. Ve a la pestaña **Actions** en GitHub.
3. Ejecuta el workflow **Build iOS App (.ipa) for App Store**.
4. GitHub utilizará una máquina virtual oficial de Apple (`macos-14`) para compilar el archivo `.xcarchive` y generar los artefactos descargables sin necesidad de tener un Mac propio.

---

## Paso 5: Publicación en App Store Connect

Una vez subido el binario:

1. Inicia sesión en [App Store Connect](https://appstoreconnect.apple.com).
2. Ve a **Mis Apps** > pulsa el botón **+** > **Nueva App**.
3. Rellena los datos básicos:
   - **Plataforma**: iOS
   - **Nombre**: `La Única RT - Tercer Tiempo`
   - **Idioma principal**: Español
   - **ID de lote (Bundle ID)**: `com.launicart.tercertiempo`
   - **SKU**: `LURT-TERCER-TIEMPO-01`
4. **Distribución en TestFlight (Opcional antes del lanzamiento)**:
   - En la pestaña **TestFlight**, verás la versión subida.
   - Puedes invitar por email o enlace público a los directivos, entrenadores y jugadores del club para probar la app en sus iPhones antes de publicarla en la tienda.
5. **Ficha de la App Store**:
   - **Descripción**: *"Gestión de inventario, stock, proveedores, arqueo de caja y calendario de terceros tiempos para La Única Rugby Taldea (Pamplona / Iruña)."*
   - **Palabras clave (Keywords)**: `rugby, la unica, tercer tiempo, hirugarren denbora, iruña, inventario, bar, club`
   - **Capturas de pantalla**: Captura 3-4 pantallas de la app en iPhone (Panel, Inventario, Modo Bar Rápido, Cierre de Jornada).
6. Haz clic en **Enviar para revisión**. El equipo de revisión de Apple suele aprobar las apps en un plazo de 24 a 48 horas.
