#!/usr/bin/env node

/**
 * AI Markdown Rendering — Cross-Site Generation Engine
 *
 * Run: node scripts/generate-ai-markdown.mjs --site=<site-name>
 *
 * Generates AI-friendly Markdown for ALL public pages, llms.txt, and
 * ai-sitemap.xml. Designed to work across all Shoaib Santo sites.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ─── SITE CONFIGS ──────────────────────────────────────────────────── */

const SITES = {
  'getmyfollow': {
    domain: 'getmyfollow.com',
    name: 'GetmyFollow',
    tagline: 'Bangladesh\'s trusted SMM panel for social media growth',
    root: path.resolve(__dirname, '..'),
    contentDirs: {
      posts: 'src/content/posts',
    },
    pageDataFile: null,
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: ['.md', '.mdx'],
    homepageMd: () => banner('GetmyFollow') + `## SMM Panel Bangladesh — Trusted Social Media Growth Platform

GetmyFollow is Bangladesh's most affordable SMM panel for real, high-retention social media growth. Built for Bangladeshi creators, F-commerce businesses and agencies — followers and engagement that actually stay. bKash & Nagad accepted. No bots, no password, no account risk.

**Key facts:** 391,521+ orders delivered since 2020 | 9,195+ registered users | 6,856+ services | Start from ৳100 deposit | bKash, Nagad, Rocket, PayPal & cards accepted | 24/7 Bangla & English support.

[Services & Pricing](https://getmyfollow.com/services) | [FAQ](https://getmyfollow.com/faq) | [About Us](https://getmyfollow.com/about-us)
`,
    servicePages: [
      { title: 'Services & Pricing', path: '/services', desc: 'All SMM panel services and complete pricing.' },
      { title: 'FAQ', path: '/faq', desc: 'Frequently asked questions about GetmyFollow.' },
      { title: 'About Us', path: '/about-us', desc: 'About GetmyFollow — team, story, mission.' },
      { title: 'Contact Us', path: '/contact-us', desc: 'Contact GetmyFollow support.' },
      { title: 'SMM Panel Guide', path: '/smm-panel-guide', desc: 'Complete guide to SMM panels in Bangladesh.' },
      { title: 'Instagram SMM Panel', path: '/instagram-smm-panel', desc: 'Instagram followers, likes, views from ৳12. bKash accepted.' },
      { title: 'Facebook SMM Panel', path: '/facebook-smm-panel', desc: 'Facebook page likes, post likes, followers.' },
      { title: 'YouTube SMM Panel', path: '/youtube-smm-panel', desc: 'Buy YouTube subscribers, views, watch time.' },
      { title: 'TikTok SMM Panel', path: '/tiktok-smm-panel', desc: 'TikTok followers, views, likes.' },
      { title: 'X/Twitter SMM Panel', path: '/x-twitter-smm-panel', desc: 'Twitter/X followers, likes, retweets.' },
      { title: 'Telegram SMM Panel', path: '/telegram-smm-panel', desc: 'Telegram members, views, invites.' },
      { title: 'Snapchat SMM Panel', path: '/snapchat-smm-panel', desc: 'Snapchat followers, views.' },
      { title: 'Discord SMM Panel', path: '/discord-smm-panel', desc: 'Discord members.' },
      { title: 'LinkedIn SMM Panel', path: '/linkedin-smm-panel', desc: 'LinkedIn followers.' },
      { title: 'Pinterest SMM Panel', path: '/pinterest-smm-panel', desc: 'Pinterest followers, pins.' },
      { title: 'YouTube Watch Time', path: '/buy/youtube-watch-time', desc: 'YouTube watch hours for monetization.' },
      { title: 'SMM Panel API', path: '/api', desc: 'API integration for automated service delivery.' },
    ],
    staticPages: ['privacy-policy', 'terms-of-services', 'refund-policy', 'cookies-policy', 'disclaimer'],
    buyPages: [
      { title: 'Buy Instagram Followers', path: '/buy/instagram-followers' },
      { title: 'Buy Instagram Likes', path: '/buy/instagram-likes' },
      { title: 'Buy YouTube Subscribers', path: '/buy/youtube-subscribers' },
      { title: 'Buy YouTube Views', path: '/buy/youtube-likes' },
      { title: 'Buy Facebook Likes', path: '/buy/facebook-likes' },
      { title: 'Buy TikTok Followers', path: '/buy/tiktok-followers' },
      { title: 'Buy TikTok Views', path: '/buy/tiktok-views' },
      { title: 'Buy Telegram Members', path: '/buy/telegram-members' },
      { title: 'Buy Twitter Followers', path: '/buy/twitter-followers' },
    ],
    hasVercel: true, hasRobotsTs: true, hasNextConfigMjs: true,
  },

  'bayas': {
    domain: 'bayas.com.bd',
    name: 'BAYAS',
    tagline: 'Home & Office Computer Repair Service in Dhaka',
    root: path.resolve('/root/hithium'),
    contentDirs: {
      posts: 'content/blog',
      guides: 'content/guides',
    },
    pageDataFile: null,
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: ['.md', '.mdx'],
    homepageMd: () => banner('BAYAS') + `## Computer Repair Service Dhaka — Home & Office

BAYAS provides professional computer repair, laptop servicing, and IT support across Dhaka. Fast, reliable, on-site service for home users and businesses.

**Services:** Laptop Repair | Desktop Repair | Data Recovery | Virus Removal | SSD Upgrade | MacBook Repair | Gaming PC Build | Printer Setup | WiFi Troubleshooting

[All Services](https://bayas.com.bd/services) | [Contact](https://bayas.com.bd/contact) | [Blog](https://bayas.com.bd/blog)
`,
    servicePages: [
      { title: 'Services', path: '/services', desc: 'Complete computer repair services in Dhaka.' },
      { title: 'Contact Us', path: '/contact', desc: 'Get in touch with BAYAS.' },
      { title: 'About Us', path: '/about', desc: 'About BAYAS computer repair.' },
      { title: 'Laptop Repair', path: '/services/laptop-repair', desc: 'Laptop repair service Dhaka.' },
      { title: 'Desktop Repair', path: '/services/desktop-repair', desc: 'Desktop computer repair in Dhaka.' },
      { title: 'Data Recovery', path: '/services/data-recovery', desc: 'Data recovery service Dhaka.' },
      { title: 'Virus Removal', path: '/services/virus-removal', desc: 'Virus and malware removal.' },
      { title: 'SSD Upgrade', path: '/services/ssd-upgrade', desc: 'SSD upgrade service Dhaka.' },
    ],
    staticPages: ['privacy', 'terms', 'faq'],
    hasVercel: false, hasRobotsTs: false, hasNextConfigMjs: true,
  },

  'taeen': {
    domain: 'taeen.com.bd',
    name: 'Ta\'een',
    tagline: 'Bangladesh\'s Trusted Garment Buying House',
    root: path.resolve('/root/taeen-repo'),
    contentDirs: {},
    pageDataFile: 'lib/blog-data.json',
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: ['.json'],
    homepageMd: () => banner('Ta\'een') + `## Garment Buying House Bangladesh

Ta\'een is a trusted garment buying house in Bangladesh, connecting international buyers with premium Bangladeshi apparel manufacturers. We specialize in woven, knit, and sweater garments.

**Services:** Sourcing | Quality Control | Production Monitoring | Logistics | Compliance Auditing

[Services](https://taeen.com.bd/services) | [Contact](https://taeen.com.bd/contact) | [About](https://taeen.com.bd/about)
`,
    servicePages: [
      { title: 'Services', path: '/services', desc: 'Complete garment buying house services.' },
      { title: 'About Us', path: '/about', desc: 'About Ta\'een — our story and expertise.' },
      { title: 'Contact Us', path: '/contact', desc: 'Contact Ta\'een for garment sourcing.' },
      { title: 'Buying House Near Me', path: '/buying-house-near-me', desc: 'Find garment buying houses near you.' },
      { title: 'Garment Buying House Bangladesh', path: '/garment-buying-house-bangladesh', desc: 'Premium garment buying houses in Bangladesh.' },
      { title: 'Why Bangladesh', path: '/why-bangladesh', desc: 'Why source garments from Bangladesh.' },
    ],
    staticPages: ['privacy', 'terms'],
    hasVercel: true, hasRobotsTs: false, hasNextConfigMjs: true,
  },

  'shoaibsanto': {
    domain: 'shoaibsanto.com',
    name: 'Shoaib Santo',
    tagline: 'SEO & AI Search Optimization (GEO/AEO) Consultant Bangladesh',
    root: path.resolve('/root/shoaibsanto-repo'),
    contentDirs: {},
    pageDataFile: 'lib/posts.ts',
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: [],
    homepageMd: () => banner('Shoaib Santo') + `## SEO & AI Search Optimization Consultant Bangladesh

Shoaib Santo is a Senior SEO and AI Search (GEO/AEO) expert in Bangladesh. Specializing in Generative Engine Optimization, traditional technical SEO, and programmatic content strategy.

**Expertise:** GEO/AEO | Technical SEO | Content Strategy | Topical Authority | Programmatic SEO | WordPress & Next.js SEO

[About](https://shoaibsanto.com/about) | [Services](https://shoaibsanto.com/services) | [Blog](https://shoaibsanto.com/blog) | [Case Studies](https://shoaibsanto.com/case-studies)
`,
    servicePages: [
      { title: 'Services', path: '/services', desc: 'SEO, GEO & AEO services.' },
      { title: 'About', path: '/about', desc: 'About Shoaib Santo.' },
      { title: 'Contact', path: '/contact', desc: 'Contact Shoaib Santo.' },
      { title: 'AEO Expert Bangladesh', path: '/aeo-expert-bangladesh', desc: 'AI Engine Optimization (AEO) in Bangladesh.' },
      { title: 'GEO Expert Bangladesh', path: '/geo-expert-bangladesh', desc: 'Generative Engine Optimization in Bangladesh.' },
      { title: 'Case Studies', path: '/case-studies', desc: 'SEO case studies and results.' },
    ],
    staticPages: ['privacy-policy', 'terms-of-service'],
    hasVercel: true, hasRobotsTs: true, hasNextConfigMjs: false,
  },

  'computerrepair': {
    domain: 'computerrepair.com.bd',
    name: 'Computer Repair BD',
    tagline: 'Dhaka\'s trusted computer repair & home service',
    root: path.resolve('/root/computer-repair-bd'),
    contentDirs: {},
    pageDataFile: 'src/data/blog.ts',
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: [],
    homepageMd: () => banner('Computer Repair BD') + `## Computer Repair Service Dhaka — Home Visit

Professional computer repair and laptop servicing in Dhaka. On-site home service, fast turnaround, certified technicians.

**Services:** Laptop Repair | Desktop Repair | Data Recovery | Virus Removal | SSD/HDD Upgrade | MacBook Repair | Gaming PC | Printer Setup | WiFi & Networking | UPS Repair

[Services](https://computerrepair.com.bd/services) | [Contact](https://computerrepair.com.bd/contact) | [FAQ](https://computerrepair.com.bd/faq) | [Blog](https://computerrepair.com.bd/blog)
`,
    servicePages: [
      { title: 'Services', path: '/services', desc: 'Complete computer repair services in Dhaka.' },
      { title: 'About', path: '/about', desc: 'About Computer Repair BD.' },
      { title: 'Contact', path: '/contact', desc: 'Contact Computer Repair BD.' },
      { title: 'FAQ', path: '/faq', desc: 'Frequently asked questions about computer repair.' },
    ],
    staticPages: ['privacy-policy', 'terms-and-conditions', 'disclaimer'],
    hasVercel: false, hasRobotsTs: true, hasNextConfigMjs: true,
  },

  'airambulance': {
    domain: 'airambulancedhakabangkok.com',
    name: 'Air Ambulance Dhaka to Bangkok',
    tagline: '24/7 ICU medical flights — Dhaka to Bangkok',
    root: path.resolve('/root/airambulancedhakabangkok'),
    contentDirs: {},
    pageDataFile: null,
    htmlContentDir: 'content',
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: [],
    homepageMd: () => banner('Air Ambulance Dhaka to Bangkok') + `## Air Ambulance Dhaka to Bangkok — 24/7 ICU Medical Flights

Professional air ambulance service from Dhaka, Bangladesh to Bangkok, Thailand. Fully equipped ICU aircraft, medical team on board, 24/7 availability.

**Services:** Bed-to-Bed Transfer | ICU Medical Flight | Stretcher Service | Medical Escort | Insurance Coordination

[Contact 24/7](https://airambulancedhakabangkok.com/contact) | [Blog](https://airambulancedhakabangkok.com/blog)
`,
    servicePages: [
      { title: 'About', path: '/about', desc: 'About Air Ambulance Dhaka to Bangkok.' },
      { title: 'Contact', path: '/contact', desc: '24/7 contact for medical flights.' },
      { title: 'Services', path: '/services', desc: 'Air ambulance and medical flight services.' },
    ],
    staticPages: ['privacy', 'terms'],
    hasVercel: true, hasRobotsTs: false, hasNextConfigMjs: true,
  },

  'khanit': {
    domain: 'khanit.ca',
    name: 'Khan IT',
    tagline: 'SEO Agency in Vancouver — AI SEO, GEO & Local SEO',
    root: path.resolve('/root/khan-it'),
    contentDirs: {},
    pageDataFile: null,
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: [],
    homepageMd: () => banner('Khan IT') + `## SEO Agency Vancouver — AI SEO, GEO & Local SEO

Khan IT is a Vancouver-based SEO agency specializing in AI Search Optimization (GEO/AEO), local SEO, Google Business Profile management, technical SEO, and website development.

**Services:** AI SEO & GEO | Local SEO | Google Business Profile | Technical SEO | Web Development | Content Strategy

[About](https://khanit.ca/about) | [Services](https://khanit.ca/services) | [Blog](https://khanit.ca/blog) | [Case Studies](https://khanit.ca/case-studies) | [Contact](https://khanit.ca/contact)
`,
    servicePages: [
      { title: 'About', path: '/about', desc: 'About Khan IT SEO agency.' },
      { title: 'Contact', path: '/contact', desc: 'Contact Khan IT.' },
      { title: 'AI SEO', path: '/services/ai-seo', desc: 'AI SEO and GEO optimization services.' },
      { title: 'Local SEO', path: '/services/local-seo', desc: 'Local SEO for Vancouver businesses.' },
      { title: 'Google Business Profile', path: '/services/google-business-profile', desc: 'GBP optimization and management.' },
      { title: 'Technical SEO', path: '/services/technical-seo', desc: 'Technical SEO audit and fixes.' },
      { title: 'Case Studies', path: '/case-studies', desc: 'SEO case studies by Khan IT.' },
      { title: 'Team', path: '/team', desc: 'Meet the Khan IT team.' },
    ],
    staticPages: ['privacy-policy', 'terms'],
    hasVercel: false, hasRobotsTs: true, hasNextConfigMjs: true,
  },

  'webdesignagency': {
    domain: 'webdesignagency.xyz',
    name: 'Web Design Agency',
    tagline: 'Premium web design & development for Bangladesh businesses',
    root: path.resolve('/root/webdesignagency-repo'),
    contentDirs: { posts: 'content/posts', services: 'content/services' },
    pageDataFile: null,
    htmlContentDir: null,
    blogRoute: '/blog',
    hasBlog: true,
    postsExt: ['.ts'],
    homepageMd: () => banner('Web Design Agency') + `## Web Design & Development Agency Bangladesh

Professional web design, e-commerce development, and digital presence solutions for Bangladeshi businesses. WordPress, Shopify, MERN stack, Wix — modern, responsive, conversion-optimized websites.

**Services:** WordPress Design | Shopify Development | E-commerce Solutions | MERN Stack | Website Redesign | Maintenance

[Services](https://webdesignagency.xyz/services) | [Portfolio](https://webdesignagency.xyz/projects) | [Blog](https://webdesignagency.xyz/blog) | [Contact](https://webdesignagency.xyz/contact)
`,
    servicePages: [
      { title: 'Services', path: '/services', desc: 'Complete web design and development services.' },
      { title: 'About', path: '/about', desc: 'About Web Design Agency.' },
      { title: 'Contact', path: '/contact', desc: 'Contact for web design.' },
      { title: 'Portfolio', path: '/projects', desc: 'Web design portfolio and case studies.' },
      { title: 'Get a Quote', path: '/get-a-quote', desc: 'Get a quote for your project.' },
      { title: 'WordPress Website Design', path: '/services/wordpress-website-design', desc: 'Custom WordPress websites.' },
      { title: 'Shopify Website Design', path: '/services/shopify-website-design', desc: 'Shopify e-commerce stores.' },
      { title: 'E-commerce Website Development', path: '/services/ecommerce-website-development', desc: 'Custom e-commerce solutions.' },
      { title: 'MERN Stack Development', path: '/services/mern-stack-development', desc: 'Full-stack MERN applications.' },
      { title: 'Website Redesign', path: '/services/website-redesign', desc: 'Website redesign and optimization.' },
      { title: 'Wix Website Design', path: '/services/wix-website-design', desc: 'Wix website development.' },
      { title: 'Website Maintenance', path: '/services/website-maintenance', desc: 'Ongoing website maintenance.' },
    ],
    staticPages: ['privacy-policy', 'terms-and-conditions'],
    hasVercel: true, hasRobotsTs: true, hasNextConfigMjs: true,
  },
};

