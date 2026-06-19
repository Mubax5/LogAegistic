import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CheckCircle2, FileWarning, Gavel, Lock, MessageSquareWarning, PackageSearch, ShieldAlert, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import './styles.css';

const agents = [
  ['Manifest Tech-Deconstructor', 'Technical Hardware Auditor', PackageSearch, 'Evidence submitted'],
  ['Restricted Party & Ownership Bloodhound', 'Sanctions & Ownership Investigator', ShieldAlert, 'Ownership risk flagged'],
  ['Adversarial Evasion Analyst', 'Defensive Red-Team Agent', MessageSquareWarning, 'Route anomaly challenged'],
  ['Legal-Arbitrator Judge', 'Final Decision Coordinator', Gavel, 'HOLD issued']
];

const evidence = [
  ['EV-TECH-001', 'Manifest Tech-Deconstructor', 'Possible dual-use thermal imaging capability.', 'product_manifest.pdf / page 2', 'Detection range: 5km; thermal sensitivity: <50mK; ruggedized casing.', 'Technical Dual-Use', 'HIGH', '0.84', 'Accepted'],
  ['EV-SAN-001', 'Restricted Party & Ownership Bloodhound', 'Buyer is not directly restricted, but ownership structure creates unresolved review risk.', 'ownership_graph_mock.json', '45% ownership by defense-linked affiliate in mock dataset.', 'Ownership', 'MEDIUM HIGH', '0.78', 'Accepted'],
  ['EV-EVA-001', 'Adversarial Evasion Analyst', 'Transaction shows possible diversion-risk indicators.', 'order_route_and_documents', 'New buyer, transit hub, generic product description, missing End-User Certificate.', 'Route / Documentation', 'HIGH', '0.81', 'Escalated']
];

const transcript = [
  ['Manifest Tech-Deconstructor', 'I found a 5km detection range and sub-50mK sensitivity. This is not a final classification, but it is a high-confidence technical risk candidate.'],
  ['Restricted Party & Ownership Bloodhound', 'Challenge: the buyer is not a direct restricted-party match. However, the ownership graph shows a defense-linked affiliate with 45% ownership. This requires human review.'],
  ['Adversarial Evasion Analyst', 'Additional challenge: the transaction combines a new buyer, neutral transit hub, generic commercial description, and missing End-User Certificate. This should not be released automatically.'],
  ['Legal-Arbitrator Judge', 'Decision: HOLD. The shipment is not automatically prohibited, but unresolved technical, ownership, route, and documentation risks require human review before release.']
];

const riskMatrix = [
  ['Technical Dual-Use', 'Long-range thermal capability', 'HIGH'],
  ['Direct List Match', 'No direct mock-list hit', 'CLEAR'],
  ['Ownership Risk', 'Defense-linked affiliate concern', 'MEDIUM HIGH'],
  ['Route Risk', 'Indonesia to Singapore to Oman transit', 'MEDIUM'],
  ['Documentation', 'End-User Certificate missing', 'HIGH'],
  ['Final Recommendation', 'Release blocked pending review', 'HOLD']
];

const curePack = ['End-User Certificate', 'Ultimate Beneficial Ownership Declaration', 'Non-Reexport Attestation', 'Shipment Route Justification', 'Product Technical Clarification Letter', 'Compliance Officer Manual Approval'];

function Badge({ children, tone = 'neutral' }) {
  return <span className={'badge ' + tone}>{children}</span>;
}

function Card({ children }) {
  return <section className="card">{children}</section>;
}

