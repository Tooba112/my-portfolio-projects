/**
 * AdFlow Pro — Demo Data Seed
 * Run: node seedDemo.js
 *
 * SAFE: Only INSERTS new records. Never deletes existing data.
 * Skips any user whose email already exists.
 * Uses only the 5 existing categories already in the DB.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./src/models/User");
const Gig      = require("./src/models/Gig");

/* ─────────────────────────────────────────────
   DEMO USERS
───────────────────────────────────────────── */
const CLIENTS = [
  { name: "Ayesha",  email: "ayesha@adflow.com",  password: "ayesha123"  },
  { name: "Fatima",  email: "fatima@adflow.com",   password: "fatima123"  },
  { name: "Rubeena", email: "rubeena@adflow.com",  password: "rubeena123" },
  { name: "Neha",    email: "neha@adflow.com",     password: "neha123"    },
  { name: "Mehvish", email: "mehvish@adflow.com",  password: "mehvish123" },
];

const PROVIDERS = [
  { name: "Ali",   email: "ali@adflow.com",   password: "ali123"   },
  { name: "Ahmad", email: "ahmad@adflow.com", password: "ahmad123" },
];

/* ─────────────────────────────────────────────
   DEMO GIGS  (category must match DB exactly)
   Existing categories:
     Digital Marketing | SEO | Web Development
     Graphic Design    | Content Writing
───────────────────────────────────────────── */
const GIGS_FOR_ALI = [
  {
    title: "Social Media Marketing",
    description:
      "I will create and manage a complete social media marketing strategy for your business across Facebook, Instagram, and Twitter. Includes content calendar, post scheduling, audience targeting, and monthly performance reports.",
    price: 120,
    category: "Digital Marketing",
    status: "approved",
  },
  {
    title: "Facebook Ads Management",
    description:
      "Professional Facebook and Instagram Ads campaign setup and management. Includes audience research, ad creatives, A/B testing, pixel setup, and weekly performance optimization to maximize your ROI.",
    price: 200,
    category: "Digital Marketing",
    status: "approved",
  },
  {
    title: "Instagram Growth Strategy",
    description:
      "I will build a data-driven Instagram growth strategy for your brand. Includes hashtag research, content planning, engagement tactics, competitor analysis, and a 30-day posting schedule.",
    price: 90,
    category: "Digital Marketing",
    status: "approved",
  },
  {
    title: "SEO Optimization",
    description:
      "Complete on-page and off-page SEO optimization for your website. Includes technical audit, keyword research, meta tag optimization, internal linking, backlink strategy, and a detailed ranking report.",
    price: 150,
    category: "SEO",
    status: "approved",
  },
  {
    title: "YouTube SEO",
    description:
      "Boost your YouTube channel visibility with professional SEO. Includes keyword research for titles and descriptions, tag optimization, thumbnail strategy, playlist structuring, and competitor channel analysis.",
    price: 80,
    category: "SEO",
    status: "approved",
  },
];