/* ─── SHARED UTILITIES ──────────────────────────────────────────────── */

function banner(name) {
  return `<!-- ${name} — AI-Generated Markdown -->\n<!-- This file is auto-generated. Do not edit manually. -->\n`;
}

function slugify(v) {
  return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function mdMeta(attrs) {
  return Object.entries(attrs)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<!-- ${k}: ${v} -->`)
    .join('\n') + '\n';
}

function parseFrontmatter(raw) {
  const lines = raw.split('\n');
  let data = {};
  let contentStart = 0;
  if (lines[0]?.trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i]?.trim() !== '---') {
      const match = lines[i].match(/^(\w+):\s*(.*)/);
      if (match) {
        const [_, key, val] = match;
        const clean = val.replace(/^["']|["']$/g, '').trim();
        if (clean === 'true') data[key] = true;
        else if (clean === 'false') data[key] = false;
        else if (!isNaN(Number(clean))) data[key] = Number(clean);
        else data[key] = clean;
      }
      i++;
    }
    contentStart = i + 1;
  }
  return { data, content: lines.slice(contentStart).join('\n').trim() };
}

/* ─── AI MARKDOWN FILE GENERATION ──────────────────────────────────── */

function buildMarkdown({ site, page }) {
  const lines = [];
  lines.push(banner(site.name));
  lines.push(mdMeta({ 
    'source': site.domain + page.path,
    'page-title': page.title,
    ...(page.description ? { description: page.description } : {}),
    'canonical': `https://${site.domain}${page.path}`,
    ...(page.date ? { published: page.date } : {}),
    ...(page.author ? { author: page.author } : {}),
    ...(page.category ? { category: page.category } : {}),
  }));
  lines.push(`# ${page.title}\n`);
  if (page.description) lines.push(`> ${page.description}\n`);
  if (page.breadcrumb) lines.push(`[Home](https://${site.domain}/) → ${page.breadcrumb}\n`);
  lines.push(page.content || page.description || '');
  if (site.domain) lines.push(`\n---\n*AI-generated Markdown for LLM consumption. Original page: https://${site.domain}${page.path}*`);
  return lines.join('\n');
}

