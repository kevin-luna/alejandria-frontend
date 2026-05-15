# 📚 Alejandría
### Repositorio Académico Abierto y Descentralizado

> Una DApp que registra propiedad intelectual académica en blockchain y almacena documentos en IPFS, como alternativa abierta y gratuita a plataformas centralizadas como arXiv.org.

---

## Tabla de Contenidos

- [Visión General](#visión-general)
- [El Problema](#el-problema)
- [Posicionamiento del Producto](#posicionamiento-del-producto)
- [Partes Interesadas y Usuarios](#partes-interesadas-y-usuarios)
- [Necesidades Clave](#necesidades-clave)
- [Comparación con la Competencia](#comparación-con-la-competencia)
- [Características del Producto](#características-del-producto)
- [Arquitectura y Dependencias](#arquitectura-y-dependencias)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Requisitos de Seguridad](#requisitos-de-seguridad)

---

## Visión General

**Alejandría** es una aplicación descentralizada (DApp) que opera sobre la **red de prueba Sepolia de Ethereum**. Su propósito es proveer un repositorio académico abierto, gratuito y descentralizado para el registro de propiedad intelectual sobre publicaciones académicas: tesis, tesinas, artículos, ensayos y más.

No existe un servidor central propio. Toda la lógica de negocio reside en **contratos inteligentes** desplegados en Sepolia. Los documentos completos se almacenan en **IPFS**, garantizando persistencia descentralizada.

---

## El Problema

| Campo | Descripción |
|---|---|
| **El problema de** | La centralización, el acceso restringido y la falta de mecanismos confiables para verificar la autoría y propiedad intelectual de publicaciones académicas. |
| **Afecta a** | Estudiantes universitarios, docentes, investigadores, instituciones educativas y bibliotecas académicas, especialmente en países en desarrollo. |
| **Cuyo impacto es** | Pérdida o disputa de autoría, barreras económicas para la publicación y consulta, riesgo de censura o pérdida por fallo de servidores centralizados, y exclusión de comunidades académicas con recursos limitados. |
| **Una solución exitosa sería** | Un repositorio completamente gratuito, descentralizado e inmutable que permita registrar publicaciones académicas con prueba criptográfica de autoría, accesible para cualquier usuario en el mundo sin restricciones económicas ni geográficas. |

---

## Posicionamiento del Producto

| Campo | Descripción |
|---|---|
| **Para** | Estudiantes universitarios, docentes e investigadores que generan publicaciones académicas. |
| **Quien** | Necesita registrar, preservar y compartir su producción intelectual de forma confiable, gratuita y sin dependencia de intermediarios. |
| **Alejandría es** | Una aplicación descentralizada (DApp) de repositorio académico abierto. |
| **Que** | Registra la propiedad intelectual de publicaciones académicas en blockchain y almacena los documentos completos en IPFS, garantizando inmutabilidad, gratuidad y acceso universal. |
| **A diferencia de** | arXiv.org, ResearchGate y otros repositorios centralizados que dependen de servidores propietarios, imponen restricciones de acceso o no ofrecen mecanismos criptográficos de verificación de autoría. |
| **Nuestro producto** | Es completamente descentralizado (blockchain + IPFS), gratuito, abierto y ofrece prueba inmutable de autoría sin depender de ninguna autoridad centralizada. |

---

## Partes Interesadas y Usuarios

### Grupos de Interés (Stakeholders)

| Nombre | Descripción | Responsabilidades |
|---|---|---|
| **Instituciones universitarias** | Universidades y centros académicos que generan y resguardan producción intelectual. | Avalar la legitimidad de publicaciones; promover el uso de la plataforma entre su comunidad. |
| **Bibliotecas y archivos académicos** | Entidades responsables de preservar y dar acceso al acervo bibliográfico. | Garantizar la preservación del conocimiento; integrar Alejandría como fuente de consulta. |
| **Comunidad open source / Desarrolladores** | Desarrolladores que contribuyen al ecosistema descentralizado y al protocolo. | Mantener y evolucionar los contratos inteligentes; auditar el código; desarrollar integraciones. |

### Usuarios

| Nombre | Descripción | Responsabilidades |
|---|---|---|
| **Estudiantes universitarios** | Alumnos de nivel superior que generan tesis, tesinas y ensayos académicos. | Subir y registrar sus publicaciones; consultar trabajos de otros autores. |
| **Docentes e investigadores** | Académicos que producen artículos, investigaciones y materiales de divulgación. | Publicar resultados de investigación; verificar autoría de documentos. |

### Entorno de Usuario

- El usuario interactúa con Alejandría mediante una **interfaz web en Angular**, accesible desde cualquier navegador moderno.
- Para **publicar** un documento, se requiere la extensión **MetaMask** con una cuenta activa en Sepolia con ETH de prueba.
- La **consulta y búsqueda** de publicaciones es pública y no requiere cartera digital.
- El ciclo de tarea principal (subir publicación) implica: conectar cartera → completar metadatos → subir archivo a IPFS → firmar transacción. Tiempo estimado: **2 a 5 minutos** según la congestión de la red.

---

## Necesidades Clave

| Necesidad | Prioridad | Preocupación | Solución propuesta |
|---|---|---|---|
| Registro inmutable de autoría | 🔴 Alta | Falta de verificación confiable de propiedad intelectual. | Registro en blockchain Sepolia mediante contrato inteligente. |
| Acceso abierto y gratuito | 🔴 Alta | Repositorios con acceso restringido o de pago. | Plataforma completamente gratuita y sin barreras de acceso. |
| Descentralización del almacenamiento | 🔴 Alta | Dependencia de servidores centralizados susceptibles a censura o fallo. | Almacenamiento de documentos completos en IPFS. |
| Accesibilidad para países en desarrollo | 🟡 Media | Barreras de pago e idioma en repositorios internacionales. | Acceso universal sin costo, sobre infraestructura pública descentralizada. |

---

## Comparación con la Competencia

| Alternativa | Fortalezas | Debilidades frente a Alejandría |
|---|---|---|
| **arXiv.org** | Amplia comunidad, gran catálogo, reconocimiento internacional. | Centralizado, acceso restringido por disciplina, sin verificación criptográfica de autoría. |
| **ResearchGate** | Red social académica, perfiles de investigador, métricas de impacto. | Centralizado, con fines comerciales, no todos los documentos son de acceso abierto. |
| **Zenodo (CERN)** | Repositorio abierto, soportado por CERN, DOI gratuito. | Centralizado, sin inmutabilidad garantizada por blockchain. |

---

## Características del Producto

### 1. Registro de publicación en blockchain
El usuario puede registrar una publicación académica (tesis, tesina, artículo, ensayo) mediante un contrato inteligente en la red Sepolia. El registro incluye metadatos (título, autor, tipo de documento, fecha) y el hash IPFS del archivo.

### 2. Almacenamiento en IPFS
El documento completo se almacena en la red IPFS, garantizando persistencia descentralizada. El CID (Content Identifier) generado se enlaza al registro en blockchain.

### 3. Búsqueda y consulta de publicaciones
Interfaz de búsqueda que permite encontrar publicaciones por título, autor, tipo o palabras clave. Cualquier usuario puede consultar el catálogo **sin necesidad de cartera digital**.

### 4. Verificación de autoría
Cualquier interesado puede verificar la autoría de un documento consultando el registro inmutable en la blockchain de Sepolia, incluyendo la dirección de cartera del registrante y la marca de tiempo.

### 5. Integración con MetaMask
La DApp se conecta a la cartera MetaMask del usuario mediante la librería **MetaMask Connect-EVM**, permitiendo firmar transacciones para el registro de publicaciones sin custodia de claves por parte del sistema.

---

## Arquitectura y Dependencias

```
Usuario (Angular SPA)
    │
    ├── MetaMask Connect-EVM ──► Red Sepolia (Ethereum Testnet)
    │                                └── Smart Contract (lógica de registro)
    │
    └── IPFS Client ──────────► Red IPFS (almacenamiento de documentos)
```

### Referencias técnicas

- [Ethereum Sepolia Testnet](https://sepolia.etherscan.io)
- [IPFS (InterPlanetary File System)](https://ipfs.tech)
- [MetaMask Connect-EVM](https://docs.metamask.io)
- [Angular Framework](https://angular.io)
- [arXiv.org](https://arxiv.org) *(referencia como alternativa existente)*

### Suposiciones y dependencias clave

- El usuario tiene instalada y configurada la extensión **MetaMask** con cuenta en la red Sepolia.
- Se asume disponibilidad continua de **nodos públicos de Sepolia** para la confirmación de transacciones.
- Se asume disponibilidad de la **red IPFS** para almacenamiento y recuperación de documentos.
- Este documento deberá revisarse si el proyecto **migra a una red principal (mainnet)** de Ethereum u otra cadena.
- La gratuidad del registro depende del uso de **ETH de prueba en Sepolia**; en mainnet, los costos de gas deberían reconsiderarse.

---

## Requisitos del Sistema

| Tipo | Requisito |
|---|---|
| **Navegador** | Chrome, Firefox o Brave (con soporte de extensiones) |
| **Extensión** | MetaMask instalada y configurada para la red Sepolia |
| **Conectividad** | Conexión a Internet para interactuar con blockchain e IPFS |

### Rendimiento

- La confirmación de transacciones en Sepolia está sujeta a la congestión de la red (estimado: **12–60 segundos**).
- La carga de documentos a IPFS depende del tamaño del archivo y la velocidad de conexión del usuario.

---

## Requisitos de Seguridad

- Las **claves privadas** de los usuarios nunca son accedidas ni almacenadas por el sistema; toda firma se delega a MetaMask.
- Los contratos inteligentes deben ser **auditados** antes de un eventual despliegue en mainnet.
- El contenido almacenado en IPFS es **público**; no debe publicarse información confidencial o sensible.

---

> **Versión:** 1.0 &nbsp;|&nbsp; **Estado:** En desarrollo &nbsp;|&nbsp; **Red:** Sepolia Testnet
