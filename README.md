# Nova 26 — Credenciales académicas verificables (SSI)

> Trabajo de Fin de Grado (TFG) · Prototipo de **Identidad Autosoberana** (*Self-Sovereign Identity*, SSI) para emitir, guardar, presentar y verificar títulos universitarios sin depender de un servidor central de confianza.

Nova 26 implementa el **triángulo de confianza** de SSI con tres portales web:

| Rol | Ruta | Qué hace |
|---|---|---|
| **Emisor** (*Issuer*, la universidad) | `/portal-issuer` | Da de alta la institución, emite títulos firmados y los revoca |
| **Titular** (*Holder*, el estudiante) | `/wallet-holder` | Carga su título, elige qué datos revela y firma una presentación |
| **Verificador** (*Verifier*, p. ej. una empresa) | `/verify` | Audita criptográficamente la presentación y comprueba si el título está revocado |

Todo el trabajo criptográfico se hace **en el navegador** con la Web Crypto API. Las claves privadas nunca se envían al servidor.

---

## Funcionalidades

- **Alta de instituciones.** El emisor genera un par de claves **Ed25519** en el navegador y descarga su clave privada. Al registrarse se crean su **documento DID** (`did:nova26:<prefijo>`), su **Bitstring Status List** y su entrada en el registro público de confianza (`public/registry.json`).
- **Emisión de credenciales.** Se emiten títulos en formato **W3C Verifiable Credential**. Cada dato (nombre, universidad, titulación, tipo, nota media, fecha de nacimiento) lleva un `salt` aleatorio y su hash `SHA-256(value + salt)`. El emisor canonicaliza el payload (JCS), calcula su hash y lo firma con su clave privada. A la vez se genera la cartera de claves del estudiante.
- **Divulgación selectiva** (*Selective Disclosure*). El titular decide qué datos enseña. Los datos ocultos solo conservan su hash, así que la firma del emisor sigue siendo válida sin revelar su valor.
- **Presentaciones verificables.** El titular firma la *Verifiable Presentation* con su propia clave Ed25519. Esto demuestra que quien la presenta es el dueño del título.
- **Verificación.** El verificador busca la clave del emisor en el registro, recalcula los hashes de los datos revelados y valida la firma del emisor y la del titular. Después consulta la lista de estado.
- **Revocación.** El emisor puede revocar o reactivar un título cambiando un bit de su *Bitstring Status List* (`/portal-issuer/revocation`).
- **Web informativa.** Páginas que explican SSI, el triángulo de confianza, una guía para el titular y la parte de privacidad (RGPD, derecho al olvido).

## Flujo

```
 Emisor (universidad)              Titular (estudiante)               Verificador
 ───────────────────               ────────────────────               ───────────
 1. Registra la institución
    → DID + status list + registro
 2. Emite el título firmado  ───►  3. Recibe diploma.json + claves
                                   4. Elige qué datos revela
                                   5. Firma la presentación   ───►   6. Comprueba el emisor en el registro
                                                                      7. Recalcula los hashes y valida las firmas
 8. (Opcional) Revoca el título  ─────────────────────────────────►  9. Consulta la Bitstring Status List
```

## Tecnologías

- **[Next.js 16](https://nextjs.org)** (App Router para las páginas y `pages/api` para las rutas de servidor), **React 19** y **TypeScript**
- **Tailwind CSS 4**
- **Web Crypto API**: Ed25519 (generación de claves, firma y verificación) y SHA-256
- Estándares W3C en los que se basa: *Verifiable Credentials*, *Decentralized Identifiers* (DID), *Data Integrity* y *Bitstring Status List*

## Estructura del proyecto

```
app/
├── page.tsx                    # Portada: qué es SSI y el triángulo de confianza
├── components/Navbar.tsx
├── portal-issuer/              # Portal del emisor (alta, emisión)
│   └── revocation/             # Revocación de títulos
├── wallet-holder/              # Cartera del titular (divulgación selectiva y firma de la VP)
├── verify/                     # Portal del verificador
├── holder-guide/               # Guía de uso para el titular
├── privacy-security/           # Privacidad, RGPD y seguridad
└── download/
pages/api/
├── register-institution.ts     # POST: crea el DID, la status list y la entrada en el registro
└── revoke.ts                   # POST: activa o desactiva el bit de revocación
public/
├── registry.json               # Registro de confianza: clave pública → institución
├── dids/                       # Documentos DID de cada institución
└── status-lists/               # Bitstring Status Lists (0 = válido, 1 = revocado)
```

## Instalación y ejecución

Requisitos: **Node.js 20+** y un navegador moderno con soporte de Ed25519 en Web Crypto (Chrome, Edge, Firefox o Safari recientes).

```bash
git clone https://github.com/alexfer1710/nova26-ssi.git
cd nova26-ssi
npm install
npm run dev
```

Abre <http://localhost:3000>.

Otros scripts:

```bash
npm run build   # compilación de producción
npm start       # servir la compilación
npm run lint
```

## Prueba rápida

1. **Emisor.** Entra en `/portal-issuer`, registra una institución y guarda la clave privada que se descarga. Rellena el formulario y emite un título. Se descargan el diploma y la cartera de claves del estudiante.
2. **Titular.** En `/wallet-holder` carga el diploma y la cartera, marca qué datos quieres revelar y genera la presentación firmada.
3. **Verificador.** En `/verify` sube la presentación y revisa el resultado de la auditoría.
4. **Revocación.** En `/portal-issuer/revocation` revoca el título y vuelve a verificarlo.

## Limitaciones (es un prototipo)

- El registro de confianza, los DIDs y las status lists se guardan como ficheros JSON en `public/`, que las rutas de la API modifican en disco. En una versión real vivirían en una blockchain o en un registro distribuido. Por eso la app necesita un servidor con sistema de ficheros escribible y no funciona tal cual en hosting *serverless*.
- Las rutas de la API no tienen autenticación.
- El método `did:nova26` y las URLs `nova26.id` son ficticios.
- La prueba se etiqueta como `ecdsa-sd-2023`, pero la implementación es propia: hashes con salt por dato y una firma Ed25519 sobre el payload canonicalizado. Sigue la idea de esa *cryptosuite*, no su especificación exacta.
- Las instituciones del registro y la credencial de `app/wallet-holder/data/` son datos de prueba.

## Autor

Alex Fernández Pacheco · Trabajo de Fin de Grado
