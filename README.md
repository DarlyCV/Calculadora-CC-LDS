# Calculadora de Capacidad de Cables - Luz del Sur

Aplicación web interactiva optimizada para dispositivos móviles diseñada para el cálculo y verificación de capacidad de cables de distribución, factor de utilización (F.U.) y cargas de fase (R, S, T) en Subestaciones de Distribución (SED).

---

## ⚡ Características Principales

- **Identidad Visual Oficial**: Paleta de colores institucional de **Luz del Sur** (Azul Marino y Amarillo Energía) con diseño Mobile-First.
- **Filtro Predictivo de SEDs**: Búsqueda interactiva en tiempo real sobre más de 440 SEDs registradas.
- **Filtro Dinámico de Conductores**:
  - **Cobre (Cu)**: `NYY`, `N2XY`
  - **Aluminio (Al)**: `NA2XY`, `NAYY`
  - Secciones normalizadas automáticas por tipo de conductor.
- **Cálculo de Cargas y Capacidad**:
  - Cálculo de capacidad total por ternas: $\text{Capacidad Unitaria} \times \text{Ternas}$.
  - Identificación automática de la corriente máxima de fase: $\max(R, S, T)$.
- **Semáforo Inteligente de Factor de Utilización (F.U.)**:
  - 🟢 **< 90% (Verde)**: Normal (Capacidad admisible óptima).
  - 🟡 **90% a 100% (Amarillo)**: Alerta (Carga elevada próxima al límite).
  - 🔴 **> 100% (Rojo)**: Sobrecarga (Capacidad superada).
- **Acceso Directo a Fono Luz (`01 2892301`)**:
  - En caso de sobrecarga (> 100%), permite copiar el teléfono al portapapeles y enlazar la llamada directamente desde el celular.
- **Herramientas de Terreno**:
  - Botón **Copiar Reporte** listo para compartir por WhatsApp o correo técnico.
  - Modal de consulta rápida con la **Tabla Maestra de Capacidad**.

---

## 📁 Estructura del Proyecto

```text
├── index.html       # Estructura de la aplicación web
├── style.css        # Estilos móviles y diseño Luz del Sur
├── app.js           # Lógica de cálculo reactivo y eventos
├── cables-data.js   # Base de datos de cables y secciones
├── sed-data.js      # Listado maestro oficial de SEDs
└── README.md        # Documentación del proyecto
```

---

*Calculadora Técnica de Conductor © Luz del Sur ││ Elaborado por DCV Company*
