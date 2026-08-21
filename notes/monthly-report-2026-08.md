# air-ambulance-daily রিপোর্ট — 2026-08-21

## সারসংক্ষেপ
গত সাইকেল থেকে কোনো ক্রিটিক্যাল সমস্যা পাওয়া যায়নি। টেকনিক্যাল অডিট ক্লিন — ৫৬টি ফাইলে কোনো ডুপ্লিকেট OG/Twitter ট্যাগ, মিসিং ক্যানোনিক্যাল বা অন্যান্য সমস্যা নেই।

## GSC পারফরম্যান্স পালস

### ২৮ দিনের ডেটা (Jul 24 – Aug 21)
- **Impressions:** 837 (baseline 693 → **+21%**)
- **Clicks:** 9 (baseline 20 → **-55%**)
- **CTR:** 1.08% (baseline 2.89% → **হ্রাস পেয়েছে**)
- **Position:** 11.1 (baseline 9.6 → **পজিশন কমিয়েছে**)

### ৭ দিনের ডেটা (Aug 14 – 20)
- Impressions: 175
- Clicks: 1
- CTR: 0.57%
- Position: 14.4

**বিশ্লেষণ:** ইমপ্রেশন বাড়লেও ক্লিক ৫৫% কমেছে। এর মানে হলো AI Overview বা Featured Snippet ক্লিক গিলে নিচ্ছে — সাইটের পজিশন ভালো (pos 6-12) কিন্তু CTR শূন্যের কাছাকাছি। এটি একটি বড় সমস্যা।

## ইনডেক্সিং স্ট্যাটাস
| পেজ | স্ট্যাটাস |
|-----|----------|
| `/` (হোমপেজ) | ✅ ইনডেক্সড |
| `/services` | ⚠️ ডিসকভারড-নট-ইনডেক্সড (২৪তম সাইকেল) |
| `/bangkok-hospitals` | ✅ ইনডেক্সড |
| `/guides/air-ambulance-dhaka-bangkok` | ✅ ইনডেক্সড |
| `/air-ambulance-cost` | ✅ ইনডেক্সড |
| `/cardiac-emergency-transfer` | ✅ ইনডেক্সড |

**নোট:** `/services` পেজটি এখন ২৪তম সাইকেলেও ইনডেক্স হয়নি। তবে রেফারিং URL-এ `blog/air-ambulance-dhaka-to-chennai-india` যুক্ত হয়েছে — কিছুটা প্রগ্রেস।

## GSC পেজ-ভিত্তিক ডেটা
| পেজ | Imps | Clicks | CTR | Pos |
|-----|------|--------|-----|-----|
| `/` (হোমপেজ) | 327 | 7 | 2.14% | 7.9 |
| `/guides/air-ambulance-dhaka-bangkok` | 193 | 0 | 0% | 6.6 |
| `/air-ambulance-cost` | 128 | 1 | 0.78% | 12.0 |
| `/icu-vs-medical-escort` | 44 | 0 | 0% | 37.8 |
| `/blog/bangkok-hospitals-comparison` | 63 | 0 | 0% | 8.8 |
| `/blog/medical-visa-thailand` | 43 | 0 | 0% | 11.7 |
| `/cardiac-emergency-transfer` | 10 | 0 | 0% | 23.0 |

## প্রধান সমস্যা

### ১. CTR কollapse (সবচেয়ে গুরুতর)
২৮ দিনে মাত্র ৯টি ক্লিক এসেছে (baseline ২০)। Pilla page `/guides/air-ambulance-dhaka-bangkok`-এ ১৯৩ ইমপ্রেশন কিন্তু ০ ক্লিক — AI Overview ক্যানিবালাইজেশনের ক্লাসিক উদাহরণ।

### ২. `/services` ২৪ সাইকেল ধরে ইনডেক্স হয়নি
এখনো Discovered-not-indexed স্ট্যাটাসে আছে। Google এই পেজটি দেখছে কিন্তু ইনডেক্স করছে না।

### ৩. `/icu-vs-medical-escort` পজিশন ৩৭.৮
পূর্বের ৫৬.৪ থেকে কিছুটা পুনরুদ্ধার হয়েছে (২৩→৩৭), কিন্তু এখনো খুব নিচে। কন্টেন্ট রিফ্রেশ আগেই করা হয়েছে (cycle 10)।

## টেকনিক্যাল অডিট
- ✅ ৫৬টি ফাইল স্ক্যান — কোনো ডুপ্লিকেট OG/Twitter ট্যাগ নেই
- ✅ সব ফাইলে canonical present
- ✅ FAQPage schema complete
- ✅ Blog listing + sitemap integrity check پاس
- ✅ ৪টি লং টাইটল (>৬২c) — সব owner-set, পলিসি অনুযায়ী ট্রিম করা হয়নি
- ✅ কোনো রুট-পাথ ৪০৪ নেই
- ✅ Build successful (৫৬ পেজ জেনারেটেড)

## অ্যাকশন নেওয়া হয়নি
যেহেতু কোনো ফাইক্সযোগ্য টেকনিক্যাল সমস্যা নেই, তাই কোনো এডিট বা ডিপ্লয় করা হয়নি।

## মালিকের জন্য কাজ

### জরুরি (Tier 1)
১. **`/services` পেজ ইনডেক্স করতে GSC-এ "Request Indexing" করুন**
   https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com

### জরুরি (Tier 0)
২. **GSC OAuth টোকেন রি-অথেনটিিকেট করুন**
   Token expiry: 2026-08-21T06:14 UTC (ইতিমধ্যে শেষ হয়েছে, এখনো refresh কাজ করছে কিন্তু শীঘ্রই বন্ধ হবে)

## পরবর্তী সাইকেলে মনিটর করার বিষয়
- `/guides/air-ambulance-dhaka-bangkok` পজিশন ৬.৬-তে ০ CTR — AI Overview ক্যানিবালিজেশন চলছে
- `/services` ইনডেক্সিং — manual Request Indexing করলে কত দ্রুত ইনডেক্স হয়
- CTR পুনরুদ্ধার — title differentiation (cycle 22) এর প্রভাব