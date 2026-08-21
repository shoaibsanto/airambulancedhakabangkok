# air-ambulance-daily রিপোর্ট — ২০২৬-০৮-২৪

## GSC পারফরম্যান্স সারাংশ

**৭ দিন (১৪–২১ আগস্ট):** ১৯৯ ইমপ্রেশন, ১ ক্লিক, ০.৫% CTR, পজিশন ১৪.২  
**২৮ দিন (২৪ জুলাই – ২১ আগস্ট):** ৮৬১ ইমপ্রেশন, ৯ ক্লিক, ১.০৫% CTR, পজিশন ১০.১

**বাসলাইন তুলনা:** CTR ২.৮৯% থেকে কমে ১.০৫% হয়েছে (৬৩.৭% অবনতি)। ইমপ্রেশন ২৪% বেড়েছে, কিন্তু ক্লিক ৫৫% কমছে। এটি AI Overview ক্যানিবালাইজেশনের লক্ষণ।

## ইনডেক্সিং পরিস্থিতি

| পৃষ্ঠা | স্ট্যাটাস |
|--------|-----------|
| হোমপেজ | ✅ ইনডেক্সেড |
| /services | ⚠️ Discovered - not indexed (চক্র ৩০) |
| /guides/air-ambulance-dhaka-bangkok | ✅ ইনডেক্সেড |
| /air-ambulance-cost | ✅ ইনডেক্সেড |
| /bangkok-hospitals | ✅ ইনডেক্সেড |
| /blog/air-ambulance-dhaka-to-singapore | 🔴 Unknown to Google (নতুন সমস্যা) |
| /blog/air-ambulance-dhaka-to-myanmar | ⚠️ Discovered - not indexed |
| /blog/medical-evacuation-cost-bangladesh | ⚠️ Discovered - not indexed |

## মূল প্রশ্নসমূহ (০ CTR)

- "air ambulance bangladesh" — ২৩ ইম্প, পজ ৪, ০ ক্লিক
- "air ambulance in bangladesh" — ২৩ ইম্প, পজ ২, ০ ক্লিক
- "air ambulance dhaka to bangkok cost" — ১৪ ইম্প, পজ ৮.৪, ০ ক্লিক
- "air ambulance dhaka" — ১১ ইম্প, পজ ২.৭, ০ ক্লিক

## টেকনিক্যাল অডিট

- OG/Twitter ট্যাগ: সব ক্লিন (কোনো ডুপ্লিকেট নেই)
- Canonical: সব পেজে আছে
- Orphan পেজ: নেই
- Build: ১১৪ পেজ জেনারেট হয়েছে ✅
- সারম্যাটে integrity: সব ঠিক আছে

## নেওয়া কর্ম

১. GSC ডেটা সংগ্রহ (৭ দিন + ২৮ দিন)  
২. ৯টি গুরুত্বপূর্ণ পেজের ইনডেক্সিং স্ট্যাটাস চেক  
৩. টেকনিক্যাল অডিট সম্পন্ন  
৪. Build ভেরিফাই (১১৪ স্ট্যাটিক পেজ)  
৫. ইনডেক্সিং সিগন্যাল রিফ্রেশের জন্য ডেপ্লয় চালানো হয়েছে

## মালিকের জন্য কাজের তালিকা

### 🔴 জরুরি — GSC-তে "Request Indexing" করুন
১. `/services` — ৩০তম চক্রেও আনইনডেক্সড  
২. `/blog/air-ambulance-dhaka-to-singapore` — Google-এর কাছে অজানা  
৩. `/blog/air-ambulance-dhaka-to-myanmar` — Discovered but not indexed  
৪. `/blog/medical-evacuation-cost-bangladesh` — Discovered but not indexed

লিংক: https://search.google.com/search-console/inspect?resource_id=sc-domain:airambulancedhakabangkok.com

### 🟡 গুরুত্বপূর্ণ
১. **AI Overview ক্যানিবালাইজেশন** — CTR ৬৩% কমেছে। এটি মെটাডেটা সমস্যা নয়, AI Overview ক্লিক নিচ্ছে। FAQ schema এবং entity-rich content দিয়ে এটির মোকাবিলা করতে পারেন।  
২. **Token expiry** — `2026-08-21` তারিখে মেয়াদ শেষ হয়েছে, কিন্তু refresh_token এখনও কাজ করছে। পর্যবেক্ষণ করুন।

### 🟢 স্বাভাবিক
- `/icu-vs-medical-escort` পজিশন রিগ্রেশন (~৩৮) — পর্যবেক্ষণ চলমান

## সাইট স্ট্যাটাস

- মোট পেজ: ৫৬ কন্টেন্ট ফাইল / ১১৪ স্ট্যাটিক বিল্ড পেজ
- ইনডেক্সড: ৫/৯ (৫৬%) — ৪টি অপেক্ষমাণ
- GSC অ্যাক্সেস: কার্যকর (টোকেন এক্সপায়ার্ড কিন্তু রিফ্রেশ কাজ করছে)
- ডেপ্লয়: সফল ✅
