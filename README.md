# Alejandría — Frontend

Interfaz web de **Alejandría**, un repositorio académico abierto y descentralizado. Permite registrar publicaciones académicas en la blockchain de Sepolia y almacenar los documentos en IPFS, sin depender de servidores centralizados.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Angular | 21 | Framework principal (SPA) |
| PrimeNG + Angular Material | 21 / 21 | Componentes UI |
| TailwindCSS | 4 | Estilos utilitarios |
| viem | 2 | Interacción con contratos Ethereum |
| MetaMask Connect-EVM | 1 | Conexión de cartera |
| Pinata | — | Gateway IPFS para subir documentos |
| Vitest | 4 | Tests unitarios |
| Firebase Hosting | — | Despliegue en producción |

## Rutas

| Ruta | Descripción |
|---|---|
| `/buscar` | Busca publicaciones por ID o hash de contenido |
| `/registrar` | Registra una nueva publicación (requiere MetaMask) |
| `/certificado` | Muestra el certificado de registro de una publicación |

## Requisitos previos

- Node.js 20+
- [Angular CLI](https://angular.dev/tools/cli) 21+
- Extensión **MetaMask** en el navegador, configurada para la red **Sepolia**
- ETH de prueba en Sepolia (disponible en faucets públicos)

## Desarrollo local

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

## Variables de entorno

Las configuraciones sensibles se declaran en `src/environments/environment.ts`:

| Variable | Descripción |
|---|---|
| `contractAddress` | Dirección del contrato `AlejandriaRegistry` en Sepolia |
| `rpcUrl` | URL del nodo RPC de Sepolia (Infura u otro) |
| `chainId` | ID de la cadena (`11155111` para Sepolia) |
| `pinataJwt` | JWT de Pinata para subir archivos a IPFS |
| `pinataGatewayUrl` | URL del gateway de Pinata para acceder a los archivos |

> No expongas `pinataJwt` en repositorios públicos en producción. Para producción, usa un proxy backend o variables de entorno en el servidor de CI/CD.

## Contrato desplegado

| Red | Dirección |
|---|---|
| Sepolia Testnet | [`0xD54baC82fEDC77c1f74DDC4137A36398694F14CA`](https://sepolia.etherscan.io/address/0xD54baC82fEDC77c1f74DDC4137A36398694F14CA) |

## Build de producción

```bash
npm run build
```

Los artefactos se generan en `dist/`. Firebase Hosting los toma desde ahí:

```bash
firebase deploy
```

## Tests

```bash
npm test
```

Ejecuta los tests unitarios con Vitest.

## Estructura del proyecto

```
src/app/
├── core/
│   ├── models/          # Modelos de datos (Publication, ABI del contrato)
│   └── services/        # contract, metamask, pinata, certificate-state, env, text-normalizer
├── pages/
│   ├── register/        # Formulario de registro de publicación
│   ├── search/          # Búsqueda por ID
│   └── certificate/     # Vista del certificado de registro
└── shared/
    └── components/      # navbar, publication-card, pub-type-badge, registration-certificate
```

## Flujo principal

1. Usuario conecta MetaMask (`/registrar`).
2. Completa los metadatos de la publicación y sube el PDF.
3. El frontend sube el PDF a IPFS via Pinata y obtiene el CID.
4. Se calcula el SHA-256 del documento como `contentHash`.
5. Se llama a `AlejandriaRegistry.register()` firmando con MetaMask.
6. La transacción queda confirmada en Sepolia y se genera el certificado.

---

> Red: Sepolia Testnet &nbsp;|&nbsp; Estado: En desarrollo