const GIGS_FOR_AHMAD = [
  {
    title: "Website Development",
    description:
      "I will develop a fully responsive, modern website using HTML, CSS, JavaScript, and React or Angular. Includes up to 6 pages, contact form integration, Google Analytics setup, and 1 month of free support.",
    price: 350,
    category: "Web Development",
    status: "approved",
  },
  {
    title: "WordPress Website Design",
    description:
      "Professional WordPress website design with a premium theme, custom layout, WooCommerce setup (if needed), SEO plugin configuration, speed optimization, and mobile responsiveness. Includes 5 pages.",
    price: 250,
    category: "Web Development",
    status: "approved",
  },
  {
    title: "Logo Design",
    description:
      "Creative and professional logo design for your brand. You will receive 3 unique concepts, unlimited revisions until satisfied, and final delivery in all formats: PNG, JPG, SVG, and AI source file.",
    price: 60,
    category: "Graphic Design",
    status: "approved",
  },
  {
    title: "Graphic Design Package",
    description:
      "Complete graphic design package including logo, business card, letterhead, social media banner set (Facebook, Instagram, Twitter), and email signature. All files delivered in print and web-ready formats.",
    price: 180,
    category: "Graphic Design",
    status: "approved",
  },
  {
    title: "Content Writing",
    description:
      "High-quality, SEO-optimized content writing for blogs, websites, and social media. Includes 5 articles of 800–1200 words each, keyword integration, meta descriptions, and royalty-free image suggestions.",
    price: 100,
    category: "Content Writing",
    status: "approved",
  },
];

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  const h = (pw) => bcrypt.hash(pw, 10);

  /* ── Insert clients ── */
  console.log("── Creating clients ──────────────────────");
  const clientResults = [];
  for (const c of CLIENTS) {
    const exists = await User.findOne({ email: c.email });
    if (exists) {
      console.log(`  SKIP  ${c.name} (${c.email}) — already exists`);
      clientResults.push(exists);
    } else {
      const user = await User.create({
        name:     c.name,
        email:    c.email,
        password: await h(c.password),
        role:     "client",
      });
      console.log(`  OK    ${user.name} (${user.email})`);
      clientResults.push(user);
    }
  }

  /* ── Insert providers ── */
  console.log("\n── Creating providers ────────────────────");
  let ali, ahmad;
  for (const p of PROVIDERS) {
    const exists = await User.findOne({ email: p.email });
    if (exists) {
      console.log(`  SKIP  ${p.name} (${p.email}) — already exists`);
      if (p.name === "Ali")   ali   = exists;
      if (p.name === "Ahmad") ahmad = exists;
    } else {
      const user = await User.create({
        name:     p.name,
        email:    p.email,
        password: await h(p.password),
        role:     "provider",
      });
      console.log(`  OK    ${user.name} (${user.email})`);
      if (p.name === "Ali")   ali   = user;
      if (p.name === "Ahmad") ahmad = user;
    }
  }

  /* ── Insert gigs for Ali ── */
  console.log("\n── Creating gigs for Ali ─────────────────");
  for (const g of GIGS_FOR_ALI) {
    const exists = await Gig.findOne({ title: g.title, provider: ali._id });
    if (exists) {
      console.log(`  SKIP  "${g.title}" — already exists`);
    } else {
      await Gig.create({ ...g, provider: ali._id });
      console.log(`  OK    "${g.title}" [${g.category}] $${g.price}`);
    }
  }

  /* ── Insert gigs for Ahmad ── */
  console.log("\n── Creating gigs for Ahmad ───────────────");
  for (const g of GIGS_FOR_AHMAD) {
    const exists = await Gig.findOne({ title: g.title, provider: ahmad._id });
    if (exists) {
      console.log(`  SKIP  "${g.title}" — already exists`);
    } else {
      await Gig.create({ ...g, provider: ahmad._id });
      console.log(`  OK    "${g.title}" [${g.category}] $${g.price}`);
    }
  }

  /* ── Summary ── */
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  AdFlow Pro — Demo Data Created");
  console.log("═══════════════════════════════════════════════════════");

  console.log("\n  CLIENT ACCOUNTS");
  console.log("  Name       Email                   Password");
  console.log("  ─────────  ──────────────────────  ───────────");
  for (const c of CLIENTS) {
    console.log(`  ${c.name.padEnd(9)}  ${c.email.padEnd(22)}  ${c.password}`);
  }

  console.log("\n  PROVIDER ACCOUNTS");
  console.log("  Name       Email                   Password");
  console.log("  ─────────  ──────────────────────  ───────────");
  for (const p of PROVIDERS) {
    console.log(`  ${p.name.padEnd(9)}  ${p.email.padEnd(22)}  ${p.password}`);
  }

  console.log("\n  GIGS (Ali — 5 gigs)");
  console.log("  Title                        Category             Price");
  console.log("  ───────────────────────────  ───────────────────  ─────");
  for (const g of GIGS_FOR_ALI) {
    console.log(`  ${g.title.padEnd(29)}  ${g.category.padEnd(19)}  $${g.price}`);
  }

  console.log("\n  GIGS (Ahmad — 5 gigs)");
  console.log("  Title                        Category             Price");
  console.log("  ───────────────────────────  ───────────────────  ─────");
  for (const g of GIGS_FOR_AHMAD) {
    console.log(`  ${g.title.padEnd(29)}  ${g.category.padEnd(19)}  $${g.price}`);
  }

  console.log("\n═══════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Demo seed failed:", err.message);
  process.exit(1);
});
