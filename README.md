# Knitwright Store

Storefront for Knitwright custom team sportswear.

- **Layout and motion** follow cartflami.com.br: notched header on scroll, per-letter headlines that ink in as you scroll, dashed section dividers, cornered bento frames, blob-masked art, marquees, a dark process band and a pricing trio.
- **Content** is adapted from vmfsportswear.ca and merged with Knitwright's production facts.
- **Colours and fonts** come from knitwright.com: ink `#0f1012`, cobalt `#2b46f0`, the "thread" gradient, Geist and Geist Mono.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # cart + customiser unit tests (vitest)
npm run photos   # (re)generate photography — needs FAL_KEY or OPENAI_API_KEY in .env.local
npm run build    # type-check + production build to dist/
```

## Structure

| Path | Purpose |
|------|---------|
| `src/data/catalog.ts` | Products, swatches, sizes, prices |
| `src/data/content.ts` | All page copy (services, FAQ, tiers…) |
| `src/store/cartLogic.ts` | Pure cart reducer, sanitisers, form validation (tested) |
| `src/store/cart.tsx` | Store context: cart, drawer/quick-view state, toasts, localStorage |
| `src/customiser/*` | Live jersey customiser: zone geometry (`templates.ts`), design rules (`design.ts`, tested), photoreal SVG renderer (`JerseyPreview.tsx`) |
| `src/components/Photo.tsx` | `TintedPhoto` (recolours a white cutout per colourway) and `ScenePhoto` |
| `src/components/ProductVisual.tsx` | Picks the jersey renderer or a tinted photo for any product |
| `scripts/gen-photos.mjs` | Shot list + generator for everything in `public/photos/` |
| `src/components/motion.tsx` | `SplitHeadline`, `Reveal`, `Parallax`, `Marquee` |
| `src/sections/*` | Page sections in scroll order (see `App.tsx`) |

## Photography

Images in `public/photos/` are AI-generated with fal.ai (Flux Pro) by `npm run photos`.
- **Product cutouts** are white garments on transparent backgrounds. The store tints them live, so one photo covers every colourway.
- **Scenes** are lifestyle shots. Their prompts forbid crests, logos and brand marks. Review any regenerated image for stray marks before publishing.

To regenerate one image: `npm run photos -- --force scene-hero`. To add a product photo: add a shot to `SHOTS` in the script, then set `photo` on the product in `catalog.ts`.

If you add a jersey photo to the customiser, measure its zones (sleeves, yoke, collar, stripe slots) in the 900×900 cutout space and add a view to `templates.ts`.

## Quote requests (email)

"Send request" in the cart emails an itemised quote through [Web3Forms](https://web3forms.com). The free plan allows 250 submissions a month and needs no card. The email contains the contact details, team, every item (size, colourway, name and number), full customiser designs, piece count and estimated subtotal. Replying to it goes straight to the customer.

Setup:
1. Go to web3forms.com, enter the inbox that should receive quotes (e.g. sales@knitwright.com), and copy the access key it emails you.
2. Add `VITE_WEB3FORMS_KEY=your-key` to `.env.local` and restart `npm run dev`. On your host (Vercel, Netlify…), add the same variable before building.

The key is public by design: it can only send to the inbox it was created for. Spam is filtered by Web3Forms plus a hidden honeypot field. Uploaded logos aren't attached (attachments are a paid feature), so the email flags when the customer used one.

## Before launch

- **Prices** in `catalog.ts` and the sample price in `TIERS` are indicative placeholders. Confirm them with production.
- **The newsletter form** is not yet connected to a mailing provider.
- **Imagery** is AI-generated. When you have real product photography, white-on-transparent cutouts drop straight into `public/photos/` with the same filenames.
- **Uploaded logos** stay in the shopper's browser. The quote email should ask for a print-ready file.
