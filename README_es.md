# Biblioteca de Prompts de Imagen de Flatkey

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

Biblioteca de prompts de generación de imágenes lista para marketing, pensada para revendedores de API de IA, páginas de crecimiento y onboarding de usuarios. Los usuarios pueden explorar plantillas, copiar prompts, reemplazar variables, registrar una API key de Flatkey y generar imágenes mediante una API compatible con OpenAI.

Obtener API key: <https://flatkey.ai?utm_source=skill>

## Por Qué Existe

- **Reduce la fricción de activación**: los usuarios empiezan con plantillas probadas, no con una caja de prompt vacía.
- **Aumenta la conversión hacia la API**: cada tarjeta de plantilla dirige al registro de API key de Flatkey.
- **Cubre casos comerciales comunes**: marketing de producto, ecommerce, anuncios sociales, infografías, avatares, capturas de apps, assets de juego y edición de imágenes.
- **Soporta flujos por lote**: las plantillas usan placeholders `{{variable}}`, fáciles de reemplazar antes de enviar el prompt final a la API.
- **Sirve como contenido de marketing**: útil como prompt gallery, tutorial, landing page o recurso de onboarding.

## Plantillas Incluidas

La biblioteca incluye 12 plantillas frecuentes de generación de imágenes:

- Visual hero premium de producto
- Imagen principal ecommerce con fondo blanco
- Frame de portada para anuncio UGC
- Infografía Bento de liquid glass
- Tarjeta de cita de fundador
- Pack de avatares consistentes
- Póster de captura para App Store
- Miniatura de YouTube
- Key visual de póster de evento
- Hoja conceptual de props para juegos
- Cambio de fondo preservando el sujeto
- Collage Lookbook de moda

Cada plantilla incluye:

- Título y caso de uso
- Categoría y modelo recomendado
- Variables reemplazables
- Texto completo del prompt
- Nota de uso para API
- Botón para copiar prompt
- Enlace de registro de API key de Flatkey

## Uso con CLI

Genera imágenes directamente desde la CLI:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal"
```

`onboard` pide una API key de Flatkey y la guarda localmente. Si no tienes key, consíguela en <https://console.flatkey.ai/keys>. La CLI también lee `FLATKEY_IMAGE_API_KEY` o `FLATKEY_API_KEY`, llama a la API de imágenes de Flatkey y guarda las imágenes localmente. No inicia una web por defecto.

Instalación desde el código antes del release en npm:

```bash
npx github:flatkey-ai/awesome-images
```

Opciones útiles:

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

Comandos para desarrollo:

```bash
npm install
npm test
npm run build
```

## Flujo de Usuario

1. Ejecutar `npx @flatkey-ai/image-buddy generate <template-id>` o `npx @flatkey-ai/image-buddy generate --prompt "..."`.
2. Encontrar una plantilla por categoría o palabra clave.
3. Expandir la plantilla y copiar el prompt.
4. Reemplazar variables como `{{product_name}}`, `{{core_benefit}}` o `{{brand_color}}`.
5. Registrar una API key de Flatkey en <https://flatkey.ai?utm_source=skill>.
6. Llamar a la API de imágenes compatible con OpenAI de Flatkey para generar imágenes.

## Ejemplo de API

```bash
curl https://api.flatkey.ai/v1/images/generations \
  -H "Authorization: Bearer $FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "final prompt after replacing template variables",
    "size": "1536x1024"
  }'
```

## Estructura de Plantilla

Todas las plantillas están en [src/prompts.js](src/prompts.js).

Agrega una nueva plantilla añadiendo un objeto:

```js
{
  id: "unique-template-id",
  title: "Template title",
  category: "product",
  badge: "Hero",
  aspectRatio: "16:9",
  model: "gpt-image-2",
  apiUseCase: "Best-fit API use case.",
  description: "Template description.",
  variables: ["product_name", "core_benefit"],
  prompt: "Create a commercial hero image for {{product_name}}..."
}
```

Después ejecuta:

```bash
npm test
```

El validador revisa cantidad de plantillas, categorías, variables, longitud del prompt y enlaces de registro de Flatkey.

## Publicación por Release

La publicación se ejecuta desde GitHub Releases.

1. Agrega un npm automation token a los repository secrets de GitHub como `NPM_PUBLISH_TOKEN`.
2. Crea un GitHub Release con tag `v1.2.3` o `1.2.3`.
3. El workflow ajusta `package.json` y `package-lock.json` a la versión del release.
4. El workflow ejecuta validación, build y `npm publish --access public`.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
