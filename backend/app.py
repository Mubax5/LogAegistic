from datetime import datetime, timezone
from hashlib import sha256
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AegisTrade AI Tribunal Backend",
    version="0.1.0",
    description="FastAPI backend for the AegisTrade AI hackathon MVP. It exposes deterministic tribunal data for a Band-powered multi-agent export compliance workflow.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RiskLevel = Literal["LOW", "MEDIUM", "MEDIUM_HIGH", "HIGH", "CRITICAL", "CLEAR", "HOLD"]
Decision = Literal["GO", "HOLD", "NO-GO"]


class Order(BaseModel):
    order_id: str
    product: str
    quantity: int
    buyer: str
    destination_country: str
    route: list[str]
    declared_use: str
    status: str


class EvidencePacket(BaseModel):
    packet_id: str
    agent: str
    claim: str
    evidence_source: str
    extracted_fact: str
    risk_dimension: str
    risk_level: RiskLevel
    confidence: float
    challenge_status: str
    requires_human_review: bool


class TribunalDecision(BaseModel):
    decision: Decision
    summary: str
    accepted_claims: list[str]
    disputed_claims: list[str]
    unresolved_claims: list[str]
    risk_matrix: dict[str, str]
    cure_pack: list[str]
    requires_human_review: bool


class AgentMessage(BaseModel):
    speaker: str
    role: str
    message: str


ORDER = Order(
    order_id="ORD-2026-OM-019",
    product="Thermal Imaging Sensor Module",
    quantity=1000,
    buyer="Al-Mizan Logistics LLC",
    destination_country="Oman",
    route=["Indonesia", "Singapore", "Oman"],
    declared_use="Industrial warehouse inspection",
    status="PENDING_REVIEW",
)

EVIDENCE_PACKETS = [
    EvidencePacket(
        packet_id="EV-TECH-001",
        agent="Manifest Tech-Deconstructor",
        claim="The product may have dual-use thermal imaging capability.",
        evidence_source="product_manifest.pdf / page 2",
        extracted_fact="Detection range: 5km; thermal sensitivity: <50mK; ruggedized casing.",
        risk_dimension="technical_dual_use",
        risk_level="HIGH",
        confidence=0.84,
        challenge_status="accepted",
        requires_human_review=True,
    ),
    EvidencePacket(
        packet_id="EV-SAN-001",
        agent="Restricted Party & Ownership Bloodhound",
        claim="Buyer is not directly restricted, but ownership structure creates unresolved due-diligence risk.",
        evidence_source="ownership_graph_mock.json",
        extracted_fact="45% ownership by defense-linked affiliate in mock dataset.",
        risk_dimension="ownership",
        risk_level="MEDIUM_HIGH",
        confidence=0.78,
        challenge_status="accepted",
        requires_human_review=True,
    ),
    EvidencePacket(
        packet_id="EV-EVA-001",
        agent="Adversarial Evasion Analyst",
        claim="The transaction shows possible diversion-risk indicators.",
        evidence_source="order_route_and_documents",
        extracted_fact="New buyer, transit hub, generic product description, missing End-User Certificate.",
        risk_dimension="route_documentation",
        risk_level="HIGH",
        confidence=0.81,
        challenge_status="escalated",
        requires_human_review=True,
    ),
]

TRANSCRIPT = [
    AgentMessage(
        speaker="Manifest Tech-Deconstructor",
        role="Technical Hardware Auditor",
        message="I found a 5km detection range and sub-50mK sensitivity. This is not a final classification, but it is a high-confidence technical risk candidate.",
    ),
    AgentMessage(
        speaker="Restricted Party & Ownership Bloodhound",
        role="Sanctions & Ownership Investigator",
        message="Challenge: the buyer is not a direct restricted-party match. However, the ownership graph shows a defense-linked affiliate with 45% ownership. This requires human review.",
    ),
    AgentMessage(
        speaker="Adversarial Evasion Analyst",
        role="Defensive Red-Team Agent",
        message="Additional challenge: the transaction combines a new buyer, neutral transit hub, generic description, and missing End-User Certificate. This should not be released automatically.",
    ),
    AgentMessage(
        speaker="Legal-Arbitrator Judge",
        role="Final Decision Coordinator",
        message="Decision: HOLD. The shipment is not automatically prohibited, but unresolved technical, ownership, route, and documentation risks require human review before release.",
    ),
]

DECISION = TribunalDecision(
    decision="HOLD",
    summary="Shipment is not automatically prohibited, but unresolved technical dual-use risk, ownership concern, route anomaly, and missing end-user documentation require human review.",
    accepted_claims=["EV-TECH-001", "EV-SAN-001", "EV-EVA-001"],
    disputed_claims=[],
    unresolved_claims=["final_end_user_identity", "non_reexport_commitment", "route_justification"],
    risk_matrix={
        "technical_dual_use": "HIGH",
        "direct_list_match": "CLEAR",
        "ownership": "MEDIUM_HIGH",
        "route": "MEDIUM",
        "documentation": "HIGH",
        "final_recommendation": "HOLD",
    },
    cure_pack=[
        "End-User Certificate",
        "Ultimate Beneficial Ownership Declaration",
        "Non-Reexport Attestation",
        "Shipment Route Justification",
        "Product Technical Clarification Letter",
        "Compliance Officer Manual Approval",
    ],
    requires_human_review=True,
)


def audit_hash(event: str, index: int) -> str:
    payload = f"{index}:{event}:ORD-2026-OM-019".encode("utf-8")
    return sha256(payload).hexdigest()[:24]


@app.get("/")
def root() -> dict:
    return {
        "service": "AegisTrade AI Tribunal Backend",
        "status": "ok",
        "docs": "/docs",
        "demo_order": ORDER.order_id,
    }


@app.get("/api/order", response_model=Order)
def get_order() -> Order:
    return ORDER


@app.post("/api/tribunal/start")
def start_tribunal() -> dict:
    return {
        "order_id": ORDER.order_id,
        "room_name": f"Tribunal-{ORDER.order_id}",
        "status": "TRIBUNAL_RUNNING",
        "band_usage": "Band room coordinates agent evidence exchange, cross-examination, and final arbitration.",
        "started_at": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/tribunal/evidence", response_model=list[EvidencePacket])
def get_evidence() -> list[EvidencePacket]:
    return EVIDENCE_PACKETS


@app.get("/api/tribunal/transcript", response_model=list[AgentMessage])
def get_transcript() -> list[AgentMessage]:
    return TRANSCRIPT


@app.get("/api/tribunal/decision", response_model=TribunalDecision)
def get_decision() -> TribunalDecision:
    return DECISION


@app.get("/api/tribunal/audit-trail")
def get_audit_trail() -> list[dict]:
    events = [
        "Order created",
        "Tribunal room initialized",
        "EV-TECH-001 submitted",
        "EV-SAN-001 submitted",
        "EV-EVA-001 submitted",
        "Cross-examination completed",
        "HOLD decision issued",
        "Cure Pack generated",
    ]
    return [
        {
            "index": index + 1,
            "event": event,
            "hash": audit_hash(event, index),
        }
        for index, event in enumerate(events)
    ]


@app.post("/api/human-review/approve")
def human_review_approve() -> dict:
    return {
        "order_id": ORDER.order_id,
        "status": "HUMAN_REVIEW_REQUIRED",
        "message": "MVP keeps this case in human review because Cure Pack documents are not uploaded yet.",
    }
