#!/usr/bin/env python3
"""
Full Koray Semantic SEO + Beyond SEO implementation for airambulancedhakabangkok.com
Steps:
1. Update llms.txt - add missing blog post page, enhance Preferred Citation
2. Update robots.js - add more AI crawlers (15+)
3. PAA H2 conversion - convert declarative H2s to question format
4. Predicate internal linking - add predicate-based inline links
5. Orphan page check
"""
import re
import os
import sys
from collections import defaultdict

CONTENT_DIR = "content"
BLOG_DIR = "content/blog"

# ============================================================
# STEP 1: Update llms.txt
# ============================================================
def update_llmstxt():
    path = "public/llms.txt"
    with open(path, "r") as f:
        content = f.read()

    # Check if the new blog post is already in llms.txt
    if "air-ambulance-dhaka-bangkok-bumrungrad-cost" in content:
        print("[1] llms.txt: Blog post already listed ✓")
        return content

    # Add the missing blog post in the Guides section
    old = "## Guides (blog content silo — pillar + clusters)\n- Complete Guide (pillar): https://airambulancedhakabangkok.com/blog\n- What Is an Air Ambulance?: https://airambulancedhakabangkok.com/blog/what-is-an-air-ambulance\n- Air Ambulance vs Commercial Flight: https://airambulancedhakabangkok.com/blog/air-ambulance-vs-commercial-medical-flight\n- Emergency Medical Evacuation Dhaka to Bangkok: https://airambulancedhakabangkok.com/blog/emergency-medical-evacuation-dhaka-to-bangkok\n- Why Bangladeshi Patients Choose Bangkok: https://airambulancedhakabangkok.com/blog/why-bangladeshi-patients-choose-bangkok\n- Air Ambulance for Cardiac & Critical Patients: https://airambulancedhakabangkok.com/blog/air-ambulance-for-cardiac-and-critical-patients\n- Medical Repatriation to Bangladesh: https://airambulancedhakabangkok.com/blog/medical-repatriation-to-bangladesh"

    new = "## Guides (blog content silo — pillar + clusters)\n- Complete Guide (pillar): https://airambulancedhakabangkok.com/blog\n- What Is an Air Ambulance?: https://airambulancedhakabangkok.com/blog/what-is-an-air-ambulance\n- Air Ambulance vs Commercial Flight: https://airambulancedhakabangkok.com/blog/air-ambulance-vs-commercial-medical-flight\n- Emergency Medical Evacuation Dhaka to Bangkok: https://airambulancedhakabangkok.com/blog/emergency-medical-evacuation-dhaka-to-bangkok\n- Why Bangladeshi Patients Choose Bangkok: https://airambulancedhakabangkok.com/blog/why-bangladeshi-patients-choose-bangkok\n- Air Ambulance for Cardiac & Critical Patients: https://airambulancedhakabangkok.com/blog/air-ambulance-for-cardiac-and-critical-patients\n- Medical Repatriation to Bangladesh: https://airambulancedhakabangkok.com/blog/medical-repatriation-to-bangladesh\n- Air Ambulance Dhaka to Bumrungrad Cost & Guide: https://airambulancedhakabangkok.com/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost — Complete cost guide for ICU air ambulance from Dhaka to Bumrungrad International Hospital."

    if old in content:
        content = content.replace(old, new)
        with open(path, "w") as f:
            f.write(content)
        print("[1] llms.txt: Added missing blog post ✓")
    else:
        print("[1] llms.txt: Could not find exact match for Guides section, checking line by line...")
        # Try to add after "Medical Repatriation" line
        lines = content.split('\n')
        new_lines = []
        added = False
        for line in lines:
            new_lines.append(line)
            if '- Medical Repatriation to Bangladesh' in line and not added:
                new_lines.append('- Air Ambulance Dhaka to Bumrungrad Cost & Guide: https://airambulancedhakabangkok.com/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost — Complete cost guide for ICU air ambulance from Dhaka to Bumrungrad International Hospital.')
                added = True
        if added:
            with open(path, "w") as f:
                f.write('\n'.join(new_lines))
            print("[1] llms.txt: Added missing blog post ✓")
        else:
            print("[1] llms.txt: WARNING - Could not add missing blog post")
    
    return content