function generatePageMd(site, pageDef) {
  const page = {
    title: pageDef.title,
    path: pageDef.path,
    description: pageDef.desc || pageDef.description || '',
    content: pageDef.content || '',
    breadcrumb: pageDef.title,
  };
  return buildMarkdown({ site, page });
}

function generateLlmsTxt(site, blogPosts, allPages) {
  const l = [];
  l.push(`# ${site.name} — LLMS Discovery File`);
  l.push('');
  if (site.tagline) l.push(`> ${site.tagline}`);
  l.push('');
  l.push('## About');
  l.push(`- Website: https://${site.domain}`);
  l.push(`- Name: ${site.name}`);
  l.push('');

  const info = [];
  for (const p of allPages) {
    if (p.type === 'home' || p.type === 'static' || p.type === 'service') {
      info.push(`- [${p.title}](https://${site.domain}${p.path})`);
    }
  }
  if (info.length) {
    l.push('## Pages');
    l.push(...info);
    l.push('');
  }

  if (blogPosts.length) {
    l.push('## Blog Posts');
    l.push('');
    for (const p of blogPosts) {
      const desc = (p.description || '').length > 120 ? p.description.substring(0, 117) + '...' : (p.description || 'No description');
      l.push(`- [${p.title}](https://${site.domain}${site.blogRoute}/${p.slug}): ${desc}`);
    }
    l.push('');
  }

  l.push('## AI Access');
  l.push(`- Append \`.md\` to any URL or use \`?format=markdown\``);
  l.push(`- AI sitemap: https://${site.domain}/ai-sitemap.xml`);
  return l.join('\n');
}

