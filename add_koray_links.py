#!/usr/bin/env python3
"""
Phase 2: Fix orphan pages and enhance predicate links using Koray framework
(bold predicate + linked entity in natural sentences)
"""
import re
import os

CONTENT_DIR = "content"

PREDICATE_MAP = {
    "requires": "requires",
    "treated_at": "treated at",
    "costs": "costs approximately",
    "takes": "typically takes",
    "covered_by": "covered by",
    "operates_from": "operates from",
    "manages": "manages",
    "transfers": "transfers",
    "handles": "handles",
}

# Koray-style links: (insert_after_phrase, link_url, link_text, predicate)
# We insert a bold predicate + link after a matching text sentence
ADDITIONAL_LINKS = {
    # === Fix orphans - cancer-treatment-bangkok.html ===
    "cancer-treatment-bangkok.html": [
        ("radiation", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency medical evacuation process", "typically takes"),
        ("Bangkok", "/blog/why-bangladeshi-patients-choose-bangkok", "why Bangladeshi patients choose Bangkok", "details"),
        ("oncology", "/insurance-coverage", "cancer treatment insurance coverage", "covered by"),
        ("chemotherapy", "/process", "patient transfer process", "usually takes"),
        ("cancer treatment", "/blog/air-ambulance-dhaka-bangkok-bumrungrad-cost", "cost of cancer patient transfer", "costs approximately"),
    ],
    
    # === Fix orphans - trauma-accident-evacuation.html ===
    "trauma-accident-evacuation.html": [
        ("polytrauma", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency trauma evacuation process", "typically takes"),
        ("head injury", "/stroke-neurology-evacuation", "neurology emergency transfer", "requires"),
        ("road traffic accident", "/insurance-coverage", "accident insurance coverage", "covered by"),
        ("trauma", "/cardiac-emergency-transfer", "cardiac emergency transfer process", "manages"),
        ("Bangkok", "/blog/why-bangladeshi-patients-choose-bangkok", "why accident victims choose Bangkok", "explains"),
    ],
    
    # === Fix orphans - medical-repatriation-to-bangladesh.html ===
    "blog/medical-repatriation-to-bangladesh.html": [
        ("Bangkok", "/bangkok-hospitals", "Bumrungrad International Hospital", "treated at"),
        ("ICU", "/services", "ICU air ambulance service", "requires"),
        ("critical care", "/blog/air-ambulance-for-cardiac-and-critical-patients", "critical patient air ambulance", "manages"),
        ("air ambulance", "/air-ambulance-cost", "repatriation cost breakdown", "costs approximately"),
        ("medical escort", "/icu-vs-medical-escort", "medical escort vs air ambulance", "compares"),
    ],
    
    # === Fix orphans - air-ambulance-dhaka-bangkok-bumrungrad-cost.html ===
    "blog/air-ambulance-dhaka-bangkok-bumrungrad-cost.html": [
        ("aircraft", "/services", "ICU air ambulance fleet", "requires"),
        ("Bangkok", "/blog/why-bangladeshi-patients-choose-bangkok", "why patients choose Bangkok for treatment", "details"),
        ("transfer process", "/process", "Dhaka to Bangkok transfer process", "typically takes"),
        ("cardiac", "/cardiac-emergency-transfer", "cardiac air ambulance service", "manages"),
        ("insurance", "/insurance-coverage", "medical flight insurance coverage", "covered by"),
    ],
    
    # === Fix low-link pages ===
    
    # what-is-an-air-ambulance.html (needs +1 to reach 3)
    "blog/what-is-an-air-ambulance.html": [
        ("Bangkok", "/blog/why-bangladeshi-patients-choose-bangkok", "why patients choose Bangkok", "explains"),
    ],
    
    # air-ambulance-vs-commercial-medical-flight.html (needs +1)
    "blog/air-ambulance-vs-commercial-medical-flight.html": [
        ("cardiac", "/cardiac-emergency-transfer", "cardiac air ambulance transfer", "requires"),
    ],
    
    # why-bangladeshi-patients-choose-bangkok.html (needs +2)
    "blog/why-bangladeshi-patients-choose-bangkok.html": [
        ("evacuation", "/blog/emergency-medical-evacuation-dhaka-to-bangkok", "emergency medical evacuation process", "typically takes"),
        ("insurance", "/insurance-coverage", "travel medical insurance for treatment abroad", "covered by"),
    ],
    
    # air-ambulance-for-cardiac-and-critical-patients.html (needs +2)
    "blog/air-ambulance-for-cardiac-and-critical-patients.html": [
        ("stroke", "/stroke-neurology-evacuation", "stroke emergency air ambulance", "requires"),
        ("trauma", "/trauma-accident-evacuation", "trauma accident evacuation service", "manages"),
    ],
    
    # cardiac-emergency-transfer.html (needs +1)
    "cardiac-emergency-transfer.html": [
        ("stroke", "/stroke-neurology-evacuation", "neurology emergency transfer for stroke patients", "requires"),
    ],
    
    # stroke-neurology-evacuation.html (needs +2)
    "stroke-neurology-evacuation.html": [
        ("cardiac", "/cardiac-emergency-transfer", "cardiac emergency transfer service", "manages"),
        ("trauma", "/trauma-accident-evacuation", "trauma and accident evacuation", "also handles"),
    ],
}

def add_koray_links():
    """Add bold predicate + linked entity pairs using Koray framework."""
    total_added = 0
    
    for filepath, links in ADDITIONAL_LINKS.items():
        full_path = os.path.join(CONTENT_DIR, filepath)
        if not os.path.exists(full_path):
            print(f"[Koray] WARNING: {full_path} not found!")
            continue
        
        with open(full_path, 'r') as f:
            content = f.read()
        
        original = content
        file_added = 0
        
        for search_phrase, link_url, link_text, predicate in links:
            # Find the search phrase in the content (case-insensitive)
            idx = content.lower().find(search_phrase.lower())
            if idx < 0:
                print(f"[Koray] Could not find '{search_phrase}' in {filepath}")
                continue
            
            # Get the actual text (preserving case)
            actual = content[idx:idx+len(search_phrase)]
            
            # Check if there's already a link nearby (within 100 chars)
            before = content[max(0,idx-100):idx]
            if '<a ' in before:
                # Already has a link before it, try to find another occurrence
                idx2 = content.lower().find(search_phrase.lower(), idx + len(search_phrase))
                if idx2 >= 0:
                    idx = idx2
                    actual = content[idx:idx+len(search_phrase)]
            
            # Build the bold predicate + link HTML
            # Format: <strong>predicate_word</strong> <a href="url">linked_text</a>
            predicate_word = predicate.split()[-1]  # Use last word as bold predicate
            
            koray_link = f' <strong>{predicate_word}</strong> <a href="{link_url}">{link_text}</a>'
            
            # Insert after the found phrase
            insert_pos = idx + len(actual)
            content = content[:insert_pos] + koray_link + content[insert_pos:]
            file_added += 1
            total_added += 1
            print(f"[Koray] Added '{predicate_word}'→{link_text} in {filepath}")
        
        if content != original:
            with open(full_path, 'w') as f:
                f.write(content)
    
    print(f"\n[Koray] Total Koray-style predicate links added: {total_added} ✓")

if __name__ == "__main__":
    print("=" * 60)
    print("Phase 2: Koray Framework Predicate Links & Orphan Fix")
    print("=" * 60)
    add_koray_links()