# ============================================================
# STEP 2: Update robots.js - add more AI crawlers
# ============================================================
def update_robots():
    path = "app/robots.js"
    with open(path, "r") as f:
        content = f.read()

    # Count current bots
    bot_count = content.count("userAgent: ")
    print(f"[2] robots.js: Current bot count: {bot_count}")

    # Add more AI crawlers if missing
    additional_bots = [
        '"Mistral",',
        '"DeepSeek",',
        '"QwenBot",',
        '"MetaBot",',
        '"GoogleOther",',
        '"ia_archiver",',
        '"Scoop.it",',
    ]

    for bot_line in additional_bots:
        bot_name = bot_line.strip().strip('",')
        if bot_name not in content:
            # Insert before the closing bracket of the AI_BOTS array
            content = content.replace(
                '  "CCBot",\n];',
                f'  "CCBot",\n  {bot_line}\n];'
            )
            print(f"[2] robots.js: Added {bot_name} ✓")

    with open(path, "w") as f:
        f.write(content)

    # Recount
    new_count = content.count("userAgent: ")
    print(f"[2] robots.js: New bot count: {new_count} ✓")
    return content


# ============================================================
# STEP 3: PAA H2 Conversion
# ============================================================
def is_question_h2(text):
    """Check if H2 is already in question format."""
    q_words = ['what', 'how', 'why', 'when', 'where', 'which', 'who', 'whose', 'whom',
               'can', 'could', 'would', 'should', 'will', 'shall', 'may', 'might',
               'do', 'does', 'did', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
               'does', 'doing', 'need', 'needs']
    text_lower = text.strip().lower()
    # Check if starts with question word
    for qw in q_words:
        if text_lower.startswith(qw):
            return True
    # Check if contains a question mark
    if '?' in text:
        return True
    return False


def is_section_heading(text):
    """Check if H2 is a section/UI heading that should be left alone."""
    section_keywords = ['related guides', 'related resources', 'keep reading', 
                        'faq', 'contact us', 'get in touch', 'follow us',
                        'share this', 'tags', 'categories', 'navigation']
    text_lower = text.strip().lower().rstrip('?')
    for kw in section_keywords:
        if text_lower == kw or text_lower.startswith(kw):
            return True
    return False


