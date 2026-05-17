# 🐾 Camino a Casa - Plataforma de Adopción Responsable

**Conectando corazones con patitas desde 2026** 💖

Una plataforma web completa para la adopción responsable de mascotas, desarrollada con **HTML5, CSS3 y Vanilla JavaScript (ES6+)**. El proyecto combina una landing page atractiva con un sistema integral de registro y validación de adoptantes.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Módulo de Adoptantes](#módulo-de-adoptantes)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Características Principales](#características-principales)
5. [Requisitos Técnicos](#requisitos-técnicos)
6. ⭐⭐⭐ **[PROMPT ORIGINAL EVALUACIÓN 2 (ANTIGRAVITY)](###-prompt-original-evaluación-2-antigravity)** ⭐⭐⭐
7. [Nuevas Integraciones](#nuevas-integraciones)
8. [Manual de Verificación](#manual-de-verificación)
9. [Desarrollo con IA](#desarrollo-con-ia)

---

## 🎯 Descripción General

**Camino a la adopción** es una plataforma complementaria a la landing page principal que facilita:

- ✅ **Registro seguro** de adoptantes con validación de datos
- 👤 **Perfiles personalizados** con antecedentes adoptivos
- ⭐ **Sistema de calificación jerárquico** (1-5 estrellas)
- 📱 **Verificación de identidad** mediante código SMS simulado
- 🏠 **Evaluación de vivienda** y experiencia previa
- 👨‍💼 **Panel de administración** para gestionar solicitudes de adopción
- 🐾 **Selección de mascotas** para adoptantes aprobados

---

## 📂 Módulo de Adoptantes

El módulo `adoptantes/` es el corazón de la plataforma. Permite:

### **Funcionalidades Principales**

#### 1. **Registro y Validación** 
- Formulario HTML5 con validación en tiempo real
- Campos: Nombre, RUT, Email, Celular, Región, Comuna, Dirección, Tipo de Vivienda
- Validadores personalizados:
  - RUT: validación de formato y dígito verificador (algoritmo chileno)
  - Email: validación de formato RFC
  - Celular: validación de prefijo internacional (+56 para Chile)
  - Campos requeridos: feedback visual amigable

#### 2. **Verificación de Identidad**
- Código de 4 dígitos enviado (simulado) al celular
- Confirmación antes de proceder al siguiente paso

#### 3. **Perfil del Adoptante**
- Experiencia previa con mascotas
- Cantidad de adopciones anteriores
- Tiempo disponible (horas por semana)
- Motivación para adoptar
- Carga de evidencias (fotos del hogar, certificados)

#### 4. **Sistema de Calificación Automático**
- Basado en: historial de adopción, validación de identidad, completitud del perfil
- Representación en estrellas (1-5)
- Estados: "Incompleto", "En revisión", "Completo", "Aprobado"
- **NO editable por el usuario**

#### 5. **Panel de Administración**
- Vista de todas las solicitudes de adoptantes
- Filtrado por estado (Pendiente, Aprobado, Rechazado)
- Aprobación/rechazo manual de solicitudes
- Gestión de mascotas disponibles

#### 6. **Selección de Mascotas**
- Los adoptantes aprobados pueden elegir una mascota
- Sistema de solicitud integrado
- Notificación de éxito al seleccionar

---

## 📁 Estructura de Archivos

```
Camino-a-casa/
├── index.html                    # Landing page principal
├── style.css                     # Estilos globales
├── README.md                     # Este archivo
├── LICENSE                       # Licencia del proyecto
├── img/                          # Imágenes (logo, mascotas)
│   ├── logo.png
│   ├── Yiya.jpeg
│   ├── Bigote.jpeg
│   ├── Mico.jpeg
│   └── ... (más mascotas)
│
└── adoptantes/                   # MÓDULO DE ADOPTANTES
    ├── index.html               # Interfaz principal
    ├── css/
    │   └── style.css            # Estilos del módulo
    └── js/
        ├── main.js              # Lógica principal (UI, eventos, navegación)
        ├── validators.js        # Funciones de validación
        └── chile.js             # Datos de regiones y comunas
```

### **Descripción de Archivos del Módulo**

#### `adoptantes/index.html`
- **Propósito**: Estructura HTML de la aplicación
- **Contenido**:
  - Sección Dashboard: estado del perfil
  - Formulario de registro (Step 1)
  - Verificación de celular (Step 2)
  - Formulario de perfil/calificación (Step 3)
  - Vista de detalles del perfil
  - Selección de mascotas
  - Panel de administración
- **Características**:
  - 8 vistas principales (sections)
  - Iconografía Material Symbols Rounded
  - Estructura semántica accesible

#### `adoptantes/css/style.css`
- **Propósito**: Diseño visual del módulo
- **Diseño**:
  - Paleta pastel: rosado, lila, blanco
  - Flexbox y Grid para responsividad
  - Bordes redondeados (border-radius: 12px)
  - Sombras suaves y transiciones
  - Inspiración en Material Design
- **Componentes estilizados**:
  - Tarjetas (cards)
  - Botones (primario, secundario, texto)
  - Formularios y inputs
  - Badges de estado
  - Estrellas de calificación

#### `adoptantes/js/main.js`
- **Propósito**: Lógica principal de la aplicación (Vanilla JavaScript puro)
- **Funcionalidades**:
  - Gestión de vistas (mostrar/ocultar secciones)
  - Event listeners nativos para formularios
  - Flujo de registro → verificación → perfil
  - Almacenamiento con localStorage (sin dependencias)
  - Cálculo automático de calificación
  - Panel de administración (CRUD de solicitudes)
  - Selección de mascotas
  - Manipulación directa del DOM con querySelector
- **Variables clave**:
  - `tempPersonalData`: datos temporales del usuario
  - `adopterProfiles`: array de perfiles guardados
  - Estados de vista (active/hidden)

#### `adoptantes/js/validators.js`
- **Propósito**: Funciones de validación reutilizables (Vanilla JS puro)
- **Implementación**: Funciones puras sin dependencias externas
- **Exporta**:
  - `validateRUT(rut)`: Validación de RUT chileno con algoritmo chileno
  - `calculateRutDigit(rutNum)`: Cálculo de dígito verificador (módulo 11)
  - `formatRUT(rut)`: Formateo de RUT (12.345.678-9)
  - `validatePhone(phone)`: Validación de celular con regex
  - `validateEmail(email)`: Validación de correo con regex
  - `validateRequired(value)`: Validación de campos obligatorios

#### `adoptantes/js/chile.js`
- **Propósito**: Datos geográficos de Chile
- **Contenido**:
  - Objeto con 16 regiones
  - Cada región contiene array de comunas
  - Ejemplo:
    ```javascript
    const regiones = {
      "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
      "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Camiña", ...],
      ...
    }
    ```

---

## ⚙️ Características Principales

### **Validación en Tiempo Real**
- ✓ Mensajes de error amigables
- ✓ Validación al perder el foco (blur)
- ✓ Limpieza de errores al escribir (input)
- ✓ Formateo automático de RUT

### **Almacenamiento Persistente**
- ✓ localStorage para guardar perfiles
- ✓ Datos persisten entre sesiones
- ✓ Reinicio manual con botón "Borrar Datos"

### **UX/UI Moderna**
- ✓ Animaciones suaves (transiciones CSS)
- ✓ Feedback visual inmediato
- ✓ Interfaz accesible (WCAG)
- ✓ Iconografía Material Design
- ✓ Responsiva: móvil, tablet, escritorio

### **Seguridad**
- ✓ Validación de formato de datos
- ✓ Verificación de identidad mediante código
- ✓ No almacena datos sensibles sin validar

---

## 🔧 Requisitos Técnicos

### **Vanilla JavaScript (ES6+)** 🎯
La aplicación utiliza **JavaScript puro** sin dependencias externas ni frameworks:
- ✓ Arrow functions y template literals
- ✓ Destructuring y spread operator
- ✓ Manipulación del DOM con querySelector
- ✓ Event listeners nativos y preventDefault
- ✓ localStorage para persistencia de datos
- ✓ JSON parse/stringify
- ✓ Métodos de arrays (map, filter, find, forEach)
- ✓ Validaciones personalizadas con regex
- ✓ Gestión de eventos con delegación

### **HTML5**
- ✓ Formularios semánticos
- ✓ Inputs con validaciones nativas (required, pattern, type)
- ✓ Estructura accesible (aria-labels)
- ✓ Metadata responsive (viewport)

### **CSS3**
- ✓ Flexbox y Grid
- ✓ Media queries responsive
- ✓ CSS custom properties (variables)
- ✓ Transiciones y transforms
- ✓ Gradientes y sombras

---

### ⭐⭐⭐ PROMPT ORIGINAL EVALUACIÓN 2 (ANTIGRAVITY) ⭐⭐⭐

> **🚀 SECCIÓN DESTACADA - Punto Clave del Proyecto**

Este proyecto fue desarrollado utilizando el siguiente prompt de especificación:

```
Desarrolla una plataforma web complementaria a la landing page "Camino a Casa", 
enfocada en la adopción responsable de mascotas. El sistema debe cumplir con 
los siguientes requisitos:

REGISTRO Y VALIDACIÓN
- Formulario HTML5 con campos: nombre, correo, dirección, tipo de vivienda, 
  RUT (validación de formato y dígito verificador), número celular con prefijo 
  internacional (ejemplo: Chile +56).
- Validación dinámica con JavaScript, mostrando mensajes de error amigables 
  en tiempo real.
- Validación del celular mediante código de verificación.

PERFIL DEL ADOPTANTE
- Creación de perfil personalizado con datos personales y antecedentes adoptivos.
- Formulario adicional con experiencia previa, cantidad de adopciones, 
  tiempo disponible y motivación para adoptar.
- Posibilidad de adjuntar evidencias (fotografías del hogar, certificados veterinarios).
- Datos almacenados en localStorage, con mecanismo de reinicio automático cada mes.

SISTEMA DE CALIFICACIÓN JERÁRQUICO
- Historial de adopción como criterio principal.
- Ajustes automáticos según validación de identidad, completitud del perfil 
  y evidencias adjuntas.
- Calificación representada en estrellas (1 a 5), no editable por el usuario.
- Estados de perfil: "Completo", "En revisión", "Incompleto".

REQUISITOS TÉCNICOS
JavaScript ES6+(Vanilla JS):
- Manipulación dinámica del DOM (mostrar/ocultar secciones, feedback visual).
- Uso de arreglos y objetos para gestionar adoptantes y criterios de calificación.
- Funciones modulares y reutilizables.

HTML5:
- Formularios semánticos con validaciones nativas (required, pattern, type).
- Estructura accesible y clara.

CSS3:
- Diseño responsivo con Flexbox y Grid.
- Paleta pastel (rosado, lila, blanco).
- Bordes redondeados, sombras suaves, transiciones delicadas.
- Inspiración en Material Design para botones, tarjetas y formularios.

UX/UI
- Interfaz amigable y accesible.
- Iconografía estilo Material Symbols Rounded:
  👤 Perfil (person)
  ✅ Validación (verified_user)
  📝 Formulario (assignment)
  📷 Evidencias (photo_camera)
  ⭐ Calificación (grade)
  💖 Adopción (volunteer_activism)
- Animaciones suaves al interactuar con formularios y botones.
- Diseño responsivo para móviles, tablets y escritorio.

OBJETIVO
- Garantizar transparencia y seguridad en los procesos de adopción.
- Facilitar la evaluación de adoptantes por parte de fundaciones.
- Promover la tenencia responsable y la confianza entre usuarios y organizaciones.
```

---

## 🆕 Nuevas Integraciones

### **Integración de Selección de Mascotas y Panel de Administración**

Este plan añade funcionalidad para que los adoptantes con perfil completo puedan elegir una mascota, y un panel de administración para gestionar solicitudes.

#### **Características Implementadas**

1. **Selección de Mascotas**
   - Botón "Elegir Mascota" visible solo para perfiles aprobados
   - Grid de mascotas disponibles
   - Mensaje de confirmación al seleccionar

2. **Panel de Administración**
   - Acceso mediante "Modo Administradora"
   - Tabla de solicitudes con filtros por estado
   - Botones: Aprobar, Rechazar, Ver Detalles
   - Actualización en tiempo real

3. **Estados de Solicitud**
   - **Pendiente**: Nueva solicitud, en espera de revisión
   - **Aprobada**: Adoptante validado, puede elegir mascota
   - **Rechazada**: No cumple criterios

4. **Integración con Mascotas**
   - Sincronización con landing page
   - Verificación de disponibilidad
   - Notificación en galería: "🎉 ¡Ya llegó a su feliz casa!"

---

## ✅ Manual de Verificación

### **Paso 1: Probar Registro de Adoptante**
1. Abre `adoptantes/index.html` en el navegador
2. Haz clic en "Completar Perfil"
3. Rellena todos los campos:
   - Nombre: Juan Pérez
   - RUT: 12345678-9 (o cualquier RUT válido)
   - Email: juan@ejemplo.com
   - Celular: 9 1234 5678
   - Región: Metropolitana (o cualquiera)
   - Comuna: Santiago (o cualquiera)
   - Dirección: Calle 123, Apt 4B
   - Vivienda: Casa con patio
4. Haz clic en "Siguiente"

### **Paso 2: Verificación de Código**
1. Se muestra tu número de celular
2. Copia el código simulado mostrado (ej: 1234)
3. Pégalo en el campo "Ingresa el código"
4. Haz clic en "Verificar"

### **Paso 3: Completar Perfil**
1. Rellena:
   - Experiencia: "Tengo 5 años de experiencia"
   - Adopciones previas: 2
   - Tiempo disponible: 40 (horas/semana)
   - Motivación: "Quiero proporcionar un hogar amoroso"
   - Evidencias: Sube alguna imagen (opcional)
2. Haz clic en "Guardar Perfil"
3. Verifica que el perfil se guarda y regresa al Dashboard

### **Paso 4: Ver Detalles del Perfil**
1. Desde el Dashboard, haz clic en "Ver mis datos"
2. Verifica que todos tus datos se muestran correctamente

### **Paso 5: Seleccionar Mascota (si perfil está aprobado)**
1. Desde el Dashboard, haz clic en "Elegir Mascota"
2. Selecciona una mascota de la lista
3. Verifica el mensaje de éxito

### **Paso 6: Panel de Administración**
1. Desde el Dashboard, haz clic en "Modo Administradora"
2. Verifica que tu solicitud aparece con estado "Pendiente"
3. Haz clic en "Aprobar"
4. Verifica que el estado cambia a "Aprobado"
5. Regresa al Dashboard (botón atrás)
6. Verifica que ahora aparece "Elegir Mascota"

### **Paso 7: Reiniciar Datos**
1. Desde el Dashboard, haz clic en "Borrar Datos"
2. Confirma la acción
3. Verifica que el formulario se limpia

---

## 👨‍💻 Desarrollo con IA

### **Herramientas Utilizadas**
- **Antigravity**: Especificación del prompt y estructura del proyecto
- **GitHub Copilot**: Desarrollo, optimización y debugging del código

### **Mejoras Aplicadas**
- ✓ Implementación de **Vanilla JavaScript puro** sin dependencias externas
- ✓ Refactorización de código para modularidad y legibilidad
- ✓ Optimización de validadores con algoritmos eficientes
- ✓ Mejora de accesibilidad (aria-labels y semántica HTML5)
- ✓ Debugging de errores de referencias a elementos inexistentes
- ✓ Integración de datos de regiones chilenas con estructura optimizada

### **Evidencia de Desarrollo**
Este README documenta que **Camino a Casa** fue desarrollado con asistencia de inteligencia artificial (Antigravity y GitHub Copilot) para estructura, estilos y lógica de negocio. Todos los componentes fueron revisados y optimizados para garantizar calidad profesional.

---

## 🚀 Cómo Usar

### **Instalación**
1. Clona o descarga el repositorio
2. No requiere instalación de dependencias
3. Abre `index.html` en tu navegador

### **Acceder al Módulo de Adoptantes**
1. Desde la landing page, haz clic en "Camino a la Adopción"
2. O navega directamente a `adoptantes/index.html`

---

## 📄 Licencia

[Ver archivo LICENSE](LICENSE)

---

## 💖 Créditos

**Desarrollado por**: Lesly (Fundadora de Camino a Casa)  
**Inspirado por**: Moka 🐾  
**Con asistencia de**: Antigravity y GitHub Copilot

---

**© 2026 Camino a Casa — Hecho con 💖**