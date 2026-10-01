/**
 * Site copy. Customisation, service and FAQ content is adapted from vmfsportswear.ca
 * and merged with Knitwright's production facts (Sialkot, 50-piece minimum,
 * 10-day sampling, 4–5 week bulk).
 */

export const NAV = [
  { label: 'Shop', href: '#shop' },
  { label: 'Customise', href: '#customise' },
  { label: 'How it works', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
] as const

export const CUSTOMISE = [
  {
    id: 'sublimation',
    title: 'Sublimation services',
    body: 'Unlimited colours and edge-to-edge graphics dyed into the fabric, so they never crack, fade or peel.',
  },
  {
    id: 'stitching',
    title: 'Professional jersey stitching',
    body: 'Tackle-twill names, numbers and crests, stitched by hand on pro-weight fabric.',
  },
  {
    id: 'fabric',
    title: 'Fabric & colour choices',
    body: 'Pick from pro mesh, air-knit, fleece and more, matched exactly to your team colours.',
  },
  {
    id: 'embroidery',
    title: 'Embroidery on apparel',
    body: 'Clean, dense embroidery for hoodies, caps, jackets and bags.',
  },
  {
    id: 'patch',
    title: 'Embroidery on patch / twill',
    body: 'Layered crests and shoulder patches that look sharp from the stands.',
  },
] as const

export const DECORATION = [
  { title: 'Embroidered crest', body: 'Your logo rebuilt in thread, layered on twill for a pro finish.' },
  { title: 'Fabric types', body: 'Pro mesh, air-knit, fleece and stretch shells, chosen by sport and season.' },
  { title: 'Names', body: 'Player names set in your team font, arched or straight, on every piece.' },
  { title: 'Numbers', body: 'Front, back, sleeve or hip numbers in one, two or three layers of twill.' },
] as const

export const REASONS = [
  {
    title: 'Fully custom items',
    body: 'Top-tier uniforms made fully custom for you in colour, fabric and design.',
    stat: '100%',
    statLabel: 'custom, every order',
  },
  {
    title: 'Complete apparel management',
    body: 'We manage your whole range and keep adding new products for teams and their fans.',
    stat: '20+',
    statLabel: 'product lines',
  },
  {
    title: 'Fast, on-time delivery',
    body: 'We deliver on time, often early, and have never had a backorder or short shipment.',
    stat: '0',
    statLabel: 'backorders',
  },
  {
    title: 'Outstanding service',
    body: 'Emergency orders, stock management, tailoring and special requests, handled quickly.',
    stat: '24h',
    statLabel: 'quote turnaround',
  },
] as const

export const SOLUTIONS = [
  { title: 'Organisations & clubs', body: 'Full kits for every age group, from house league to rep teams.' },
  { title: 'Schools & academies', body: 'Uniforms and spirit wear that last for seasons, not semesters.' },
  { title: 'Coaches, camps & hockey schools', body: 'Development and goalie programme kits, ready for day one.' },
  { title: 'Corporate & events', body: 'Branded apparel for tournaments, staff and sponsors.' },
] as const

export const STEPS = [
  { n: '01', title: 'Share your idea', body: 'Send a sketch, a logo or an old jersey. We turn it into a factory-ready tech pack in minutes.' },
  { n: '02', title: 'Approve the design', body: 'Review flats, colours, names and numbers. Change anything until it looks right.' },
  { n: '03', title: 'Hold a sample', body: 'We send a physical sample in 10 working days. Nothing goes to bulk until you approve it.' },
  { n: '04', title: 'Made & shipped', body: 'Bulk production in Sialkot takes 4–5 weeks, then we ship to your rink or field.' },
] as const

export const PROGRAMMES = [
  {
    title: 'Uniform & apparel programme',
    body: 'For hockey school development, training classes and goalie development and camps.',
    icon: 'shirt',
  },
  {
    title: 'Special goalie programme',
    body: 'Goalie-cut jerseys, pads covers and gear bags built for the extra room goalies need.',
    icon: 'shield',
  },
  {
    title: 'Junior U7–U9 sponsor programme',
    body: 'Partner organisations get sponsored support for their youngest players.',
    icon: 'star',
  },
] as const

export const TIERS = [
  {
    name: 'Sample',
    tagline: 'Hold it before you commit.',
    price: '$149',
    unit: 'per style',
    note: 'Credited back on bulk',
    features: ['Factory-ready tech pack', 'One physical sample', 'Ready in 10 working days', 'Unlimited design changes'],
    featured: false,
  },
  {
    name: 'Team',
    tagline: 'For clubs and school teams.',
    price: '50+',
    unit: 'pieces / style',
    note: 'Most popular',
    features: ['Everything in Sample', 'Names & numbers included', 'Mix sizes freely', 'Bulk in 4–5 weeks'],
    featured: true,
  },
  {
    name: 'League',
    tagline: 'For associations and leagues.',
    price: '500+',
    unit: 'pieces / season',
    note: 'Volume pricing',
    features: ['Everything in Team', 'Dedicated account manager', 'Stock management & reorders', 'Sponsor programme eligible'],
    featured: false,
  },
] as const

export const FAQ = [
  {
    q: 'What types of custom sportswear do you offer?',
    a: 'Custom hockey and baseball uniforms, team uniforms, hoodies, tracksuits, jackets, bags, gloves and complete team apparel.',
  },
  {
    q: 'Can I fully customise my uniforms and apparel?',
    a: 'Yes. Logos, player names, numbers, fabrics, colours, embroidery and sublimation printing can all be customised.',
  },
  {
    q: 'What is the minimum order?',
    a: 'Bulk orders start at 50 pieces per style, and you can mix sizes freely. Want to check fit and quality first? Order a single sample.',
  },
  {
    q: 'How long does an order take?',
    a: 'Samples arrive in 10 working days. Once you approve, bulk production takes 4–5 weeks, and we ship to you right after.',
  },
  {
    q: 'Do you handle bulk orders for leagues and schools?',
    a: 'Yes. We run full programmes for schools, clubs, academies and leagues, including stock management and reorders.',
  },
  {
    q: 'Can I design a completely different style or garment?',
    a: 'Yes. The customiser here covers our ready jersey styles. For new cuts (polo, raglan, henley, base layers…), logos placed or applied differently, or a design from your own sketch, use the full design tool at knitwright.com. It turns an idea or sketch into a factory-ready spec in minutes.',
  },
  {
    q: 'Where is everything made?',
    a: 'Everything is made in our own facility in Sialkot. Specs are checked for seam allowances, grading and buildability before production.',
  },
] as const

export const SPORTS = [
  'Hockey', 'Baseball', 'Lacrosse', 'Soccer', 'Basketball', 'Softball', 'Ringette', 'Volleyball', 'Football', 'Rugby', 'Track', 'Esports',
] as const

export const FOOTER = {
  shop: ['Hockey uniforms', 'Baseball uniforms', 'Custom apparel', 'Custom bags', 'Caps & toques'],
  company: ['Design tool ↗', 'About us', 'Contact us', 'Blog', 'Track order', 'Become a dealer'],
  policies: ['Shipping policy', 'Return policy', 'Privacy policy', 'Terms & conditions'],
} as const
