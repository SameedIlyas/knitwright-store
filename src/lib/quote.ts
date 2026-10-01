import { describeDesign, type Design } from '../customiser/design'
import { findProduct } from '../data/catalog'
import { formatCAD, type CartLine, type OrderForm } from '../store/cartLogic'

const ENDPOINT = 'https://api.web3forms.com/submit'

export interface Quote {
  subject: string
  from_name: string
  name: string
  email: string
  replyto: string
  team: string
  message: string
}

export type SendResult = { ok: true } | { ok: false; error: string }

type Fetcher = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>

function designLines(d: Design): string[] {
  const colours = `Body ${d.body} · Sleeves ${d.sleeves} · Yoke ${d.yoke} · Collar ${d.trim} · Stripes ${d.stripeA}/${d.stripeB} · Lettering ${d.textColor} (${d.font})`
  const out = [`   Custom design: ${describeDesign(d)}`, `   ${colours}`]
  if (d.hasLogo) out.push('   Logo uploaded in the customiser: ask the customer for a print-ready file.')
  return out
}

/** Turns the cart and contact form into an itemised, human-readable quote email. */
export function buildQuote(form: OrderForm, lines: readonly CartLine[]): Quote {
  const items = lines.flatMap((line) => {
    const product = findProduct(line.productId)
    return product ? [{ line, product }] : []
  })
  const pieces = items.reduce((n, { line }) => n + line.qty, 0)
  const total = items.reduce((n, { line }) => n + line.qty * line.unitPrice, 0)
  const team = form.team.trim()
  const who = team || form.name.trim()

  const body = items.flatMap(({ line, product }, i) => {
    const details = [
      line.custom ? null : `Colourway: ${line.swatch}`,
      `Size: ${line.size}`,
      line.name ? `Name: ${line.name}` : null,
      line.number ? `No. ${line.number}` : null,
    ].filter(Boolean)
    return [
      `${i + 1}. ${line.qty} × ${product.name} @ ${formatCAD(line.unitPrice)} = ${formatCAD(line.qty * line.unitPrice)}`,
      `   ${details.join(' · ')}`,
      ...(line.custom ? designLines(line.custom) : []),
      '',
    ]
  })

  const message = [
    `New quote request from the Knitwright store.`,
    '',
    `Contact: ${form.name.trim()} <${form.email.trim()}>`,
    `Team / organisation: ${team || 'not given'}`,
    '',
    'ITEMS',
    ...body,
    `Total pieces: ${pieces}`,
    `Estimated subtotal: ${formatCAD(total)} (before tax and shipping; confirm pricing in the quote)`,
    '',
    'Reply to this email to answer the customer directly.',
  ].join('\n')

  return {
    subject: `Quote request: ${who} (${pieces} ${pieces === 1 ? 'piece' : 'pieces'}, ${formatCAD(total)})`,
    from_name: 'Knitwright Store',
    name: form.name.trim(),
    email: form.email.trim(),
    replyto: form.email.trim(),
    team: team || '-',
    message,
  }
}

/** Sends the quote through Web3Forms (free plan). The access key is designed to be public. */
export async function sendQuote(quote: Quote, accessKey: string | undefined, fetcher: Fetcher = fetch): Promise<SendResult> {
  if (!accessKey) return { ok: false, error: "Quote requests aren't set up yet. Please email us directly." }
  try {
    const res = await fetcher(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, botcheck: false, ...quote }),
    })
    const data = (await res.json()) as { success?: boolean }
    if (res.ok && data.success) return { ok: true }
    return { ok: false, error: 'We couldn’t send your request just now. Please try again in a minute.' }
  } catch {
    return { ok: false, error: 'No connection. Check your internet and try again.' }
  }
}