function App() {
  const [started, setStarted] = useState(false);
  const auditTrail = ['Order created', 'Tribunal room initialized', 'EV-TECH-001 submitted', 'EV-SAN-001 submitted', 'EV-EVA-001 submitted', 'Cross-examination completed', 'HOLD decision issued', 'Cure Pack generated'];

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Band of Agents Hackathon • Regulated Workflows</p>
          <h1>AegisTrade AI</h1>
          <p className="subtitle">Adversarial multi-agent review room where agents prove, challenge, and defend shipment decisions.</p>
        </div>
        <div className="heroStatus"><Badge tone="danger">HOLD</Badge><p>Human Review Required</p></div>
      </header>

      <section className="grid two">
        <Card>
          <div className="sectionTitle"><Workflow size={20} /><h2>Demo Order</h2></div>
          <div className="orderGrid">
            <span>Order ID</span><strong>ORD-2026-OM-019</strong>
            <span>Product</span><strong>Thermal Imaging Sensor Module</strong>
            <span>Quantity</span><strong>1,000 units</strong>
            <span>Buyer</span><strong>Al-Mizan Logistics LLC</strong>
            <span>Destination</span><strong>Oman</strong>
            <span>Route</span><strong>Indonesia to Singapore to Oman</strong>
            <span>Declared Use</span><strong>Industrial warehouse inspection</strong>
          </div>
          <button className="primaryBtn" onClick={() => setStarted(true)}>{started ? 'Tribunal Running / Evidence Loaded' : 'Start Tribunal'}</button>
        </Card>

        <Card>
          <div className="sectionTitle"><ShieldCheck size={20} /><h2>Final Decision</h2></div>
          <div className="decisionBox"><Lock size={42} /><div><h3>{started ? 'HOLD — Human Review Required' : 'Pending Review'}</h3><p>{started ? 'Shipment is not automatically prohibited, but unresolved technical, ownership, route, and documentation risks require human review.' : 'Click Start Tribunal to run the multi-agent review.'}</p></div></div>
          <p className="note">Demo policy: when uncertainty remains, AegisTrade AI defaults to HOLD, not GO.</p>
        </Card>
      </section>

      <Card>
        <div className="sectionTitle"><UserCheck size={20} /><h2>Band Tribunal Agents</h2></div>
        <div className="agents">{agents.map(([name, role, Icon, state]) => <div className="agent" key={name}><Icon size={28} /><h3>{name}</h3><p>{role}</p><Badge tone={started ? 'ok' : 'neutral'}>{started ? state : 'Waiting'}</Badge></div>)}</div>
      </Card>

      {started && <>
        <section className="grid two">
          <Card><div className="sectionTitle"><MessageSquareWarning size={20} /><h2>Cross-Examination Transcript</h2></div><div className="transcript">{transcript.map(([speaker, message]) => <div className="line" key={speaker}><strong>{speaker}</strong><p>{message}</p></div>)}</div></Card>
          <Card><div className="sectionTitle"><AlertTriangle size={20} /><h2>Decision Matrix</h2></div><table><tbody>{riskMatrix.map(([dimension, finding, status]) => <tr key={dimension}><td>{dimension}</td><td>{finding}</td><td><Badge tone={status === 'CLEAR' ? 'ok' : status === 'HOLD' ? 'danger' : 'warn'}>{status}</Badge></td></tr>)}</tbody></table></Card>
        </section>

        <Card><div className="sectionTitle"><FileWarning size={20} /><h2>Evidence Packet Board</h2></div><div className="evidenceGrid">{evidence.map(([id, agent, claim, source, fact, dimension, risk, confidence, status]) => <article className="evidence" key={id}><div className="packetTop"><Badge>{id}</Badge><Badge tone={risk.includes('HIGH') ? 'danger' : 'warn'}>{risk}</Badge></div><h3>{claim}</h3><p><b>Agent:</b> {agent}</p><p><b>Source:</b> {source}</p><p><b>Extracted fact:</b> {fact}</p><p><b>Dimension:</b> {dimension}</p><p><b>Confidence:</b> {confidence}</p><p><b>Status:</b> {status}</p></article>)}</div></Card>

        <section className="grid two">
          <Card><div className="sectionTitle"><CheckCircle2 size={20} /><h2>Cure Pack Builder</h2></div><ul className="cure">{curePack.map((item) => <li key={item}>{item}</li>)}</ul></Card>
          <Card><div className="sectionTitle"><ShieldCheck size={20} /><h2>Tamper-Evident Audit Trail</h2></div><div className="audit">{auditTrail.map((event, i) => <div className="auditItem" key={event}><span>{event}</span><code>sha256:{(event.length * 997 + i * 113).toString(16)}-{String(i + 1).padStart(4, '0')}</code></div>)}</div></Card>
        </section>
      </>}
      <footer><strong>Closing pitch:</strong> Most AI gives answers. AegisTrade AI demands proof.</footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