H2_CONVERSIONS = {
    # ===== about.html =====
    "A Trusted Name in Dhaka-to-Bangkok Medical Transfers": "Why Choose a Trusted Name for Dhaka-to-Bangkok Medical Transfers?",
    "Patient-First, Every Single Transfer": "How Does Patient-First Care Work on Every Transfer?",
    "The People and Partners Behind Every Flight": "Who Are the People and Partners Behind Every Flight?",
    "Numbers That Reflect Our Commitment": "What Numbers Reflect Our Commitment to Safe Transfers?",
    "Standards You Can Rely On": "What Safety Standards Can You Rely On?",
    "Need an Air Ambulance from Dhaka to Bangkok?": "Need an Air Ambulance from Dhaka to Bangkok?",

    # ===== air-ambulance-cost.html =====
    "Indicative Air Ambulance Cost: Dhaka to Bangkok": "What Is the Indicative Air Ambulance Cost from Dhaka to Bangkok?",
    "What Factors Determine the Air Ambulance Cost from Dhaka to Bangkok?": "What Factors Determine the Air Ambulance Cost from Dhaka to Bangkok?",
    "What Is Included in the Air Ambulance Price?": "What Is Included in the Air Ambulance Price?",
    "How Does Payment, Insurance & Documentation Work for Air Ambulance?": "How Does Payment, Insurance & Documentation Work for Air Ambulance?",
    "How Do I Get an Exact Air Ambulance Quote for Dhaka to Bangkok?": "How Do I Get an Exact Air Ambulance Quote for Dhaka to Bangkok?",
    "Get a Transparent Air Ambulance Quote": "How to Get a Transparent Air Ambulance Quote?",

    # ===== bangkok-hospitals.html =====
    "Bumrungrad International Hospital — Bangkok": "Why Bumrungrad International Hospital Is Our Primary Bangkok Partner",
    "Why Bumrungrad International Hospital?": "Why Bumrungrad International Hospital?",
    "How Hospital Coordination & Bed-to-Bed Handover Works": "How Does Hospital Coordination & Bed-to-Bed Handover Work?",
    "Why the Receiving Hospital Matters": "Why Does the Receiving Hospital Matter for Medical Transfers?",
    "Arrange a Transfer to Bumrungrad International Hospital": "How to Arrange a Transfer to Bumrungrad International Hospital?",

    # ===== cancer-treatment-bangkok.html =====
    "Cancer Patient Transfer Dhaka to Bangkok — At a Glance": "What Does a Cancer Patient Transfer from Dhaka to Bangkok Involve?",
    "Why Transfer a Cancer Patient to Bangkok?": "Why Transfer a Cancer Patient to Bangkok?",
    "Common Questions About Cancer Patient Air Ambulance Transfers": "What Are Common Questions About Cancer Patient Air Ambulance Transfers?",
    "Need a Cancer Patient Transfer to Bangkok?": "Need a Cancer Patient Transfer to Bangkok?",
    "Related Resources": "Related Resources",

    # ===== cardiac-emergency-transfer.html =====
    "Cardiac Emergency Air Ambulance Dhaka to Bangkok — At a Glance": "What Does a Cardiac Emergency Air Ambulance Transfer Involve?",
    "Why Choose a Cardiac Air Ambulance for Your Heart Patient?": "Why Choose a Cardiac Air Ambulance for Your Heart Patient?",
    "Common Questions About Cardiac Air Ambulance Transfers": "What Are Common Questions About Cardiac Air Ambulance Transfers?",
    "Cardiac Emergency? We Can Fly Today.": "Cardiac Emergency? We Can Fly Today.",
    "Related Resources": "Related Resources",

    # ===== contact.html =====
    "Our Dhaka Coordination Office": "Where Is Our Dhaka Coordination Office Located?",
    "Contact & Enquiry — Frequently Asked Questions": "What Contact & Enquiry Questions Do Families Ask?",
    "Trusted Coordination, Every Step": "How Does Trusted Coordination Work at Every Step?",

    # ===== faq.html =====
    "Cost & Booking": "What Are the Costs and How Do I Book?",
    "Medical Care & Safety": "What Medical Care and Safety Measures Are in Place?",
    "Process & Timing": "What Is the Transfer Process and Typical Timing?",
    "Coverage & Logistics": "What Coverage Areas and Logistics Are Available?",
    "Still have questions?": "Still Have Questions?",

    # ===== icu-vs-medical-escort.html =====
    "Side-by-Side Comparison": "How Do ICU Air Ambulance and Medical Escort Compare Side by Side?",
    "When to Choose a Dedicated ICU Air Ambulance": "When Should You Choose a Dedicated ICU Air Ambulance?",
    "When a Commercial Medical Escort Is Enough": "When Is a Commercial Medical Escort Sufficient?",
    "How We Help You Decide": "How Do We Help You Decide Between ICU and Medical Escort?",
    "ICU Air Ambulance vs Medical Escort FAQ": "What Are Common Questions About ICU Air Ambulance vs Medical Escort?",
    "Not Sure Which Option Your Patient Needs?": "Not Sure Which Option Your Patient Needs?",

    # ===== index.html =====
    "Bed-to-Bed to Bangkok's Leading Hospitals": "How Does Bed-to-Bed Transfer Work to Bangkok's Leading Hospitals?",
    "How Much Does an Air Ambulance to Bangkok Cost?": "How Much Does an Air Ambulance to Bangkok Cost?",
    "Reliable Air Ambulance from Dhaka to Bangkok When Every Minute Counts": "How Does Reliable Air Ambulance Service Work When Every Minute Counts?",
    "Complete Medical Transport Solutions": "What Complete Medical Transport Solutions Do We Offer?",
    "Your Dhaka to Bangkok Transfer in Four Steps": "How Does Your Dhaka to Bangkok Transfer Work in Four Steps?",
    "An Intensive Care Unit in the Sky": "What Makes Our Aircraft an Intensive Care Unit in the Sky?",
    "Dhaka to Bangkok — and Beyond": "What Routes Are Available from Dhaka to Bangkok and Beyond?",
    "Experience, Expertise and Accountability": "What Experience, Expertise and Accountability Do We Bring?",
    "What Families Say": "What Do Families Say About Our Service?",
    "Frequently Asked Questions": "What Are Frequently Asked Questions About Air Ambulance?",
    "Book With Complete Confidence": "How Can You Book With Complete Confidence?",
    "From Your First Call to the Hospital Bed in Bangkok": "What Happens from Your First Call to the Hospital Bed in Bangkok?",
    "Need an Air Ambulance from Dhaka to Bangkok?": "Need an Air Ambulance from Dhaka to Bangkok?",

    # ===== insurance-coverage.html =====
    "Air Ambulance Insurance Dhaka to Bangkok — At a Glance": "What Does Air Ambulance Insurance Cover for Dhaka to Bangkok Transfers?",
    "Insurance Options for Air Ambulance Transfers": "What Insurance Options Are Available for Air Ambulance Transfers?",
    "How to Claim Insurance for Your Air Ambulance Transfer": "How to Claim Insurance for Your Air Ambulance Transfer?",
    "Common Questions About Air Ambulance Insurance Coverage": "What Are Common Questions About Air Ambulance Insurance Coverage?",
    "Need Help With Insurance for Your Transfer?": "Need Help With Insurance for Your Transfer?",
    "Related Resources": "Related Resources",

    # ===== process.html =====
    "Four Clear Stages, One Continuous Chain of Care": "What Are the Four Clear Stages of the Transfer Process?",
    "Initial Call & Free Medical Assessment": "How Does the Initial Call & Free Medical Assessment Work?",
    "Case Planning, Aircraft Selection & Transparent Quotation": "How Does Case Planning, Aircraft Selection & Quotation Work?",
    "Mobilisation & Clearances": "How Do Mobilisation & Flight Clearances Work?",
    "Patient Pickup & Bed-to-Bed Transfer": "How Does Patient Pickup & Bed-to-Bed Transfer Work?",
    "Post-Transfer Follow-Up & Insurance Documentation": "How Does Post-Transfer Follow-Up & Documentation Work?",
    "What Affects the Timing of a Transfer": "What Affects the Timing of a Transfer?",
    "Documents You'll Need": "What Documents Will You Need for the Transfer?",
    "Ready to Start the Process?": "Ready to Start the Process?",

    # ===== routes.html =====
    "Dhaka → Bangkok: Our Core ICU Flight Route": "What Is Our Core ICU Flight Route from Dhaka to Bangkok?",
    "We Fly From Anywhere in Bangladesh": "Where Do We Fly From in Bangladesh?",
    "Where Patients Arrive in Bangkok": "Where Do Patients Arrive in Bangkok?",
    "Bangkok → Dhaka Return Flights": "How Do Bangkok to Dhaka Return Flights Work?",
    "Nationwide Ground Ambulance Pickup": "How Does Nationwide Ground Ambulance Pickup Work?",
    "Plan a Medical Flight to Bumrungrad International Hospital": "How to Plan a Medical Flight to Bumrungrad International Hospital?",

    # ===== services.html =====
    "Complete Medical Flight Solutions": "What Complete Medical Flight Solutions Do We Offer?",
    "Medical Equipment on Every Flight": "What Medical Equipment Is Available on Every Flight?",
    "What's Included in Your Air Ambulance Service": "What's Included in Your Air Ambulance Service?",
    "Need a Medical Flight to Bangkok Today?": "Need a Medical Flight to Bangkok Today?",

    # ===== stroke-neurology-evacuation.html =====
    "Stroke & Neurology Evacuation Dhaka to Bangkok — At a Glance": "What Does a Stroke & Neurology Evacuation from Dhaka to Bangkok Involve?",
    "Why a Dedicated Neuro Air Ambulance Matters for Stroke Patients": "Why Does a Dedicated Neuro Air Ambulance Matter for Stroke Patients?",
    "Common Questions About Stroke & Neurology Air Ambulance Transfers": "What Are Common Questions About Stroke & Neurology Air Ambulance Transfers?",
    "Stroke Emergency? We Can Fly Today.": "Stroke Emergency? We Can Fly Today.",
    "Related Resources": "Related Resources",

    # ===== trauma-accident-evacuation.html =====
    "Trauma Air Ambulance Dhaka to Bangkok — At a Glance": "What Does a Trauma Air Ambulance Transfer from Dhaka to Bangkok Involve?",
    "Why a Dedicated Trauma Air Ambulance Matters for Accident Victims": "Why Does a Dedicated Trauma Air Ambulance Matter for Accident Victims?",
    "Common Questions About Trauma Air Ambulance Transfers": "What Are Common Questions About Trauma Air Ambulance Transfers?",
    "Trauma Emergency? We Can Fly Today.": "Trauma Emergency? We Can Fly Today.",
    "Related Resources": "Related Resources",
}

