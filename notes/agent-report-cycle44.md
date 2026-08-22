# air-ambulance-daily রিপোর্ট — 2026-08-22

## GSC পালস
**GSC AUTH EXPIRED** — টোকেন ২০২৬-০৮-২২T০৬:৩১:০৩Z তে মেয়াদ শেষ হয়েছে। সব MCP কল "Authentication failed" ফিরিয়ে দিচ্ছে। সব GSC ধাপ বাদ দেওয়া হলো (প্রোটোকল অনুযায়ী)।

**মালিকের করণীয়:** https://search.google.com/search-console/ এ গিয়ে OAuth রি-অথেন্টিকেশন সম্পন্ন করুন।

## ইনডেক্সিং হাইজিন
GSC অ্যাক্সেস নেই বলে সরাসরি URL ইনস্পেকশন করা সম্ভব নয়। পূর্ববর্তী সাইকেল থেকে জানা তথ্য:

| পেজ | অবস্থা |
|-----|--------|
| `/` (হোমপেজ) | ✅ ইনডেক্সড |
| `/services` | ⚠️ **৩৬তম সাইকেলও অইনডেক্সড** — TIER 1 |
| `/bangkok-hospitals` | ✅ ইনডেক্সড |
| `/guides/air-ambulance-dhaka-bangkok` | ✅ ইনডেক্সড |
| `/air-ambulance-cost` | ✅ ইনডেক্সড |
| `/blog/air-ambulance-dhaka-to-singapore` | ⚠️ ডিসকভারড কিন্তু ইনডেক্স হযনি — TIER 2 |
| `/blog/air-ambulance-dhaka-to-myanmar` | ⚠️ ডিসকভারড কিন্তু ইনডেক্স হযনি — TIER 2 |

## টেকনিক্যাল অডিট
- **মোট কন্টেন্ট ফাইল:** ৫৬টি
- **ব্লগ পোস্ট:** ৩৩টি (সবই লিস্টিং + স্যাম্পলেটে আছে ✅)
- **FAQPage কভারেজ:** ৪৬/৪৬ eligible পেজ ✅
- **ডুপ্লিকেট OG/Twitter ট্যাগ:** নেই ✅
- **মিসিং canonical:** নেই ✅
- **টাইটেল লেংথ ইস্যু:** ১টি (`/guides/air-ambulance-dhaka-bangkok` — ৬৯c, মালিক-মডিফাইড, পরিবর্তন করা হয়নি)
- **লো-লিংক পেজ:** ০/৫৪ ✅
- **রুট-পাথ ৪০৪ লিংক:** নেই ✅
- **বিল্ড:** পাস (১১৪টি পেজ জেনারেটেড)
- **স্যাম্পলেট:** HTTP ২০০ ✅

## নেওয়া কাজ
১. ✅ সম্পূর্ণ টেকনিক্যাল অডিট সম্পন্ন — সবকিছু ক্লিন (১টি টাইটেল লেংথ নোট বাদে)
২. ✅ ব্লগ লিস্টিং + স্যাম্পলেট ইনটেগ্রিটি চেক — সব ঠিক আছে
৩. ✅ বিল্ড ভেরিফাইড (১১৪ পেজ, কোনো এরর নেই)
৪. ❌ কোনো কন্টেন্ট চেঞ্জ প্রয়োজন হয়নি
৫. ❌ GSC পালস বাদ — অথ এক্সপায়ার
৬. ❌ ইনডেক্সিং ইনস্পেকশন বাদ — অথ এক্সপায়ার
৭. ❌ CTR স্ক্যান বাদ — অথ এক্সপায়ার

## কমিট
- `9bf003f` SEO daily 2026-08-22: Cycle 44 — GSC auth expired, technical audit clean, 56 pages, owner re-auth required
- ২টি ফাইল পরিবর্তন (notes/cron-log.md, seo-data/content-plan.md)

## মালিকের করণীয় তালিকা

**TIER 0 — GSC রি-অথ (CRITICAL)**
https://search.google.com/search-console/ দেখতে যান
airambulancedhakabangkok.com এর জন্য OAuth রি-অথেন্টিকেশন সম্পন্ন করুন

**TIER 1 (URGENT):**
১. `/services` — **৩৬তম সাইকেলও অইনডেক্সড।** ক্লাস্টার ১ পিলার পেজ।
   → https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com

**TIER 2 (IMPORTANT):**
২. `/blog/air-ambulance-dhaka-to-singapore` — ডিসকভারড কিন্তু ইনডেক্স হয়নি
৩. `/blog/air-ambulance-dhaka-to-myanmar` — ডিসকভারড কিন্তু ইনডেক্স হয়নি

## নোটস
- CTR বেসলাইন Jul 17 থেকে: ৬৯৩ imps / ২০ clicks / ২.৮৯% CTR (২৮-দিন)
- Aug ২৬-এ ৭-দিন ডাটা দেখেছিল ~১০০ imps / ৫ clicks / ০.৫৭% CTR — উল্লেখযোগ্য পতন, সম্ভবত AI Overview cannibalization
- GSC অ্যাক্সেস না থাকায় বর্তমান অবস্থা যাচাই করা যাচ্ছে না
- এই সাইক্লে নতুন কোনো কন্টেন্ট গ্যাপ শনাক্ত হয়নি
- পূর্ববর্তী মালিকের টাইটেল অ্যাকশন (b0038bf, a6708f2) বহাল তবিয়তে আছে

## সিদ্ধান্ত
কোনো ক্রিটিক্যাল ইস্যু নেই। সাইট টেকনিক্যালি সুস্থ। একমাত্র অপেক্ষমাণ বিষয়: GSC অথ রি-অথেন্টিকেশন (মালিকের করণীয়) এবং `/services` পৃষ্ঠা ইনডেক্সিং (ম্যানুয়াল রিকোয়েস্ট প্রয়োজন)।