function generateAISitemap(site, allPages) {
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  for (const p of allPages) {
    const path = p.path || '/';
    xml += '  <url>\n';
    xml += `    <loc>https://${site.domain}${path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    if (p.priority) xml += `    <changefreq>${p.changefreq || 'monthly'}</changefreq>\n`;
    if (p.priority) xml += `    <priority>${p.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" type="text/markdown" href="https://${site.domain}/ai${path.endsWith('/') ? path + 'index' : path}.md" />\n`;
    xml += '  </url>\n';
  }
  xml += '</urlset>\n';
  return xml;
}

/* ─── CONTENT EXTRACTION ───────────────────────────────────────────── */

/** Strip HTML tags and get clean text from HTML content */
function extractTextFromHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPosts(site) {
  const posts = [];

  // Extract from content/blog directories (MDX/MD files)
  for (const [dirName, dirPath] of Object.entries(site.contentDirs)) {
    if (!dirName.includes('post') && !dirName.includes('blog')) continue;
    const fullDir = path.join(site.root, dirPath);
    if (!fs.existsSync(fullDir)) continue;

    for (const file of fs.readdirSync(fullDir)) {
      const ext = path.extname(file);
      if (!['.md', '.mdx', '.ts'].includes(ext)) continue;
      const slug = path.basename(file, ext);
      const raw = fs.readFileSync(path.join(fullDir, file), 'utf8');

      if (ext === '.md' || ext === '.mdx') {
        const { data, content } = parseFrontmatter(raw);
        posts.push({
          slug: data.slug || slug,
          title: data.title || data.TITLE || slug,
          description: data.description || data.DESCRIPTION || '',
          date: data.date || data.DATE || '2026-01-01',
          category: data.category || data.CATEGORY || 'General',
          author: data.author || site.name,
          content: content.substring(0, 5000),
          image: data.image || data.IMAGE || '',
          imageAlt: data.imageAlt || '',
          tags: data.tags || [],
        });
      } else if (ext === '.ts') {
        // Parse TS export data
        const titleMatch = raw.match(/title:\s*['"](.+?)['"]/);
        const descMatch = raw.match(/(?:description|excerpt):\s*['"](.+?)['"]/);
        const dateMatch = raw.match(/(?:date|publishedAt):\s*['"](.+?)['"]/);
        posts.push({
          slug,
          title: titleMatch ? titleMatch[1] : slug,
          description: descMatch ? descMatch[1] : '',
          date: dateMatch ? dateMatch[1] : '2026-01-01',
          category: 'Blog',
          author: site.name,
          content: descMatch ? descMatch[1] : '',
        });
      }
    }
  }

  // Extract from pageDataFile (TS/JS data files with blog arrays) or JSON data
  if (site.pageDataFile) {
    const dataFile = path.join(site.root, site.pageDataFile);
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      
      // Try JSON parsing first (for JSON blog data files)
      try {
        const jsonData = JSON.parse(raw);
        if (Array.isArray(jsonData)) {
          for (const item of jsonData) {
            posts.push({
              slug: item.slug || item.slug || `post-${posts.length}`,
              title: item.title || item.TITLE || 'Untitled',
              description: item.description || item.excerpt || item.DESCRIPTION || '',
              date: item.published || item.date || item.publishDate || '2026-01-01',
              category: item.category || 'General',
              author: item.author || site.name,
              content: item.body ? extractTextFromHtml(item.body).substring(0, 5000) : (item.content || item.excerpt || ''),
              image: item.image || item.thumb || item.IMAGE || '',
              imageAlt: item.imageAlt || item.imageAlt || '',
              tags: item.tags || [],
            });
          }
          // Skip the regex parsing below if JSON succeeded
          if (jsonData.length > 0) {
            // Continue to dedup
          }
        }
      } catch (e) {
        // Not JSON, try regex extraction
      }
      const postBlocks = raw.split(/export\s+(const|let|var)\s+\w+\s*[:=]/);
      // Look for arrays of post objects
      const slugMatches = [...raw.matchAll(/slug:\s*['"](.+?)['"]/g)];
      const titleMatches = [...raw.matchAll(/title:\s*['"](.+?)['"]/g)];
      const descMatches = [...raw.matchAll(/(?:excerpt|description):\s*['"](.+?)['"]/g)];
      const dateMatches = [...raw.matchAll(/date:\s*['"](.+?)['"]/g)];
      const authorMatches = [...raw.matchAll(/author:\s*['"](.+?)['"]/g)];

      const count = Math.max(slugMatches.length, titleMatches.length, descMatches.length);
      for (let i = 0; i < count && i < 200; i++) {
        posts.push({
          slug: slugMatches[i]?.[1] || `post-${i}`,
          title: titleMatches[i]?.[1] || `Post ${i}`,
          description: descMatches[i]?.[1] || '',
          date: dateMatches[i]?.[1] || '2026-01-01',
          author: authorMatches[i]?.[1] || site.name,
          category: 'Blog',
          content: descMatches[i]?.[1] || '',
        });
      }
    }
  }

  // Extract from HTML content dir
  if (site.htmlContentDir) {
    const htmlDir = path.join(site.root, site.htmlContentDir, 'blog');
    if (fs.existsSync(htmlDir)) {
      for (const file of fs.readdirSync(htmlDir)) {
        if (!file.endsWith('.html') || file === 'index.html') continue;
        const html = fs.readFileSync(path.join(htmlDir, file), 'utf8');
        const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
        const slug = file.replace(/\.html$/, '');
        posts.push({
          slug,
          title: titleMatch ? titleMatch[1].trim() : slug,
          description: descMatch ? descMatch[1] : '',
          date: '2026-01-01',
          category: 'Blog',
          author: site.name,
          content: descMatch ? descMatch[1] : '',
        });
      }
    }
  }

  // Deduplicate by slug
  const seen = new Set();
  return posts.filter(p => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ─── MAIN GENERATOR ───────────────────────────────────────────────── */

function main() {
  const args = process.argv.slice(2);
  const siteArg = args.find(a => a.startsWith('--site='));
  if (!siteArg) {
    console.error('Usage: node scripts/generate-ai-markdown.mjs --site=<site-name>');
    console.error('Available sites:', Object.keys(SITES).join(', '));
    process.exit(1);
  }

  const siteName = siteArg.split('=')[1];
  const site = SITES[siteName];
  if (!site) {
    console.error(`Unknown site: ${siteName}`);
    console.error('Available:', Object.keys(SITES).join(', '));
    process.exit(1);
  }

  console.log(`🤖 AI Markdown Generation — ${site.name} (${site.domain})`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const AI_DIR = path.join(site.root, 'public', 'ai');
  if (fs.existsSync(AI_DIR)) fs.rmSync(AI_DIR, { recursive: true });
  fs.mkdirSync(AI_DIR, { recursive: true });

  const posts = extractPosts(site);
  const allPages = [];
  const stats = { blog: 0, service: 0, static: 0, buy: 0 };

  function writeMd(relPath, content) {
    const full = path.join(AI_DIR, relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, 'utf8');
  }

  function safePath(p) {
    const cleaned = p.endsWith('/') ? p.slice(0, -1) : p;
    return cleaned === '' ? '/index' : cleaned;
  }

  // 1. Homepage
  const homeContent = generatePageMd(site, {
    title: `${site.name} — ${site.tagline || ''}`,
    path: '/',
    content: site.homepageMd(),
  });
  writeMd('/index.md', homeContent);
  allPages.push({ title: site.name, path: '/', type: 'home', priority: '1.0', changefreq: 'daily' });
  stats.static++;

  // 2. Blog posts
  console.log(`📝 Generating ${posts.length} blog posts...`);
  for (const p of posts) {
    const content = buildMarkdown({
      site,
      page: {
        title: p.title,
        path: `${site.blogRoute}/${p.slug}`,
        description: p.description,
        date: p.date,
        author: p.author,
        category: p.category,
        content: p.content,
        breadcrumb: `[Blog](https://${site.domain}${site.blogRoute}) → ${p.title}`,
      },
    });
    writeMd(`${site.blogRoute}/${p.slug}.md`, content);
    writeMd(`${site.blogRoute}/${p.slug}/index.md`, content);
    allPages.push({
      title: p.title,
      path: `${site.blogRoute}/${p.slug}`,
      type: 'blog',
      priority: '0.8',
      changefreq: 'monthly',
      date: p.date,
      author: p.author,
      category: p.category,
    });
    stats.blog++;
  }

  // Blog index
  if (posts.length) {
    const blogLines = [banner(site.name)];
    blogLines.push(mdMeta({ 'title': `Blog — ${site.name}`, 'canonical': `https://${site.domain}${site.blogRoute}` }));
    blogLines.push(`# ${site.name} Blog\n`);
    for (const p of posts) {
      blogLines.push(`## [${p.title}](https://${site.domain}${site.blogRoute}/${p.slug})`);
      if (p.description) blogLines.push(`> ${p.description}`);
      if (p.date) blogLines.push(`Published: ${p.date}`);
      blogLines.push('');
    }
    writeMd(`${site.blogRoute}.md`, blogLines.join('\n'));
    writeMd(`${site.blogRoute}/index.md`, blogLines.join('\n'));
    allPages.push({ title: `${site.name} Blog`, path: site.blogRoute, type: 'blog-index', priority: '0.7', changefreq: 'daily' });
  }

  // 3. Service pages
  console.log(`📝 Generating ${site.servicePages.length} service pages...`);
  for (const p of site.servicePages) {
    const content = generatePageMd(site, p);
    writeMd(`${safePath(p.path)}.md`, content);
    allPages.push({ title: p.title, path: p.path, type: 'service', priority: '0.7', changefreq: 'weekly' });
    stats.service++;
  }

  // 4. Static pages
  for (const p of site.staticPages) {
    const pathname = `/${p}`;
    const title = p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const content = generatePageMd(site, {
      title: `${title} — ${site.name}`,
      path: pathname,
      content: `This page is available at https://${site.domain}${pathname}. For complete content with legal text and detailed information, visit the original page.`,
    });
    writeMd(`${safePath(pathname)}.md`, content);
    allPages.push({ title: `${title} — ${site.name}`, path: pathname, type: 'static', priority: '0.3', changefreq: 'monthly' });
    stats.static++;
  }

  // 5. Buy pages (for SMM site)
  if (site.buyPages) {
    for (const p of site.buyPages) {
      const content = generatePageMd(site, { ...p, content: `For complete pricing tiers, packages, and ordering, visit: https://${site.domain}${p.path}` });
      writeMd(`${safePath(p.path)}.md`, content);
      allPages.push({ title: p.title, path: p.path, type: 'buy', priority: '0.9', changefreq: 'daily' });
      stats.buy++;
    }
  }

  // 6. Category and author pages (for blog posts)
  const categories = [...new Set(posts.filter(p => p.category).map(p => p.category))];
  for (const cat of categories) {
    const catSlug = slugify(cat);
    const catPosts = posts.filter(p => p.category === cat);
    const lines = [banner(site.name), `# ${cat}\n`];
    for (const p of catPosts) {
      lines.push(`## [${p.title}](https://${site.domain}${site.blogRoute}/${p.slug})`);
      if (p.description) lines.push(`> ${p.description}`);
      if (p.date) lines.push(`Published: ${p.date}`);
      lines.push('');
    }
    writeMd(`${site.blogRoute}/category/${catSlug}.md`, lines.join('\n'));
    allPages.push({ title: `${cat} — ${site.name}`, path: `${site.blogRoute}/category/${catSlug}`, type: 'category', priority: '0.5', changefreq: 'weekly' });
  }

  // 7. llms.txt
  console.log('📝 Generating llms.txt...');
  const llms = generateLlmsTxt(site, posts, allPages);
  fs.writeFileSync(path.join(site.root, 'public', 'llms.txt'), llms, 'utf8');

  // 8. ai-sitemap.xml
  console.log('📝 Generating ai-sitemap.xml...');
  const sitemap = generateAISitemap(site, allPages);
  fs.writeFileSync(path.join(site.root, 'public', 'ai-sitemap.xml'), sitemap, 'utf8');

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Generation Complete');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Blog posts:    ${stats.blog}`);
  console.log(`   Service pages: ${stats.service}`);
  console.log(`   Static pages:  ${stats.static}`);
  if (stats.buy) console.log(`   Buy pages:     ${stats.buy}`);
  console.log(`   ─────────────────────────`);
  console.log(`   Total pages:   ${allPages.length}`);
  console.log(`   llms.txt:      ✓`);
  console.log(`   ai-sitemap.xml: ✓ (${allPages.length} URLs)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${site.name} AI Markdown generation complete!\n`);
}

main();
