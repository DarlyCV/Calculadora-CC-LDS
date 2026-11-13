# Calculadora de Capacidad de Cables - Luz del Sur

Aplicación web interactiva optimizada para dispositivos móviles diseñada para el cálculo y verificación de capacidad de cables de distribución, factor de utilización (F.U.) y cargas de fase (R, S, T) en Subestaciones de Distribución (SED).

---

## ⚡ Nueva Lógica Técnica (Corriente I aire + Factor de Agrupamiento)

### 1. Tabla Maestra de Corrientes Admisibles (I aire por terna):
Valores normalizados para conductores al aire:
* **N2XY**: 70 (279 A), 120 (400 A), 185 (533 A), 240 (634 A), 300 (736 A), 500 (998 A), 800 (998 A).
* **NYY**: 70 (250 A), 120 (356 A), 185 (470 A), 240 (562 A), 300 (646 A), 500 (895 A), 800 (895 A).
* **NA2XY**: 95 (256 A), 120 (300 A), 185 (403 A), 240 (482 A), 300 (558 A), 400 (662 A), 500 (662 A).
* **NAYY**: 120 (272 A), 185 (363 A), 300 (502 A), 400 (594 A), 500 (691 A).

### 2. Tabla de Factor de Agrupamiento:
| Ternas Totales | Factor de Agrupamiento (F.A.) |
| :---: | :---: |
| 1 | 1.00 |
| 2 | 0.80 |
| 3 | 0.70 |
| 4 | 0.65 |
| 5 | 0.65 |

### 3. Fórmula de Cálculo:
$$\text{Capacidad Base Fila } i = I_{\text{aire}} \times \text{Ternas}_i$$
$$\text{Ternas Totales} = \sum \text{Ternas}_i$$
$$\text{Capacidad Total Admisible} = \left(\sum \text{Capacidad Base}_i\right) \times \text{Factor de Agrupamiento}(\text{Ternas Totales})$$

#### Ejemplo 1 (1 Configuración):
* 2 ternas de NYY 500 (895 A):
  $$\text{Capacidad Total} = (895 \times 2) \times 0.8 = 1790 \times 0.8 = 1432\text{ A}$$

#### Ejemplo 2 (Múltiples Configuraciones):
* Conf 1: 1 terna NYY 500 (895 A) $\rightarrow 895 \times 1 = 895\text{ A}$
* Conf 2: 2 ternas N2XY 185 (533 A) $\rightarrow 533 \times 2 = 1066\text{ A}$
* Ternas totales: $1 + 2 = 3\text{ ternas}$ $\rightarrow \text{F.A.} = 0.7$
* Capacidad Total:
  $$(895 + 1066) \times 0.7 = 1961 \times 0.7 = 1372.70\text{ A}$$

---

## 📁 Archivos del Proyecto

```text
├── index.html       # Interfaz con cuadro de Factor de Agrupamiento
├── style.css        # Estilos móviles y paleta Luz del Sur
├── app.js           # Lógica matemática con F.A. y F.U.
├── cables-data.js   # Base de datos de I aire y factores de agrupamiento
├── sed-data.js      # Listado maestro oficial de SEDs
└── README.md        # Documentación técnica
```

---

*Calculadora Técnica de Conductor © Luz del Sur ││ Elaborado por DCV Company*