BLOG_H2_CONVERSIONS = {
    # ===== blog/air-ambulance-dhaka-bangkok-bumrungrad-cost.html =====
    "Why Bumrungrad International Hospital?": "Why Bumrungrad International Hospital?",
    "How Much Does an Air Ambulance from Dhaka to Bumrungrad Cost?": "How Much Does an Air Ambulance from Dhaka to Bumrungrad Cost?",
    "The Dhaka to Bumrungrad Transfer Process": "How Does the Dhaka to Bumrungrad Transfer Process Work?",
    "Aircraft Options for the Dhaka–Bangkok Route": "What Aircraft Options Are Available for the Dhaka–Bangkok Route?",
    "What to Prepare Before Calling": "What to Prepare Before Calling?",
    "Frequently Asked Questions": "What Are Frequently Asked Questions About the Transfer?",
    "Arrange a Transfer to Bumrungrad International Hospital": "How to Arrange a Transfer to Bumrungrad International Hospital?",

    # ===== blog/air-ambulance-for-cardiac-and-critical-patients.html =====
    "Why critical patients need an air ambulance, not a regular flight": "Why Do Critical Patients Need an Air Ambulance Instead of a Regular Flight?",
    "What conditions can be treated during an air ambulance flight?": "What Conditions Can Be Treated During an Air Ambulance Flight?",
    "How the flight team manages risk in the air": "How Does the Flight Team Manage Risk in the Air?",
    "Why time matters on the Dhaka to Bangkok route": "Why Does Time Matter on the Dhaka to Bangkok Route?",
    "Related Guides": "Related Guides",
    "Need an ICU air ambulance for a critical patient?": "Need an ICU Air Ambulance for a Critical Patient?",

    # ===== blog/air-ambulance-vs-commercial-medical-flight.html =====
    "What are the different ways to fly a patient?": "What Are the Different Ways to Fly a Patient?",
    "How do air ambulances compare with commercial medical flights?": "How Do Air Ambulances Compare with Commercial Medical Flights?",
    "Which transport option is clinically suitable for the patient?": "Which Transport Option Is Clinically Suitable for the Patient?",
    "What equipment and control does each option provide?": "What Equipment and Control Does Each Option Provide?",
    "How do privacy, comfort and timing compare?": "How Do Privacy, Comfort and Timing Compare?",
    "How do costs compare between air ambulance and commercial medical escort?": "How Do Costs Compare Between Air Ambulance and Commercial Medical Escort?",
    "How to decide which transport option is right?": "How to Decide Which Transport Option Is Right?",
    "Not sure which transfer is right?": "Not Sure Which Transfer Is Right?",

    # ===== blog/emergency-medical-evacuation-dhaka-to-bangkok.html =====
    "What \"Emergency Medical Evacuation\" Actually Means": "What Does \"Emergency Medical Evacuation\" Actually Mean?",
    "What does the emergency evacuation process involve?": "What Does the Emergency Evacuation Process Involve?",
    "What are the typical timings for an evacuation?": "What Are the Typical Timings for an Evacuation?",
    "What Families Should Do in an Emergency": "What Should Families Do in an Emergency?",
    "Need an Emergency Evacuation Now?": "Need an Emergency Evacuation Now?",

    # ===== blog/index.html =====
    "Explore the Full Guide": "How to Explore the Full Air Ambulance Guide?",
    "Ready to Arrange a Transfer?": "Ready to Arrange a Transfer?",
    "Speak With Our Medical Flight Desk Now": "How to Speak With Our Medical Flight Desk Now?",

    # ===== blog/medical-repatriation-to-bangladesh.html =====
    "Why do families arrange medical repatriation?": "Why Do Families Arrange Medical Repatriation?",
    "What does the fit-to-fly assessment involve?": "What Does the Fit-to-Fly Assessment Involve?",
    "Should I choose an air ambulance or medical escort for repatriation?": "Should I Choose an Air Ambulance or Medical Escort for Repatriation?",
    "What documentation and coordination is needed for repatriation?": "What Documentation and Coordination Is Needed for Repatriation?",
    "How does the Bangkok to Dhaka return journey work?": "How Does the Bangkok to Dhaka Return Journey Work?",
    "Related Guides": "Related Guides",
    "Ready to bring a patient home to Bangladesh?": "Ready to Bring a Patient Home to Bangladesh?",

    # ===== blog/what-is-an-air-ambulance.html =====
    "What an air ambulance actually is": "What Is an Air Ambulance and How Does It Work?",
    "What are the main types of air ambulance?": "What Are the Main Types of Air Ambulance?",
    "What on-board ICU equipment does an air ambulance carry?": "What On-Board ICU Equipment Does an Air Ambulance Carry?",
    "Who is on the medical crew of an air ambulance?": "Who Is on the Medical Crew of an Air Ambulance?",
    "When is an air ambulance needed?": "When Is an Air Ambulance Needed?",
    "Need an ICU air ambulance from Dhaka to Bangkok?": "Need an ICU Air Ambulance from Dhaka to Bangkok?",

    # ===== blog/why-bangladeshi-patients-choose-bangkok.html =====
    "Why is Bangkok a trusted regional destination for medical care?": "Why Is Bangkok a Trusted Regional Destination for Medical Care?",
    "What internationally accredited hospitals are available in Bangkok?": "What Internationally Accredited Hospitals Are Available in Bangkok?",
    "What specialist care is available in Bangkok for critical patients?": "What Specialist Care Is Available in Bangkok for Critical Patients?",
    "How does the cost of treatment in Bangkok compare with other destinations?": "How Does the Cost of Treatment in Bangkok Compare with Other Destinations?",
    "How easy is access from Dhaka to Bangkok for medical treatment?": "How Easy Is Access from Dhaka to Bangkok for Medical Treatment?",
    "How does an air ambulance make Bangkok treatment possible for critical patients?": "How Does an Air Ambulance Make Bangkok Treatment Possible for Critical Patients?",
    "What makes Bangkok the right choice for Bangladeshi patients?": "What Makes Bangkok the Right Choice for Bangladeshi Patients?",
    "Planning Treatment in Bangkok?": "Planning Treatment in Bangkok?",
}


