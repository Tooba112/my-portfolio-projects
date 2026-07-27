/**
 * AdFlow Pro — Demo Seed Script
 * Run once:  node seed.js
 *
 * Wipes all collections and inserts clean demo data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User     = require('./src/models/User');
const Category = require('./src/models/Category');
const Gig      = require('./src/models/Gig');
const Order    = require('./src/models/Order');
const Payment  = require('./src/models/Payment');
const Review   = require('./src/models/Review');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Clear all collections ──────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Gig.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const h = (pw) => bcrypt.hash(pw, 10);

  // ── Users ──────────────────────────────────────────────────
  const admin     = await User.create({ name: 'Admin User',     email: 'admin@adflow.com',  password: await h('admin123'),  role: 'admin'     });
  const mod       = await User.create({ name: 'Mod User',       email: 'mod@adflow.com',    password: await h('mod123'),    role: 'moderator' });
  const alice     = await User.create({ name: 'Alice Provider', email: 'alice@adflow.com',  password: await h('alice123'),  role: 'provider'  });
  const bob       = await User.create({ name: 'Bob Provider',   email: 'bob@adflow.com',    password: await h('bob123'),    role: 'provider'  });
  const carol     = await User.create({ name: 'Carol Client',   email: 'carol@adflow.com',  password: await h('carol123'),  role: 'client'    });
  const david     = await User.create({ name: 'David Client',   email: 'david@adflow.com',  password: await h('david123'),  role: 'client'    });
  console.log('Users created (6)');

  // ── Categories ─────────────────────────────────────────────
  await Category.insertMany([
    { name: "Digital Marketing" },
    { name: "SEO"               },
    { name: "Web Development"   },
    { name: "Graphic Design"    },
    { name: "Content Writing"   },
  ]);
  console.log('Categories created (6)');

  // ── Gigs ───────────────────────────────────────────────────
  const g1 = await Gig.create({
    title: 'Professional WordPress Website',
    description: 'I will build a fully responsive WordPress website with custom theme, plugins, and SEO optimization. Includes 5 pages, contact form, and Google Analytics setup.',
    price: 250, category: 'Web Development', provider: alice._id, status: 'approved',
  });
  const g2 = await Gig.create({
    title: 'Modern Logo Design Package',
    description: 'Get a professional logo with 3 unique concepts, unlimited revisions, and all source files (AI, PNG, SVG). Perfect for startups and small businesses.',
    price: 80, category: 'Graphic Design', provider: alice._id, status: 'approved',
  });
  const g3 = await Gig.create({
    title: 'Social Media Marketing Campaign',
    description: 'Full social media strategy for Facebook, Instagram, and Twitter. Includes content calendar, 30 posts, hashtag research, and monthly analytics report.',
    price: 150, category: 'Digital Marketing', provider: bob._id, status: 'approved',
  });
  const g4 = await Gig.create({
    title: 'YouTube Video Editing & Thumbnail',
    description: 'Professional video editing up to 10 minutes with color grading, transitions, background music, subtitles, and a custom YouTube thumbnail.',
    price: 60, category: 'Content Writing', provider: bob._id, status: 'approved',
  });
  const g5 = await Gig.create({
    title: 'SEO Audit & Keyword Research',
    description: 'Complete technical SEO audit of your website with competitor analysis, keyword research report, and actionable recommendations to boost rankings.',
    price: 120, category: 'SEO', provider: alice._id, status: 'approved',
  });
  const g6 = await Gig.create({
    title: 'Blog Content Writing (5 Articles)',
    description: 'High-quality, SEO-optimized blog articles (800-1200 words each) on any topic. Includes keyword integration, meta descriptions, and royalty-free images.',
    price: 100, category: 'Content Writing', provider: bob._id, status: 'approved',
  });
  // Pending — waiting for moderator
  await Gig.create({
    title: 'React.js Frontend Development',
    description: 'Build a modern React.js single-page application with hooks, context API, and REST API integration. Responsive design included.',
    price: 400, category: 'Web Development', provider: alice._id, status: 'pending',
  });
  await Gig.create({
    title: 'Brand Identity Design',
    description: 'Complete brand identity package including logo, color palette, typography guide, business card, and letterhead design.',
    price: 200, category: 'Graphic Design', provider: bob._id, status: 'pending',
  });
  // Rejected
  await Gig.create({
    title: 'Cheap Spam Backlinks',
    description: 'Low quality backlinks that violate Google guidelines.',
    price: 5, category: 'SEO', provider: bob._id, status: 'rejected',
  });
  console.log('Gigs created (9: 6 approved, 2 pending, 1 rejected)');

  // ── Orders ─────────────────────────────────────────────────
  const o1 = await Order.create({ client: carol._id, provider: alice._id, gig: g1._id, amount: g1.price, status: 'completed' });
  const o2 = await Order.create({ client: carol._id, provider: alice._id, gig: g2._id, amount: g2.price, status: 'active'    });
  const o3 = await Order.create({ client: carol._id, provider: bob._id,   gig: g3._id, amount: g3.price, status: 'pending'   });
  const o4 = await Order.create({ client: david._id, provider: bob._id,   gig: g4._id, amount: g4.price, status: 'completed' });
  const o5 = await Order.create({ client: david._id, provider: alice._id, gig: g5._id, amount: g5.price, status: 'active'    });
  const o6 = await Order.create({ client: david._id, provider: bob._id,   gig: g6._id, amount: g6.price, status: 'pending'   });
  console.log('Orders created (6: 2 completed, 2 active, 2 pending)');

  // ── Payments ───────────────────────────────────────────────
  await Payment.create({ order: o1._id, client: carol._id, amount: o1.amount, paymentMethod: 'bank_transfer',  status: 'verified' });
  await Payment.create({ order: o4._id, client: david._id, amount: o4.amount, paymentMethod: 'mobile_banking', status: 'verified' });
  await Payment.create({ order: o2._id, client: carol._id, amount: o2.amount, paymentMethod: 'bank_transfer',  status: 'pending'  });
  await Payment.create({ order: o5._id, client: david._id, amount: o5.amount, paymentMethod: 'cash',           status: 'pending'  });
  console.log('Payments created (4: 2 verified, 2 pending)');

  // ── Reviews ────────────────────────────────────────────────
  await Review.create({
    client: carol._id, provider: alice._id, gig: g1._id, rating: 5,
    comment: 'Excellent work! Alice delivered the WordPress site ahead of schedule. Very professional and responsive throughout the project.',
  });
  await Review.create({
    client: david._id, provider: bob._id, gig: g4._id, rating: 4,
    comment: 'Great video editing quality. Bob added nice transitions and the thumbnail looks amazing. Would definitely hire again.',
  });
  await Review.create({
    client: carol._id, provider: bob._id, gig: g3._id, rating: 5,
    comment: 'The social media campaign exceeded our expectations. Engagement went up 40% in the first month!',
  });
  console.log('Reviews created (3)');

  // ── Summary ────────────────────────────────────────────────
  console.log('\n=======================================================');
  console.log('  AdFlow Pro — Seed Complete!');
  console.log('=======================================================');
  console.log('\n  DEMO ACCOUNTS  (use these to log in)');
  console.log('  Role        Email                  Password');
  console.log('  ----------  ---------------------  ----------');
  console.log('  Admin       admin@adflow.com        admin123');
  console.log('  Moderator   mod@adflow.com          mod123');
  console.log('  Provider    alice@adflow.com        alice123');
  console.log('  Provider    bob@adflow.com          bob123');
  console.log('  Client      carol@adflow.com        carol123');
  console.log('  Client      david@adflow.com        david123');
  console.log('\n  DATA SEEDED');
  console.log('  6  Users      (1 admin, 1 moderator, 2 providers, 2 clients)');
  console.log('  5  Categories (Digital Marketing, SEO, Web Development,');
  console.log('                 Graphic Design, Content Writing)');
  console.log('  9  Gigs       (6 approved, 2 pending moderation, 1 rejected)');
  console.log('  6  Orders     (2 completed, 2 active, 2 pending)');
  console.log('  4  Payments   (2 verified, 2 pending admin verification)');
  console.log('  3  Reviews');
  console.log('=======================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
