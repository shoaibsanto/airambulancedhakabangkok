# air-ambulance-daily রিপোর্ট — 2026-08-22 (Cycle 33)

## GSC পারফরম্যান্স (৭ দিন)
| মেট্রিক | বর্তমান | বেসলাইন | পরিবর্তন |
|---------|---------|---------|---------|
| Impressions | 178 | ~168 | +5.9% ✅ |
| Clicks | 1 | ~4 | -75% 🔴 |
| CTR | 0.56% | 2.38% | **-76%** 🔴 |
| Avg Position | 14.8 | 11.3 | -3.5 |

**২৮-দিনের সারাংশ:** Impressions 845, Clicks 8, CTR 0.95%, Position 10.0

## ইন্ডেক্সিং হাইজিন
| পেজ | স্ট্যাটাস |
|-----|----------|
| Homepage `/` | ✅ ইন্ডেক্সড |
| `/guides/air-ambulance-dhaka-bangkok` | ✅ ইন্ডেক্সড |
| `/air-ambulance-cost` | ✅ ইন্ডেক্সড |
| `/bangkok-hospitals` | ✅ ইন্ডেক্সড |
| `/services` | 🔴 **Google-এর কাছে অপরিচিত (সাইকেল 33)** |
| `/blog/air-ambulance-dhaka-to-singapore` | ⚠️ Discoverd but not indexed |
| `/blog/air-ambulance-dhaka-to-myanmar` | ⚠️ Discovered but not indexed |

## টেকনিক্যাল অডিট
- ✅ Duplicate OG/Twitter tags: CLEAN
- ✅ Missing canonicals: CLEAN
- ✅ FAQPage coverage: 100% complete (সকল কন্টেন্ট পেজে)
- ✅ Blog listing gaps: NONE
- ✅ Sitemap gaps: NONE
- ✅ Root-path link issues: NONE
- ✅ Build: 114 pages generated

## প্রধান সমস্যা: AI Overview Cannibalization
**CTR 0.56% → 2.38% বেসলাইন থেকে পতন**

প্রধান কারণ: AI Overview এখন টপ পজিশনের কোয়েরিগুলোর ক্লিকগুলো নিজে absorbing করছে। 

উদাহরণ:
- `/guides/air-ambulance-dhaka-bangkok`: 197 impressions, 0 clicks, pos 6.6
- `/blog/bangkok-hospitals-comparison`: 65 impressions, 0 clicks, pos 8.7
- `/icu-vs-medical-escort`: 44 impressions, 0 clicks, pos 37.8 (regression)

## টেকনিক্যাল ফিক্স
এই সাইকেলে কোনো টেকনিক্যাল ফিক্স প্রয়োজন হয়নি। সব বিষয় clean আছে।

## পরবর্তী সাইকেলে যা দেখব
1. `/services` পেজটি "unknown" থেকে "discovered"-তে উঠেছে কিনা
2. গাইড পিলার পেজে ক্লিক আসছে কিনা (197 impressions, pos 6.6)
3. সিঙ্গাপুর/মায়ানমার পেজ ইন্ডেক্স হয়েছে কিনা
4. CTR稳定 হচ্ছে কিনা

## 🔴 অ্যাকশন নিউড — গুগল সার্চ কনসোল

**🔴 Tier 1 (সবচেয়ে জরুরি):**
1. `/services` — **33তম সাইকেলেও অপরিচিত**। Cluster 1 পিলার পেজ। "Air Ambulance Service Dhaka to Bangkok" কীওয়ার্ডের জন্য ক্রিটিক্যাল।
   Link: https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com&id=h5GcqelDZAPT2ow-S0HWeQ

**🔴 Tier 2 (গুরুত্বপূর্ণ):**
2. `/blog/air-ambulance-dhaka-to-singapore` — Discovered but not indexed
3. `/blog/air-ambulance-dhaka-to-myanmar` — Discovered but not indexed

**অ্যাকশন:** উপরের প্রতিটি URL-এ ক্লিক করুন → "Request Indexing" বাটনে ক্লিক করুন।

## সাইট স্ট্যাটাস
- মোট কন্টেন্ট ফাইল: 56 HTML
- স্ট্যাটিক পেজ: 114
- ইন্ডেক্সড পিলার পেজ: 4/7 (57%)
- 7-Day CTR: 0.56% (CRITICAL)
- FAQPage: 100% complete
- Deploy প্রয়োজন: না (কোনো পরিবর্তন নেই)

---

**নোট:** CTR পতন একটি স্ট্রাকচারাল SERP সমস্যা — AI Overview-এর কারণে। এটা metadata ফিক্স দিয়ে সমাধান হয় না। মনোযোগ রাখুন: কীভাবে AI Overview আপনার পেজগুলোকে cite করছে, এবং FAQ schema-এ entity-rich content দিয়ে citation increase করার সুযোগ খুঁজুন।