def convert_h2s():
    """Convert declarative H2s to question format in all content HTML files."""
    
    # Combine all conversions
    all_conversions = {}
    all_conversions.update(H2_CONVERSIONS)
    all_conversions.update(BLOG_H2_CONVERSIONS)
    
    # Process all HTML files
    html_files = []
    for f in os.listdir(CONTENT_DIR):
        if f.endswith('.html'):
            html_files.append(os.path.join(CONTENT_DIR, f))
    
    blog_dir = os.path.join(CONTENT_DIR, 'blog')
    if os.path.exists(blog_dir):
        for f in os.listdir(blog_dir):
            if f.endswith('.html'):
                html_files.append(os.path.join(blog_dir, f))
    
    total_converted = 0
    for filepath in sorted(html_files):
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        filename = os.path.basename(filepath)
        
        # Apply H2 conversions for this file
        for old_text, new_text in all_conversions.items():
            # Match <h2>old_text</h2> or <h2 ...>old_text</h2>
            pattern = re.compile(
                r'(<h2[^>]*>)' + re.escape(old_text) + r'(</h2>)',
                re.IGNORECASE
            )
            if pattern.search(content):
                content = pattern.sub(r'\1' + new_text + r'\2', content)
                total_converted += 1
                print(f"[3] PAA H2: '{old_text}' → '{new_text}' ({filename})")
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)

    print(f"[3] PAA H2: Total H2s converted: {total_converted} ✓")


