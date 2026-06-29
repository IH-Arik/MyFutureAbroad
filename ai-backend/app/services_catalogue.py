"""
MyFutureAbroad partner and affiliate service provider catalogue.
Single source of truth for:
  - The chatbot's SERVICE PROVIDER RECOMMENDATIONS section
  - Valid /partners/{slug} redirect targets
  - Future partner page generation
"""

from typing import TypedDict


class Provider(TypedDict):
    name: str
    description: str
    website: str
    partner_slug: str


class Category(TypedDict):
    category: str
    providers: list[Provider]


SERVICES_CATALOGUE: list[Category] = [
    {
        "category": "Removal & Moving",
        "providers": [
            {
                "name": "Allied Pickfords",
                "description": "One of the world's largest international removal companies. Handles full household moves, vehicle shipping, and storage across 40+ countries.",
                "website": "https://www.alliedpickfords.com",
                "partner_slug": "allied-pickfords",
            },
            {
                "name": "Santa Fe Relocation",
                "description": "Premium global mobility and relocation management company. Offers end-to-end move management, destination services, and immigration support.",
                "website": "https://www.santaferelo.com",
                "partner_slug": "santa-fe-relocation",
            },
        ],
    },
    {
        "category": "Expat Health Insurance",
        "providers": [
            {
                "name": "Cigna Global",
                "description": "Leading international private medical insurance for expats and global citizens. Covers 190+ countries with flexible, modular plans.",
                "website": "https://www.cignaglobal.com",
                "partner_slug": "cigna-global",
            },
        ],
    },
    {
        "category": "Expat Banking",
        "providers": [
            {
                "name": "HSBC Expat",
                "description": "Dedicated international banking for expats. Offers multi-currency accounts, global transfers, and mortgage products for non-resident property buyers.",
                "website": "https://www.expat.hsbc.com",
                "partner_slug": "hsbc-expat",
            },
        ],
    },
    {
        "category": "Currency Transfer",
        "providers": [
            {
                "name": "Currencies Direct",
                "description": "Award-winning international money transfer service. No transfer fees, competitive exchange rates, and personal account managers for regular transfers.",
                "website": "https://www.currenciesdirect.com",
                "partner_slug": "currencies-direct",
            },
        ],
    },
    {
        "category": "VPN",
        "providers": [
            {
                "name": "NordVPN",
                "description": (
                    "Industry-leading VPN essential for expats. Use cases: access home-country streaming services "
                    "(BBC iPlayer, Netflix UK/US) from abroad; secure banking on public Wi-Fi in cafes and "
                    "coworking spaces; bypass internet censorship in restricted countries (UAE, China, etc.); "
                    "protect privacy when using local ISPs."
                ),
                "website": "https://nordvpn.com",
                "partner_slug": "nordvpn",
            },
            {
                "name": "ExpressVPN",
                "description": (
                    "Fast and reliable VPN with servers in 105 countries. "
                    "Excellent for streaming, gaming, and bypassing geo-restrictions. "
                    "30-day money-back guarantee."
                ),
                "website": "https://expressvpn.com",
                "partner_slug": "expressvpn",
            },
        ],
    },
]

# Derived: frozenset of all valid partner slugs — used by the chatbot router
PARTNER_SLUGS: frozenset[str] = frozenset(
    p["partner_slug"]
    for cat in SERVICES_CATALOGUE
    for p in cat["providers"]
)


def build_catalogue_prompt_block() -> str:
    """Formats the catalogue into a numbered list for the chatbot system prompt."""
    lines: list[str] = []
    n = 1
    for cat in SERVICES_CATALOGUE:
        for p in cat["providers"]:
            lines.append(f"{n}. {p['name']}")
            lines.append(f"   - Category: {cat['category']}")
            lines.append(f"   - Description: {p['description']}")
            lines.append(f"   - Website: {p['website']}")
            lines.append(f"   - Partner page on MyFutureAbroad: /partners/{p['partner_slug']}")
            n += 1
    return "\n".join(lines)


def build_partner_redirect_lines() -> str:
    """Returns the partner page redirect entries for the chatbot prompt."""
    lines: list[str] = []
    for cat in SERVICES_CATALOGUE:
        for p in cat["providers"]:
            lines.append(
                f"- `/partners/{p['partner_slug']}` "
                f"(dedicated partner page for {p['name']} — {cat['category']})"
            )
    return "\n".join(lines)
