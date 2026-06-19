# Biblioteca de Prompts de Imagem da Flatkey

[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [Español](README_es.md) | [Português](README_pt.md) | [Tiếng Việt](README_vi.md)

Biblioteca de prompts de geração de imagem pronta para marketing, feita para revendedores de API de IA, páginas de crescimento e onboarding de usuários. Usuários podem navegar por modelos, copiar prompts, substituir variáveis, registrar uma API key da Flatkey e gerar imagens por uma API compatível com OpenAI.

Obter API key: <https://flatkey.ai?utm_source=skill>

## Por Que Existe

- **Reduz atrito de ativação**: usuários começam com modelos testados, não com uma caixa de prompt vazia.
- **Aumenta conversão para API**: cada card de modelo leva ao registro da API key da Flatkey.
- **Cobre casos comerciais comuns**: marketing de produto, ecommerce, anúncios sociais, infográficos, avatares, screenshots de apps, assets de jogos e edição de imagens.
- **Suporta fluxos em lote**: modelos usam placeholders `{{variable}}`, fáceis de substituir antes de enviar o prompt final para a API.
- **Funciona como conteúdo de marketing**: útil como prompt gallery, tutorial, landing page ou recurso de onboarding.

## Modelos Incluídos

A biblioteca inclui 12 modelos frequentes de geração de imagem:

- Visual hero premium de produto
- Imagem principal de ecommerce com fundo branco
- Frame de capa para anúncio UGC
- Infográfico Bento de liquid glass
- Card de citação de fundador
- Pacote de avatares consistentes
- Pôster de screenshot para App Store
- Thumbnail de YouTube
- Key visual de pôster de evento
- Folha conceitual de props para jogos
- Troca de fundo preservando o sujeito
- Colagem Lookbook de moda

Cada modelo inclui:

- Título e caso de uso
- Categoria e modelo recomendado
- Variáveis substituíveis
- Texto completo do prompt
- Nota de uso da API
- Botão para copiar prompt
- Link de registro da API key da Flatkey

## Uso via CLI

Gere imagens diretamente pela CLI:

```bash
npx @flatkey-ai/image-buddy onboard
npx @flatkey-ai/image-buddy generate premium-product-hero \
  --var "产品名称=Image Buddy" \
  --var "品牌调性=clean SaaS" \
  --var "核心卖点=one-command image generation" \
  --var "主色=teal"
```

`onboard` solicita uma API key da Flatkey e salva localmente. Se você não tiver uma key, obtenha em <https://console.flatkey.ai/keys>. A CLI também lê `FLATKEY_IMAGE_API_KEY` ou `FLATKEY_API_KEY`, chama a API de imagens da Flatkey e salva as imagens localmente. Ela não inicia uma web por padrão.

`generate` usa Nano Banana por padrão via `router.flatkey.ai`. Use `--model gpt` somente quando precisar do endpoint GPT Image 2 compatível com OpenAI.

Instalação via código antes do release no npm:

```bash
npx github:flatkey-ai/awesome-images
```

Opções úteis:

```bash
npx @flatkey-ai/image-buddy web --port 5173
npx @flatkey-ai/image-buddy web --no-open
npx @flatkey-ai/image-buddy --help
```

Comandos para desenvolvimento:

```bash
npm install
npm test
npm run build
```

## Fluxo do Usuário

1. Executar `npx @flatkey-ai/image-buddy generate <template-id>` ou `npx @flatkey-ai/image-buddy generate --prompt "..."`.
2. Encontrar um modelo por categoria ou palavra-chave.
3. Expandir o modelo e copiar o prompt.
4. Substituir variáveis como `{{product_name}}`, `{{core_benefit}}` ou `{{brand_color}}`.
5. Registrar uma API key da Flatkey em <https://flatkey.ai?utm_source=skill>.
6. Chamar a API de imagens compatível com OpenAI da Flatkey para gerar imagens.


## Estrutura do Modelo

Todos os modelos ficam em [src/prompts.js](src/prompts.js).

Adicione um novo modelo com um objeto:

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

Depois rode:

```bash
npm test
```

O validador verifica quantidade de modelos, categorias, variáveis, tamanho do prompt e links de registro da Flatkey.

## Publicação por Release

A publicação roda a partir de GitHub Releases.

1. Adicione um npm automation token aos repository secrets do GitHub como `NPM_PUBLISH_TOKEN`.
2. Crie um GitHub Release com tag `v1.2.3` ou `1.2.3`.
3. O workflow ajusta `package.json` e `package-lock.json` para a versão do release.
4. O workflow roda validação, build e `npm publish --access public`.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=flatkey-ai/awesome-images&type=Date)](https://www.star-history.com/#flatkey-ai/awesome-images&Date)