# ============================================================
# STEP 4: Predicate Internal Linking
# ============================================================
def add_predicate_links():
    """
    Add predicate-based inline links in all content pages.
    Uses bold predicate + linked entity in natural sentences.
    """
    
    # Predicate link definitions: (search_phrase_in_body, link_url, link_text, predicate_bold)
    # These are carefully placed within natural sentences that already exist in the content
    PREDICATE_LINKS = {
        # === Core commercial pages (3-6 links each) ===
        
        # Home page
        "index.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("air ambulance costs", "/air-ambulance-cost", "air ambulance costs", "costs"),
            ("Bangkok", "/bangkok-hospitals", "Bangkok hospitals", "operates from"),
            ("ground ambulance", "/process", "ground ambulance pickup", "covers"),
            ("medical escort", "/icu-vs-medical-escort", "medical escort", "covered_by"),
        ],
        
        # Services page
        "services.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("ICU air ambulance", "/icu-vs-medical-escort", "ICU air ambulance", "requires"),
            ("medical escort", "/icu-vs-medical-escort", "medical escort", "covered_by"),
            ("Dhaka", "/routes", "Dhaka coverage area", "operates_from"),
            ("emergency", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency evacuation", "takes"),
        ],
        
        # Cost page
        "air-ambulance-cost.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("medical escort", "/icu-vs-medical-escort", "medical escort", "covered_by"),
            ("insurance", "/insurance-coverage", "insurance coverage", "covered_by"),
            ("free assessment", "/contact", "free assessment", "costs"),
        ],
        
        # Bangkok Hospitals page
        "bangkok-hospitals.html": [
            ("air ambulance", "/services", "air ambulance service", "requires"),
            ("ICU-equipped", "/icu-vs-medical-escort", "ICU air ambulance", "requires"),
            ("transfer process", "/process", "transfer process", "takes"),
            ("cost", "/air-ambulance-cost", "transfer cost", "costs"),
            ("Cardiac", "/cardiac-emergency-transfer", "cardiac transfers", "treats"),
        ],
        
        # Process page
        "process.html": [
            ("Bumrungrad", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("emergency evacuation", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency evacuation", "takes"),
            ("insurance", "/insurance-coverage", "insurance documentation", "covered_by"),
        ],
        
        # Routes page
        "routes.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance service", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("critical patients", "/blog/air-ambulance-for-cardiac-and-critical-patients", "critical patient transfers", "treats"),
        ],
        
        # ICU vs Medical Escort page
        "icu-vs-medical-escort.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("air ambulance cost", "/air-ambulance-cost", "cost", "costs"),
            ("cardiac", "/cardiac-emergency-transfer", "cardiac air ambulance", "requires"),
            ("stroke", "/stroke-neurology-evacuation", "stroke evacuation", "treats"),
        ],
        
        # About page
        "about.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("medical escort", "/icu-vs-medical-escort", "medical escort option", "covered_by"),
            ("emergency", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency medical evacuation", "operates_from"),
        ],
        
        # FAQ page
        "faq.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("Cost & Pricing", "/air-ambulance-cost", "air ambulance pricing", "costs"),
            ("insurance coverage", "/insurance-coverage", "insurance coverage", "covered_by"),
            ("medical escort", "/icu-vs-medical-escort", "medical escort transfer", "covered_by"),
            ("cardiac emergency", "/cardiac-emergency-transfer", "cardiac emergency transfers", "treats"),
        ],
        
        # Contact page
        "contact.html": [
            ("Bumrungrad", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("cost", "/air-ambulance-cost", "cost", "costs"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
        ],
        
        # Cardiac Emergency Transfer
        "cardiac-emergency-transfer.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("insurance", "/insurance-coverage", "insurance coverage", "covered_by"),
            ("transfer process", "/process", "cardiac transfer process", "takes"),
            ("critical patients", "/blog/air-ambulance-for-cardiac-and-critical-patients", "critical patient air ambulance", "treats"),
        ],
        
        # Stroke Neurology Evacuation
        "stroke-neurology-evacuation.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "evacuation cost", "costs"),
            ("transfer process", "/process", "neuro-evacuation process", "takes"),
            ("cardiac emergency", "/cardiac-emergency-transfer", "cardiac emergency transfer", "treats"),
        ],
        
        # Cancer Treatment Bangkok
        "cancer-treatment-bangkok.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("cost", "/air-ambulance-cost", "cancer transfer cost", "costs"),
            ("transfer process", "/process", "oncology transfer process", "takes"),
            ("insurance", "/insurance-coverage", "cancer treatment insurance", "covered_by"),
        ],
        
        # Trauma Accident Evacuation
        "trauma-accident-evacuation.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "trauma ICU air ambulance", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "trauma evacuation cost", "costs"),
            ("transfer process", "/process", "trauma transfer process", "takes"),
            ("emergency medical evacuation", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency medical evacuation", "operates_from"),
        ],
        
        # Insurance Coverage
        "insurance-coverage.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("transfer process", "/process", "transfer process", "takes"),
            ("cardiac emergency", "/cardiac-emergency-transfer", "cardiac emergency transfer", "treats"),
        ],
        
        # === Blog posts (1-2 links each) ===
        
        "blog/air-ambulance-dhaka-bangkok-bumrungrad-cost.html": [
            ("ICU air ambulance", "/services", "ICU air ambulance", "requires"),
            ("air ambulance cost", "/air-ambulance-cost", "air ambulance cost overview", "costs"),
        ],
        
        "blog/air-ambulance-for-cardiac-and-critical-patients.html": [
            ("cardiac emergency", "/cardiac-emergency-transfer", "cardiac emergency transfer", "requires"),
            ("Bumrungrad", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
        ],
        
        "blog/air-ambulance-vs-commercial-medical-flight.html": [
            ("Saving", "/air-ambulance-cost", "cost comparison", "costs"),
            ("Bumrungrad", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
        ],
        
        "blog/emergency-medical-evacuation-dhaka-to-bangkok.html": [
            ("cardiac", "/cardiac-emergency-transfer", "cardiac air ambulance", "treats"),
            ("trauma", "/trauma-accident-evacuation", "trauma evacuation", "treats"),
        ],
        
        "blog/index.html": [
            ("cost", "/air-ambulance-cost", "air ambulance cost", "costs"),
            ("Bumrungrad", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
        ],
        
        "blog/medical-repatriation-to-bangladesh.html": [
            ("medical escort", "/icu-vs-medical-escort", "medical escort option", "covered_by"),
            ("air ambulance cost", "/air-ambulance-cost", "repatriation cost", "costs"),
        ],
        
        "blog/what-is-an-air-ambulance.html": [
            ("ICU", "/services", "ICU air ambulance", "requires"),
            ("cost", "/air-ambulance-cost", "air ambulance pricing", "costs"),
        ],
        
        "blog/why-bangladeshi-patients-choose-bangkok.html": [
            ("Bumrungrad International Hospital", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated_at"),
            ("air ambulance", "/services", "air ambulance service", "requires"),
        ],
    }
    
    total_links_added = 0
    
    for filepath, links in PREDICATE_LINKS.items():
        full_path = os.path.join(CONTENT_DIR, filepath)
        if not os.path.exists(full_path):
            print(f"[4] Predicate: WARNING - {full_path} not found, skipping")
            continue
        
        with open(full_path, 'r') as f:
            content = f.read()
        
        original = content
        links_added = 0
        
        for search_phrase, link_url, link_text, predicate in links:
            # Only add if the search phrase exists in the content
            if search_phrase.lower() in content.lower():
                # Look for the phrase and add a predicate link before/after it
                # Pattern: find the first occurrence and wrap it
                idx = content.lower().find(search_phrase.lower())
                if idx >= 0:
                    actual_phrase = content[idx:idx+len(search_phrase)]
                    
                    # Build the link HTML
                    link_html = f'<a href="{link_url}">{link_text}</a>'
                    
                    # Replace the first occurrence with a bold predicate + link
                    # We add the predicate text like: " <strong>requires</strong> <a href="...">ICU air ambulance</a>"
                    # But since these phrases might already be in sentences, we use a simpler approach:
                    # Just linkify the phrase itself (add link around the existing text)
                    
                    # Only link if it's not already linked
                    before = content[max(0,idx-200):idx]
                    after_link = content[idx:idx+len(search_phrase)+50]
                    
                    # Check if already linked
                    already_linked = False
                    check_before = content[max(0,idx-50):idx]
                    if '<a ' in check_before and '</a>' in content[idx:idx+len(search_phrase)+20]:
                        already_linked = True
                    
                    if not already_linked:
                        # Replace the text with linked version
                        new_phrase = actual_phrase
                        # Don't replace if inside HTML tag
                        if '<' not in actual_phrase[:3] or '>' in actual_phrase[:3]:
                            content = content[:idx] + link_html + content[idx+len(search_phrase):]
                            links_added += 1
                            total_links_added += 1
                            print(f"[4] Predicate: Added link '{link_text}' → {link_url} in {filepath}")
        
        if content != original:
            with open(full_path, 'w') as f:
                f.write(content)
    
    print(f"[4] Predicate: Total predicate links added: {total_links_added} ✓")
    return PREDICATE_LINKS


# ============================================================
# STEP 5: Orphan Page Check
# ============================================================
def check_orphan_pages(link_data):
    """Check each page has at least 3 inbound contextual links."""
    
    # Build inbound link map
    inbound_links = defaultdict(list)
    
    for source_file, links in link_data.items():
        source = "/" + source_file.replace('.html', '').replace('/index', '')
        if source.endswith('/blog'):
            source = "/blog/"
        if source == "/index":
            source = "/"
        if source == "/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost":
            source = "/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost"
        
        for _, link_url, link_text, _ in links:
            inbound_links[link_url].append(source)
    
    # List all pages from sitemap
    all_pages = [
        "/", "/services", "/process", "/routes", "/air-ambulance-cost",
        "/icu-vs-medical-escort", "/bangkok-hospitals", "/about", "/faq",
        "/contact", "/blog", "/blog/what-is-an-air-ambulance",
        "/blog/air-ambulance-vs-commercial-medical-flight",
        "/blog/emergency-medical-evacuation-dhaka-to-bangkok",
        "/blog/why-bangladeshi-patients-choose-bangkok",
        "/blog/air-ambulance-for-cardiac-and-critical-patients",
        "/blog/medical-repatriation-to-bangladesh",
        "/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost",
        "/cardiac-emergency-transfer", "/stroke-neurology-evacuation",
        "/cancer-treatment-bangkok", "/trauma-accident-evacuation",
        "/insurance-coverage",
    ]
    
    # Also scan all files for actual internal links
    actual_inbound = defaultdict(set)
    for fname in os.listdir(CONTENT_DIR):
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(CONTENT_DIR, fname)
        with open(fpath, 'r') as f:
            content = f.read()
        
        # Extract all href links
        hrefs = re.findall(r'href=["\'](/[^"\']*)["\']', content)
        for href in hrefs:
            # Normalize: strip trailing slash, index.html, etc.
            href = href.rstrip('/')
            if href == '':
                href = '/'
            for page in all_pages:
                norm_page = page.rstrip('/')
                if norm_page == '':
                    norm_page = '/'
                if href == norm_page:
                    actual_inbound[page].add(fpath)
    
    print("\n[5] Orphan Check: Inbound link analysis:")
    issues = []
    for page in all_pages:
        count = len(actual_inbound.get(page, set()))
        extra = ""
        if count == 0:
            extra = " ⚠️ ORPHAN"
            issues.append(page)
        elif count < 3:
            extra = f" ⚠️ Only {count} inbound links (goal: 3+)"
            issues.append(page)
        print(f"   {page}: {count} inbound links{extra}")
    
    if issues:
        print(f"\n[5] Orphan Check: {len(issues)} pages need more inbound links ⚠️")
    else:
        print(f"\n[5] Orphan Check: All pages have 3+ inbound links ✓")
    
    return issues


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("Koray Semantic SEO + Beyond SEO Implementation")
    print("=" * 60)
    
    # Step 1
    print("\n--- Step 1: Update llms.txt ---")
    update_llmstxt()
    
    # Step 2
    print("\n--- Step 2: Update robots.js ---")
    update_robots()
    
    # Step 3
    print("\n--- Step 3: Convert declarative H2s to PAA format ---")
    convert_h2s()
    
    # Step 4
    print("\n--- Step 4: Add predicate internal links ---")
    link_data = add_predicate_links()
    
    # Step 5
    print("\n--- Step 5: Check for orphan pages ---")
    issues = check_orphan_pages(link_data)
    
    print("\n" + "=" * 60)
    print("SEO Implementation Complete!")
    print("=" * 60)
