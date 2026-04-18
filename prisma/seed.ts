import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import {
  PrismaClient,
  DiscountType,
  OrderStatus,
  PaymentStatus,
  UserRole,
} from '@prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
  timestampFormat: 'unixepoch-ms',
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: 'Desk Mats',
    slug: 'desk-mats',
    description:
      'Premium desk foundations with tactile finishes, clean edges, and enough surface area for focused work.',
    image: '/collections/desk-mats.svg',
  },
  {
    name: 'Stands & Risers',
    slug: 'stands-risers',
    description:
      'Ergonomic lifts and monitor support pieces that keep your workstation aligned and visually balanced.',
    image: '/collections/stands.svg',
  },
  {
    name: 'Lighting',
    slug: 'lighting',
    description:
      'Warm, glare-controlled task lighting for late-night sprints and calm desk ambience.',
    image: '/collections/lighting.svg',
  },
  {
    name: 'Charging',
    slug: 'charging',
    description:
      'Wireless chargers, docks, and power accessories that reduce cable clutter while keeping devices topped up.',
    image: '/collections/charging.svg',
  },
  {
    name: 'Cable Management',
    slug: 'cable-management',
    description:
      'Smart routing tools, trays, and clips that keep the visual noise under control.',
    image: '/collections/cables.svg',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description:
      'Thoughtful add-ons that improve speed, comfort, and desk organization.',
    image: '/collections/accessories.svg',
  },
];

const collections = [
  {
    name: 'Focus Mode',
    slug: 'focus-mode',
    description:
      'Minimal products built to cut distractions and create a better rhythm for deep work.',
    image: '/collections/focus-mode.svg',
    featured: true,
  },
  {
    name: 'Cable Control',
    slug: 'cable-control',
    description:
      'A tighter, cleaner setup system for creators, programmers, and remote teams.',
    image: '/collections/cable-control.svg',
    featured: true,
  },
  {
    name: 'Hybrid Desk',
    slug: 'hybrid-desk',
    description:
      'Portable essentials for switching between home office, meetings, and coffee shop sessions.',
    image: '/collections/hybrid-desk.svg',
    featured: true,
  },
  {
    name: 'Night Shift',
    slug: 'night-shift',
    description:
      'Low-glare lighting, compact accessories, and warm materials for focused after-hours work.',
    image: '/collections/night-shift.svg',
    featured: false,
  },
];

