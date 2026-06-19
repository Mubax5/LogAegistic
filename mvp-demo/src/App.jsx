import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FileWarning,
  Gavel,
  Lock,
  PackageSearch,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Workflow
} from 'lucide-react';
import './styles.css';

const agents = [
  ['Manifest Tech-Deconstructor', 'Reads manifest, extracts product facts, and flags technical risk.', PackageSearch, 'Technical review complete'],
  ['Geopolitical Sanctions Bloodhound', 'Checks buyer, ownership, route, aliases, and document risk.', ShieldAlert, 'Entity review complete'],
  ['Logistics Legal-Arbitrator', 'Challenges weak evidence, decides GO/HOLD/NO-GO, and generates Cure Pack.', Gavel, 'HOLD decision issued']
];

const caseFacts = [
  ['Order ID', 'ORD-2026-OM-019'],
  ['Product', 'Thermal Imaging Sensor Module'],
  ['Buyer', 'Al-Mizan Logistics LLC'],
  ['Destination', 'Oman'],
  ['Route', 'Indonesia → Singapore → Oman'],
  ['Declared use', 'Industrial warehouse inspection'],
  ['Warehouse state', 'Release locked until human review']
];

const evidence = [
  ['EV-TECH-001', 'Manifest Tech-Deconstructor', 'Technical Dual-Use', 'HIGH', 'Thermal range and sensor sensitivity are stronger than a generic warehouse inspection description suggests.', 'product_manifest.pdf / page 2', 'Accepted'],
  ['EV-ENTITY-001', 'Geopolitical Sanctions Bloodhound', 'Ownership Review', 'MEDIUM HIGH', 'Buyer is not a direct list match, but ownership and control review remain unresolved.', 'ownership_graph_mock.json', 'Accepted'],
  ['EV-ROUTE-001', 'Geopolitical Sanctions Bloodhound', 'Route Risk', 'MEDIUM', 'New buyer plus transit route plus missing end-user document creates diversion-review concern.', 'order_route_and_documents', 'Escalated'],
  ['EV-JUDGE-001', 'Logistics Legal-Arbitrator', 'Decision Defensibility', 'LOW', 'GO is not defensible until end-user identity, route reason, and non-reexport commitment are documented.', 'tribunal_cross_check', 'Final']
];

const transcript = [
  ['Manifest Tech-Deconstructor', 'I am not making a final ECCN decision. I am submitting a technical risk candidate based on extracted facts from the manifest.'],
  ['Geopolitical Sanctions Bloodhound', 'No direct restricted-party hit is found in the mock screen. However, the buyer context, ownership graph, and route still require enhanced due diligence.'],
  ['Logistics Legal-Arbitrator', 'Challenge: separate confirmed facts from suspicion. The combined uncertainty blocks a safe GO, but does not justify automatic NO-GO.'],
  ['Logistics Legal-Arbitrator', 'Final recommendation: HOLD. Warehouse release remains locked until Cure Pack documents are reviewed by a human compliance officer.']
];

const decisionRows = [
  ['Technical capability', 'Possible dual-use indicator', 'HIGH'],
  ['Direct list match', 'No direct mock hit', 'CLEAR'],
  ['Ownership review', 'Unresolved affiliation concern', 'MEDIUM HIGH'],
  ['Route review', 'Transit path needs explanation', 'MEDIUM'],
  ['Documentation', 'End-user document missing', 'HIGH'],
  ['Decision defensibility', 'GO is not defensible yet', 'LOW'],
  ['Final recommendation', 'Hold pending human review', 'HOLD']
];

const curePack = [
  ['End-User Certificate', 'Identify the final user and declared end-use.'],
  ['Ownership Declaration', 'Resolve beneficial ownership ambiguity.'],
  ['Non-Reexport Attestation', 'Reduce diversion and resale risk.'],
  ['Route Justification Letter', 'Explain the Indonesia → Singapore → Oman route.'],
  ['Technical Use Clarification', 'Connect product capability to the declared industrial use case.'],
  ['Compliance Officer Sign-Off', 'Human approval required before release.']
];

const workflow = [
  ['1', 'Order Intake', 'Sales enters product, buyer, route, and available documents.'],
  ['2', 'Band Tribunal Room', 'Three agents exchange structured evidence packets.'],
  ['3', 'Cross-Check', 'Legal-Arbitrator challenges weak claims and unresolved assumptions.'],
  ['4', 'Decision + Cure Pack', 'System decides HOLD and shows exact next actions.'],
  ['5', 'Human Review', 'Compliance officer reviews missing documents before release.']
];

function Badge({ children, tone = 'neutral' }) {
  return <span className={'badge ' + tone}>{children}</span>;
}

function Card({ children, className = '' }) {
  return <section className={'card ' + className}>{children}</section>;
}

function toneFor(value) {
  if (value === 'CLEAR') return 'ok';
  if (value === 'HOLD' || value === 'HIGH' || value === 'LOW') return 'danger';
  if (value.includes('MEDIUM')) return 'warn';
  return 'neutral';
}

