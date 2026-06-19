from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AegisTrade AI 3-Agent Backend", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ORDER = {
    "order_id": "ORD-2026-OM-019",
    "product": "Thermal Imaging Sensor Module",
    "buyer": "Al-Mizan Logistics LLC",
    "destination_country": "Oman",
    "route": ["Indonesia", "Singapore", "Oman"],
    "declared_use": "Industrial warehouse inspection",
    "status": "PENDING_REVIEW"
}

AGENTS = [
    {"name": "Manifest Tech-Deconstructor", "role": "Technical auditor"},
    {"name": "Geopolitical Bloodhound", "role": "Entity and route investigator"},
    {"name": "Logistics Legal-Arbitrator", "role": "Judge and workflow coordinator"}
]

EVIDENCE = [
    {"packet_id": "EV-TECH-001", "agent": "Manifest Tech-Deconstructor", "risk": "HIGH", "claim": "Technical facts require export review."},
    {"packet_id": "EV-ENTITY-001", "agent": "Geopolitical Bloodhound", "risk": "MEDIUM_HIGH", "claim": "Buyer is not a direct hit, but ownership review is unresolved."},
    {"packet_id": "EV-JUDGE-001", "agent": "Logistics Legal-Arbitrator", "risk": "LOW_DEFENSIBILITY", "claim": "GO is not defensible until missing documents are reviewed."}
]

@app.get("/")
def root():
    return {"service": "AegisTrade AI", "architecture": "3 core agents", "docs": "/docs"}

@app.get("/api/order")
def get_order():
    return ORDER

@app.get("/api/agents")
def get_agents():
    return AGENTS

@app.post("/api/tribunal/start")
def start_tribunal():
    return {"room_name": "Tribunal-ORD-2026-OM-019", "status": "TRIBUNAL_RUNNING", "agent_count": 3, "started_at": datetime.now(timezone.utc).isoformat()}

@app.get("/api/tribunal/evidence")
def get_evidence():
    return EVIDENCE

@app.get("/api/tribunal/decision")
def get_decision():
    return {
        "decision": "HOLD",
        "summary": "Release is not defensible until ownership ambiguity and missing documents are reviewed.",
        "requires_human_review": True,
        "cure_pack": ["End-User Certificate", "Ownership Declaration", "Non-Reexport Attestation", "Route Justification", "Technical Use Clarification", "Compliance Officer Sign-Off"]
    }