const products = [
  {
    name: 'Orbit Desk Mat',
    slug: 'orbit-desk-mat',
    tagline:
      'Micro-textured vegan leather mat for clean everyday setups.',
    description:
      'Orbit Desk Mat creates a wider work zone for your keyboard, mouse, and notes while adding a refined matte surface that softens the look of the desk.',
    details: `Water-resistant finish
Soft touch base
Edge-stitched construction
Sized for keyboard + mouse + notebook`,
    price: 6900,
    compareAtPrice: 7900,
    featured: true,
    recommended: true,
    isNew: true,
    stock: 42,
    sku: 'WN-ODM-001',
    categorySlug: 'desk-mats',
    collectionSlug: 'focus-mode',
    images: [
      'https://img.drz.lazcdn.com/static/pk/p/f131528192f11f2715970c81fe9505ed.png',
      'https://img.drz.lazcdn.com/static/pk/p/ead50b5543deb5cf4e488f18dd75020f.jpg',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Midnight',
        stock: 16,
        sku: 'WN-ODM-001-MID',
      },
      {
        name: 'Color',
        value: 'Stone',
        stock: 12,
        sku: 'WN-ODM-001-STN',
      },
      {
        name: 'Color',
        value: 'Sand',
        stock: 14,
        sku: 'WN-ODM-001-SND',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Looks premium instantly',
        body: 'The texture is excellent and the stitching feels much better than most mats I tried.',
        authorName: 'Noah Patel',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Great size for a compact desk',
        body: 'Enough room for my keyboard and notes without making the desk feel crowded.',
        authorName: 'Ava Brooks',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'LiftGrid Monitor Riser',
    slug: 'liftgrid-monitor-riser',
    tagline: 'Solid aluminum riser with a floating shelf look.',
    description:
      'LiftGrid raises your display to a more natural line of sight and opens up a practical storage zone underneath for slim accessories.',
    details: `Anodized aluminum
Anti-slip pads
Supports ultrawide displays
Hidden cable channel`,
    price: 12900,
    compareAtPrice: 14900,
    featured: true,
    recommended: true,
    isNew: false,
    stock: 8,
    sku: 'WN-LMR-002',
    categorySlug: 'stands-risers',
    collectionSlug: 'focus-mode',
    images: [
      'https://cdn.shopify.com/s/files/1/0470/5393/0645/files/infinity_max-4_500x.jpg?v=1696496489',
      'https://cdn.shopify.com/s/files/1/0470/5393/0645/files/infinity_max_498x.jpg?v=1696496490',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Graphite',
        stock: 4,
        sku: 'WN-LMR-002-GRA',
      },
      {
        name: 'Finish',
        value: 'Silver',
        stock: 4,
        sku: 'WN-LMR-002-SIL',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Instant posture upgrade',
        body: 'This cleaned up my desk and put my monitor at the perfect height.',
        authorName: 'Mia Carter',
        verifiedPurchase: true,
      },
      {
        rating: 5,
        title: 'Feels incredibly sturdy',
        body: 'Heavy enough to stay planted and the finish matches Apple hardware really well.',
        authorName: 'James Walker',
        verifiedPurchase: false,
      },
    ],
  },
  {
    name: 'Halo Beam Desk Light',
    slug: 'halo-beam-desk-light',
    tagline:
      'Glare-free monitor light with warm to cool temperature control.',
    description:
      'Halo Beam clips over your display and delivers focused task lighting without flooding the room or creating monitor reflections.',
    details: `Stepless dimming
USB-C powered
Warm-to-cool light temperature
Memory brightness mode`,
    price: 9900,
    compareAtPrice: 10900,
    featured: true,
    recommended: false,
    isNew: true,
    stock: 17,
    sku: 'WN-HBD-003',
    categorySlug: 'lighting',
    collectionSlug: 'night-shift',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI2dimyiwaQdT7A4T0XsODnvWH6ditKE5QSg&s',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Black',
        stock: 9,
        sku: 'WN-HBD-003-BLK',
      },
      {
        name: 'Finish',
        value: 'White',
        stock: 8,
        sku: 'WN-HBD-003-WHT',
      },
    ],
    reviews: [
      {
        rating: 4,
        title: 'Very clean lighting',
        body: 'It makes late coding sessions easier on the eyes and keeps the desk looking neat.',
        authorName: 'Harper Nguyen',
        verifiedPurchase: true,
      },
      {
        rating: 5,
        title: 'Best night setup upgrade',
        body: 'The warm mode gives my desk a calm feel and the controls are easy to use.',
        authorName: 'Daniel Reed',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Flux Wireless Charger',
    slug: 'flux-wireless-charger',
    tagline:
      'Weighted magnetic stand for phone charging at a quick glance.',
    description:
      'Flux keeps your phone upright for widgets, timers, or standby mode while adding a sculptural accessory to the desk.',
    details: `15W wireless charging
Weighted zinc base
Magnetic alignment
Braided USB-C cable included`,
    price: 7900,
    compareAtPrice: 8900,
    featured: false,
    recommended: true,
    isNew: false,
    stock: 28,
    sku: 'WN-FWC-004',
    categorySlug: 'charging',
    collectionSlug: 'hybrid-desk',
    images: [
      'https://satechi.com/cdn/shop/files/3in1_6.webp?v=1768072986&width=640',
      'https://satechi.com/cdn/shop/files/3in1_4.webp?v=1768072986&width=640',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Slate',
        stock: 14,
        sku: 'WN-FWC-004-SLT',
      },
      {
        name: 'Color',
        value: 'Champagne',
        stock: 14,
        sku: 'WN-FWC-004-CHM',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Love the stand angle',
        body: 'I can see incoming calls while it charges and it looks far better than flat pads.',
        authorName: 'Ethan Lopez',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Great travel to desk option',
        body: 'Compact enough for my backpack and stable enough for daily use.',
        authorName: 'Olivia Moore',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'PortFlow USB-C Hub',
    slug: 'portflow-usb-c-hub',
    tagline: 'Slim 7-in-1 hub designed for calm cable routing.',
    description:
      'PortFlow gives your laptop the essential ports back while keeping the footprint compact enough to disappear into the setup.',
    details: `HDMI 4K output
Dual USB-A
SD + microSD
100W passthrough charging`,
    price: 11900,
    compareAtPrice: 12900,
    featured: true,
    recommended: true,
    isNew: false,
    stock: 21,
    sku: 'WN-PUH-005',
    categorySlug: 'accessories',
    collectionSlug: 'hybrid-desk',
    images: [
      'https://img.drz.lazcdn.com/static/pk/p/449bf2bcd00de5e40be87d5c597b4e88.jpg_720x720q80.jpg_.webp',
      'https://satechi.com/cdn/shop/files/3in1_5.webp?v=1768072987&width=640',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Space Gray',
        stock: 11,
        sku: 'WN-PUH-005-SPG',
      },
      {
        name: 'Finish',
        value: 'Titanium',
        stock: 10,
        sku: 'WN-PUH-005-TIT',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Exactly the ports I needed',
        body: 'Reliable HDMI, clean look, and the braided cable feels premium.',
        authorName: 'Sophia Kim',
        verifiedPurchase: false,
      },
      {
        rating: 4,
        title: 'Good balance of size and function',
        body: 'Small enough to leave on the desk and easy to pack when needed.',
        authorName: 'Lucas Adams',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Route Cable Dock',
    slug: 'route-cable-dock',
    tagline: 'Weighted cable organizer with modular magnetic clips.',
    description:
      'Route Dock keeps charging cables, headphones, and accessory leads within reach while avoiding the usual tangle line near the edge of the desk.',
    details: `Weighted steel core
Magnetic clip system
Non-slip base
Fits thin and braided cables`,
    price: 3900,
    compareAtPrice: 4500,
    featured: false,
    recommended: true,
    isNew: false,
    stock: 56,
    sku: 'WN-RCD-006',
    categorySlug: 'cable-management',
    collectionSlug: 'cable-control',
    images: [
      'https://img.drz.lazcdn.com/static/pk/p/449bf2bcd00de5e40be87d5c597b4e88.jpg_720x720q80.jpg_.webp',
      'https://cdn.shopify.com/s/files/1/0470/5393/0645/files/infinity_max_498x.jpg?v=1696496490',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Black',
        stock: 28,
        sku: 'WN-RCD-006-BLK',
      },
      {
        name: 'Color',
        value: 'Sand',
        stock: 28,
        sku: 'WN-RCD-006-SND',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Simple but really effective',
        body: 'A tiny accessory that made the desk look cleaner in minutes.',
        authorName: 'Grace Allen',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Magnets are stronger than expected',
        body: 'Holds my charging cable and headphones cable without slipping.',
        authorName: 'Elijah Ross',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Nimble Laptop Stand',
    slug: 'nimble-laptop-stand',
    tagline: 'Fold-flat stand for ergonomic typing and hybrid work.',
    description:
      'Nimble folds into a slim travel profile while giving your laptop a more comfortable angle and improved airflow on the desk.',
    details: `Fold-flat profile
Aircraft-grade aluminum
Rubber contact points
Travel sleeve included`,
    price: 8500,
    compareAtPrice: 9500,
    featured: true,
    recommended: false,
    isNew: false,
    stock: 32,
    sku: 'WN-NLS-007',
    categorySlug: 'stands-risers',
    collectionSlug: 'hybrid-desk',
    images: [
      'https://img.drz.lazcdn.com/static/bd/p/58a37b77b14f50657946e022a42643ed.jpg_720x720q80.jpg_.webp',
      'https://cdn.shopify.com/s/files/1/0470/5393/0645/files/infinity_max-4_500x.jpg?v=1696496489',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Silver',
        stock: 16,
        sku: 'WN-NLS-007-SIL',
      },
      {
        name: 'Finish',
        value: 'Midnight',
        stock: 16,
        sku: 'WN-NLS-007-MID',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Perfect for remote days',
        body: 'Light enough to carry everywhere and sturdy when set up.',
        authorName: 'Layla Davis',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Pairs well with an external keyboard',
        body: 'Improved my neck position immediately and still fits in my bag.',
        authorName: 'Henry White',
        verifiedPurchase: false,
      },
    ],
  },
  {
    name: 'Focus Timer Pad',
    slug: 'focus-timer-pad',
    tagline: 'Programmable desk timer with tactile focus presets.',
    description:
      'Focus Timer Pad gives you one-touch deep-work timers with a subtle visual countdown designed to sit naturally on a modern desk.',
    details: `Preset focus sessions
Low-glow timer ring
USB-C rechargeable
Soft touch base`,
    price: 7200,
    compareAtPrice: 8200,
    featured: false,
    recommended: true,
    isNew: true,
    stock: 14,
    sku: 'WN-FTP-008',
    categorySlug: 'accessories',
    collectionSlug: 'focus-mode',
    images: [
      'https://satechi.com/cdn/shop/files/3in1_4.webp?v=1768072986&width=640',
      'https://satechi.com/cdn/shop/files/3in1_5.webp?v=1768072987&width=640',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Charcoal',
        stock: 7,
        sku: 'WN-FTP-008-CHR',
      },
      {
        name: 'Color',
        value: 'Mist',
        stock: 7,
        sku: 'WN-FTP-008-MST',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Surprisingly useful',
        body: 'I use it more than app timers because it is always there on the desk.',
        authorName: 'Amelia Scott',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Nice physical reminder to focus',
        body: 'The glow ring is subtle and the build quality feels excellent.',
        authorName: 'Mason Green',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Anchor Headphone Rest',
    slug: 'anchor-headphone-rest',
    tagline:
      'Compact metal rest that keeps your audio gear off the work surface.',
    description:
      'Anchor creates a dedicated drop point for over-ear headphones while matching the clean material palette of a modern setup.',
    details: `Weighted steel base
Leather touch point
Small footprint
Cable notch`,
    price: 4900,
    compareAtPrice: 5600,
    featured: false,
    recommended: false,
    isNew: false,
    stock: 36,
    sku: 'WN-AHR-009',
    categorySlug: 'accessories',
    collectionSlug: 'cable-control',
    images: [
      'https://www.figureout3d.com/cdn/shop/files/8199C732-B800-4F71-9BDF-D696F5DCF488.png?v=1762710400&width=416',
      'https://www.figureout3d.com/cdn/shop/files/8199C732-B800-4F71-9BDF-D696F5DCF488_1.png?v=1762711404&width=416',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Black',
        stock: 18,
        sku: 'WN-AHR-009-BLK',
      },
      {
        name: 'Finish',
        value: 'Silver',
        stock: 18,
        sku: 'WN-AHR-009-SIL',
      },
    ],
    reviews: [
      {
        rating: 4,
        title: 'Keeps the desk calmer',
        body: 'Tiny change but my setup feels more intentional now.',
        authorName: 'Zoe Perez',
        verifiedPurchase: true,
      },
      {
        rating: 5,
        title: 'Solid base',
        body: 'Does not tip and the contact point is gentle on the headband.',
        authorName: 'Leo Torres',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Arc Keyboard Tray',
    slug: 'arc-keyboard-tray',
    tagline:
      'Minimal under-desk tray for compact keyboards and small tools.',
    description:
      'Arc Keyboard Tray tucks away your keyboard or notebook when you need more surface area, keeping the main desk line visually open.',
    details: `Powder-coated steel
Low profile mounting
Felt-lined shelf
Fits 60% and 75% keyboards`,
    price: 10800,
    compareAtPrice: 11800,
    featured: true,
    recommended: false,
    isNew: false,
    stock: 10,
    sku: 'WN-AKT-010',
    categorySlug: 'cable-management',
    collectionSlug: 'cable-control',
    images: [
      'https://cdn.shopify.com/s/files/1/0470/5393/0645/files/infinity_max_498x.jpg?v=1696496490',
      'https://img.drz.lazcdn.com/static/bd/p/58a37b77b14f50657946e022a42643ed.jpg_720x720q80.jpg_.webp',
    ],
    variants: [
      {
        name: 'Finish',
        value: 'Matte Black',
        stock: 5,
        sku: 'WN-AKT-010-MBK',
      },
      {
        name: 'Finish',
        value: 'Stone',
        stock: 5,
        sku: 'WN-AKT-010-STN',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Great for smaller desks',
        body: 'Cleared surface space immediately and still feels sturdy when pulled out.',
        authorName: 'Ruby Foster',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Very clean install',
        body: 'The felt lining is a nice detail and it disappears nicely under the desk.',
        authorName: 'Caleb Evans',
        verifiedPurchase: false,
      },
    ],
  },
  {
    name: 'Drift Pen Dock',
    slug: 'drift-pen-dock',
    tagline:
      'Weighted organizer for pens, cutter, SD cards, and tiny daily tools.',
    description:
      'Drift Pen Dock keeps the small essentials upright and close without adding visual clutter to the desk surface.',
    details: `Solid resin body
Three compartment layout
Soft base pad
Compact footprint`,
    price: 3500,
    compareAtPrice: 4100,
    featured: false,
    recommended: true,
    isNew: false,
    stock: 51,
    sku: 'WN-DPD-011',
    categorySlug: 'accessories',
    collectionSlug: 'focus-mode',
    images: [
      'https://www.figureout3d.com/cdn/shop/files/8199C732-B800-4F71-9BDF-D696F5DCF488_2.png?v=1762711404&width=416',
      'https://img.drz.lazcdn.com/static/pk/p/ead50b5543deb5cf4e488f18dd75020f.jpg',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Pebble',
        stock: 26,
        sku: 'WN-DPD-011-PEB',
      },
      {
        name: 'Color',
        value: 'Graphite',
        stock: 25,
        sku: 'WN-DPD-011-GRA',
      },
    ],
    reviews: [
      {
        rating: 4,
        title: 'Looks better than the usual pen cup',
        body: 'Small and simple, but it definitely upgrades the desk visually.',
        authorName: 'Lily Bennett',
        verifiedPurchase: true,
      },
      {
        rating: 5,
        title: 'Exactly enough storage',
        body: 'I keep my pens, AirPods cleaning tool, and USB adapter inside it.',
        authorName: 'Jack Hughes',
        verifiedPurchase: true,
      },
    ],
  },
  {
    name: 'Signal Docking Tray',
    slug: 'signal-docking-tray',
    tagline:
      'Catch-all tray for keys, watch, wallet, and charging cable.',
    description:
      'Signal Docking Tray is built for the end-of-day drop with softly rounded sections and a subtle accessory-first look.',
    details: `Soft felt insert
Integrated cable slot
Resin composite shell
Bedside or desk use`,
    price: 5400,
    compareAtPrice: 6200,
    featured: false,
    recommended: true,
    isNew: true,
    stock: 24,
    sku: 'WN-SDT-012',
    categorySlug: 'charging',
    collectionSlug: 'night-shift',
    images: [
      'https://www.figureout3d.com/cdn/shop/files/8199C732-B800-4F71-9BDF-D696F5DCF488.png?v=1762710400&width=416',
      'https://satechi.com/cdn/shop/files/3in1_6.webp?v=1768072986&width=640',
    ],
    variants: [
      {
        name: 'Color',
        value: 'Ash',
        stock: 12,
        sku: 'WN-SDT-012-ASH',
      },
      {
        name: 'Color',
        value: 'Ink',
        stock: 12,
        sku: 'WN-SDT-012-INK',
      },
    ],
    reviews: [
      {
        rating: 5,
        title: 'Makes the desk feel finished',
        body: 'Really nice way to keep small items from spreading out across the surface.',
        authorName: 'Hannah Cox',
        verifiedPurchase: true,
      },
      {
        rating: 4,
        title: 'Useful beyond the desk',
        body: 'I ended up using one on the nightstand too.',
        authorName: 'Owen Price',
        verifiedPurchase: false,
      },
    ],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  const createdCategories = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    createdCategories.set(category.slug, created.id);
  }

  const createdCollections = new Map<string, string>();
  for (const collection of collections) {
    const created = await prisma.collection.create({
      data: collection,
    });
    createdCollections.set(collection.slug, created.id);
  }

  const createdProducts: {
    id: string;
    name: string;
    slug: string;
    price: number;
  }[] = [];

  for (const product of products) {
    const productRecord = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        tagline: product.tagline,
        description: product.description,
        details: product.details,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        featured: product.featured,
        recommended: product.recommended,
        isNew: product.isNew,
        stock: product.stock,
        sku: product.sku,
        categoryId: createdCategories.get(product.categorySlug)!,
        collectionId: createdCollections.get(product.collectionSlug)!,
        images: {
          create: product.images.map((url, index) => ({
            url,
            alt:
              index === 0
                ? product.name
                : `${product.name} view ${index + 1}`,
            sortOrder: index,
          })),
        },
        variants: {
          create: product.variants,
        },
      },
    });

    let totalRating = 0;
    for (const review of product.reviews) {
      totalRating += review.rating;
      await prisma.review.create({
        data: {
          ...review,
          productId: productRecord.id,
        },
      });
    }

    await prisma.product.update({
      where: { id: productRecord.id },
      data: {
        ratingAverage: totalRating / product.reviews.length,
        reviewCount: product.reviews.length,
      },
    });

    createdProducts.push({
      id: productRecord.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
    });
  }

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@worknest.store',
      name: 'Jordan Hale',
      role: UserRole.ADMIN,
      imageUrl: '/avatars/admin.svg',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@worknest.store',
      name: 'Alex Carter',
      role: UserRole.CUSTOMER,
      imageUrl: '/avatars/demo-user.svg',
    },
  });

  const officeAddress = await prisma.address.create({
    data: {
      userId: demoUser.id,
      label: 'Studio',
      fullName: 'Alex Carter',
      line1: '458 Market Street',
      line2: 'Suite 12B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      phone: '+1 415 555 0145',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: demoUser.id,
      label: 'Home',
      fullName: 'Alex Carter',
      line1: '99 Harbor View Drive',
      city: 'Oakland',
      state: 'CA',
      postalCode: '94607',
      country: 'United States',
      phone: '+1 415 555 0180',
      isDefault: false,
    },
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: 'FOCUS10',
        type: DiscountType.PERCENT,
        value: 10,
        minSubtotal: 5000,
        active: true,
      },
      {
        code: 'SETUP25',
        type: DiscountType.FIXED,
        value: 2500,
        minSubtotal: 15000,
        active: true,
      },
      {
        code: 'NIGHT15',
        type: DiscountType.PERCENT,
        value: 15,
        minSubtotal: 9000,
        active: false,
      },
    ],
  });

  await prisma.wishlistItem.createMany({
    data: [
      { userId: demoUser.id, productId: createdProducts[0].id },
      { userId: demoUser.id, productId: createdProducts[2].id },
      { userId: demoUser.id, productId: createdProducts[4].id },
    ],
  });

  const firstOrder = await prisma.order.create({
    data: {
      orderNumber: 'WN-240401',
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      subtotal: createdProducts[0].price + createdProducts[4].price,
      discountAmount: 1000,
      shippingAmount: 0,
      total:
        createdProducts[0].price + createdProducts[4].price - 1000,
      email: demoUser.email,
      fullName: officeAddress.fullName,
      phone: officeAddress.phone,
      addressLine1: officeAddress.line1,
      addressLine2: officeAddress.line2,
      city: officeAddress.city,
      state: officeAddress.state,
      postalCode: officeAddress.postalCode,
      country: officeAddress.country,
      userId: demoUser.id,
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            quantity: 1,
            unitPrice: createdProducts[0].price,
            totalPrice: createdProducts[0].price,
            variantLabel: 'Midnight',
          },
          {
            productId: createdProducts[4].id,
            quantity: 1,
            unitPrice: createdProducts[4].price,
            totalPrice: createdProducts[4].price,
            variantLabel: 'Space Gray',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'WN-240402',
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      subtotal: createdProducts[7].price,
      discountAmount: 0,
      shippingAmount: 1200,
      total: createdProducts[7].price + 1200,
      email: demoUser.email,
      fullName: officeAddress.fullName,
      phone: officeAddress.phone,
      addressLine1: officeAddress.line1,
      addressLine2: officeAddress.line2,
      city: officeAddress.city,
      state: officeAddress.state,
      postalCode: officeAddress.postalCode,
      country: officeAddress.country,
      userId: demoUser.id,
      items: {
        create: [
          {
            productId: createdProducts[7].id,
            quantity: 1,
            unitPrice: createdProducts[7].price,
            totalPrice: createdProducts[7].price,
            variantLabel: 'Charcoal',
          },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      productId: createdProducts[0].id,
      userId: demoUser.id,
      rating: 5,
      title: 'One of my favorite setup upgrades',
      body: 'Fast shipping, premium feel, and it made the desk look instantly more intentional.',
      authorName: demoUser.name,
      verifiedPurchase: true,
    },
  });

  await prisma.product.update({
    where: { id: createdProducts[0].id },
    data: {
      reviewCount: { increment: 1 },
      ratingAverage: 4.75,
    },
  });

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'build@worknest.store' },
      { email: 'team@workspaceweekly.com' },
    ],
  });

  console.log(
    `Seeded ${products.length} products, ${categories.length} categories, ${collections.length} collections.`,
  );
  console.log(
    `Created demo orders including ${firstOrder.orderNumber}.`,
  );
  console.log(`Admin user: ${adminUser.email}`);
  console.log(`Demo user: ${demoUser.email}`);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