function App() {
  const [started, setStarted] = useState(false);
  const auditTrail = [
    'Order created',
    'Band tribunal room created',
    'Technical evidence submitted',
    'Entity evidence submitted',
    'Legal challenge completed',
    'HOLD decision issued',
    'Warehouse release locked',
    'Cure Pack generated'
  ];

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">3-Agent Band Tribunal • Export Compliance Demo</p>
          <h1>AegisTrade AI</h1>
          <p className="subtitle">
            A clear compliance cockpit for high-risk export orders: evidence first, challenge second, human review before release.
          </p>
        </div>
        <div className="heroStatus">
          <Badge tone="danger">HOLD</Badge>
          <p>Warehouse release locked</p>
        </div>
      </header>

      <section className="grid two">
        <Card>
          <div className="sectionTitle"><Workflow size={20} /><h2>Case Overview</h2></div>
          <div className="orderGrid">
            {caseFacts.map(([label, value]) => (
              <React.Fragment key={label}>
                <span>{label}</span><strong>{value}</strong>
              </React.Fragment>
            ))}
          </div>
          <button className="primaryBtn" onClick={() => setStarted(true)}>
            {started ? 'Tribunal Complete — HOLD Issued' : 'Start 3-Agent Tribunal'}
          </button>
        </Card>

        <Card>
          <div className="sectionTitle"><Lock size={20} /><h2>Decision Summary</h2></div>
          <div className="decisionBox">
            <AlertTriangle size={42} />
            <div>
              <h3>{started ? 'HOLD — Fixable, not rejected' : 'Pending compliance review'}</h3>
              <p>{started ? 'Release is blocked until missing documents and ownership ambiguity are reviewed by a human compliance officer.' : 'Click Start 3-Agent Tribunal to generate evidence, rationale, and Cure Pack.'}</p>
            </div>
          </div>
          <p className="note">Designed for a compliance officer: one case, one decision, one list of next actions.</p>
        </Card>
      </section>

      <Card>
        <div className="sectionTitle"><UserCheck size={20} /><h2>Three Core Agents from the PRD</h2></div>
        <div className="agents">
          {agents.map(([name, role, Icon, state]) => (
            <div className="agent" key={name}>
              <Icon size={28} />
              <h3>{name}</h3>
              <p>{role}</p>
              <Badge tone={started ? 'ok' : 'neutral'}>{started ? state : 'Waiting'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="sectionTitle"><ClipboardCheck size={20} /><h2>Workflow that makes the product understandable</h2></div>
        <table>
          <tbody>
            {workflow.map(([step, title, desc]) => (
              <tr key={step}>
                <td><Badge>{step}</Badge></td>
                <td><strong>{title}</strong></td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {started && (
        <>
          <section className="grid two">
            <Card>
              <div className="sectionTitle"><FileText size={20} /><h2>Agent Cross-Check</h2></div>
              <div className="transcript">
                {transcript.map(([speaker, message]) => (
                  <div className="line" key={speaker}>
                    <strong>{speaker}</strong>
                    <p>{message}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="sectionTitle"><ShieldCheck size={20} /><h2>Decision Matrix</h2></div>
              <table>
                <tbody>
                  {decisionRows.map(([dimension, finding, status]) => (
                    <tr key={dimension}>
                      <td>{dimension}</td>
                      <td>{finding}</td>
                      <td><Badge tone={toneFor(status)}>{status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          <Card>
            <div className="sectionTitle"><FileWarning size={20} /><h2>Evidence Packet Board</h2></div>
            <div className="evidenceGrid">
              {evidence.map(([id, agent, dimension, risk, claim, source, status]) => (
                <article className="evidence" key={id}>
                  <div className="packetTop"><Badge>{id}</Badge><Badge tone={toneFor(risk)}>{risk}</Badge></div>
                  <h3>{dimension}</h3>
                  <p><b>Agent:</b> {agent}</p>
                  <p><b>Claim:</b> {claim}</p>
                  <p><b>Source:</b> {source}</p>
                  <p><b>Status:</b> {status}</p>
                </article>
              ))}
            </div>
          </Card>

          <section className="grid two">
            <Card>
              <div className="sectionTitle"><CheckCircle2 size={20} /><h2>Cure Pack: next actions</h2></div>
              <div className="transcript">
                {curePack.map(([doc, why]) => (
                  <div className="line" key={doc}>
                    <strong>{doc}</strong>
                    <p>{why}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="sectionTitle"><ShieldCheck size={20} /><h2>Tamper-Evident Audit Trail</h2></div>
              <div className="audit">
                {auditTrail.map((event, index) => (
                  <div className="auditItem" key={event}>
                    <span>{event}</span>
                    <code>hash-{String(index + 1).padStart(2, '0')}-{(event.length * 997 + index * 113).toString(16)}</code>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}

      <footer>
        <strong>Pitch:</strong> AegisTrade AI does not replace compliance officers. It gives them a defensible, evidence-backed decision path.
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
