import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Lock,
  PackageSearch,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
  XCircle
} from 'lucide-react';
import './styles.css';

const cases = [
  {
    id: 'ORD-2026-OM-019',
    buyer: 'Al-Mizan Logistics LLC',
    product: 'Thermal Imaging Sensor Module',
    destination: 'Oman',
    status: 'HOLD',
    priority: 'High',
    owner: 'Compliance Team',
    due: 'Today'
  },
  {
    id: 'ORD-2026-SG-022',
    buyer: 'Northbridge Marine Pte Ltd',
    product: 'Industrial Sensor Kit',
    destination: 'Singapore',
    status: 'READY',
    priority: 'Medium',
    owner: 'Sales Ops',
    due: 'Tomorrow'
  },
  {
    id: 'ORD-2026-AE-014',
    buyer: 'Gulf Storage Systems',
    product: 'Warehouse Camera Module',
    destination: 'UAE',
    status: 'DRAFT',
    priority: 'Low',
    owner: 'Sales',
    due: '2 days'
  }
];

const reviewers = [
  {
    name: 'Manifest Tech-Deconstructor',
    label: 'Product Review',
    icon: PackageSearch,
    output: 'Thermal capability needs export review.',
    plain: 'Checks whether the product description matches the technical specification.'
  },
  {
    name: 'Geopolitical Sanctions Bloodhound',
    label: 'Buyer Review',
    icon: ShieldAlert,
    output: 'No direct match, ownership still unclear.',
    plain: 'Checks the buyer, ownership links, route, and missing documents.'
  },
  {
    name: 'Logistics Legal-Arbitrator',
    label: 'Decision Review',
    icon: UserCheck,
    output: 'Hold shipment until documents are reviewed.',
    plain: 'Turns evidence into a clear GO, HOLD, or NO-GO recommendation.'
  }
];

const riskRows = [
  ['Product risk', 'High', 'Thermal range and sensitivity are stronger than the declared use suggests.'],
  ['Buyer risk', 'Medium', 'No direct restricted-party hit, but ownership details are incomplete.'],
  ['Route risk', 'Medium', 'Route uses a transit hub and needs a short business justification.'],
  ['Document risk', 'High', 'End-user and non-reexport documents are missing.'],
  ['Decision confidence', 'Low', 'A release decision is not defensible until documents are complete.']
];

const requiredDocs = [
  ['endUser', 'End-User Certificate', 'Confirms who will use the product and for what purpose.'],
  ['ownership', 'Ownership Declaration', 'Clarifies who controls the buyer.'],
  ['nonReexport', 'Non-Reexport Letter', 'Confirms the product will not be resold or transferred.'],
  ['route', 'Route Justification', 'Explains why the shipment transits through Singapore.']
];

const timeline = [
  ['09:10', 'Order received from sales system'],
  ['09:12', 'Product and buyer review started'],
  ['09:14', 'Technical risk flagged'],
  ['09:16', 'Buyer ownership marked incomplete'],
  ['09:18', 'Decision set to HOLD'],
  ['09:19', 'Document request generated']
];

function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function Card({ title, icon: Icon, children, action }) {
  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title">
          {Icon && <Icon size={18} />}
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function statusTone(status) {
  if (status === 'HOLD') return 'danger';
  if (status === 'READY') return 'success';
  return 'muted';
}

function riskTone(risk) {
  if (risk === 'High') return 'danger';
  if (risk === 'Medium') return 'warning';
  if (risk === 'Low') return 'muted';
  return 'success';
}

function App() {
  const [selectedCase, setSelectedCase] = useState(cases[0]);
  const [reviewStarted, setReviewStarted] = useState(true);
  const [docs, setDocs] = useState({
    endUser: false,
    ownership: false,
    nonReexport: false,
    route: false
  });

  const completedDocs = useMemo(() => Object.values(docs).filter(Boolean).length, [docs]);
  const allDocsComplete = completedDocs === requiredDocs.length;
  const decisionLabel = allDocsComplete ? 'Ready for final approval' : 'Hold until documents are complete';

  function toggleDoc(key) {
    setDocs((current) => ({ ...current, [key]: !current[key] }));
  }

  function markAllDocs() {
    setDocs({ endUser: true, ownership: true, nonReexport: true, route: true });
  }

  function resetDocs() {
    setDocs({ endUser: false, ownership: false, nonReexport: false, route: false });
  }

  return (
    <main className="product-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>AegisTrade</strong>
            <span>Export Review</span>
          </div>
        </div>
        <nav className="side-nav">
          <a className="active">Cases</a>
          <a>Documents</a>
          <a>Decision Log</a>
          <a>Settings</a>
        </nav>
        <div className="side-note">
          <ShieldCheck size={18} />
          <p>Human approval is required before releasing any held shipment.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Professional Compliance Workflow</p>
            <h1>Export Review Workspace</h1>
            <p className="subtext">Review high-risk orders, request missing documents, and decide whether a shipment can be released.</p>
          </div>
          <div className="top-actions">
            <button className="secondary-button"><FileText size={16} /> Draft report</button>
            <button className="primary-button"><Upload size={16} /> Upload document</button>
          </div>
        </header>

        <section className="metrics-grid">
          <div className="metric-card">
            <span>Open reviews</span>
            <strong>3</strong>
            <p>1 high priority</p>
          </div>
          <div className="metric-card">
            <span>Current decision</span>
            <strong>HOLD</strong>
            <p>Release locked</p>
          </div>
          <div className="metric-card">
            <span>Documents complete</span>
            <strong>{completedDocs}/{requiredDocs.length}</strong>
            <p>{allDocsComplete ? 'Ready for approval' : 'Action needed'}</p>
          </div>
          <div className="metric-card">
            <span>Review team</span>
            <strong>3 agents</strong>
            <p>Product, buyer, decision</p>
          </div>
        </section>

        <section className="main-grid">
          <Card title="Case Queue" icon={Search}>
            <div className="case-list">
              {cases.map((item) => (
                <button
                  key={item.id}
                  className={`case-row ${selectedCase.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCase(item)}
                >
                  <div>
                    <strong>{item.id}</strong>
                    <span>{item.buyer}</span>
                  </div>
                  <StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>
                </button>
              ))}
            </div>
          </Card>

          <Card
            title="Current Case"
            icon={ClipboardCheck}
            action={<StatusPill tone="danger">{selectedCase.status}</StatusPill>}
          >
            <div className="case-summary">
              <div>
                <span>Product</span>
                <strong>{selectedCase.product}</strong>
              </div>
              <div>
                <span>Buyer</span>
                <strong>{selectedCase.buyer}</strong>
              </div>
              <div>
                <span>Destination</span>
                <strong>{selectedCase.destination}</strong>
              </div>
              <div>
                <span>Owner</span>
                <strong>{selectedCase.owner}</strong>
              </div>
            </div>

            <div className="stepper">
              {['Intake', 'Checks', 'Documents', 'Decision', 'Approval'].map((step, index) => (
                <div className={`step ${index < 3 || allDocsComplete ? 'done' : ''}`} key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="decision-banner">
          <div className="decision-icon"><Lock size={22} /></div>
          <div>
            <h2>{decisionLabel}</h2>
            <p>
              This order is not rejected. It is paused because the team needs proof of end user, ownership, route reason, and non-reexport commitment.
            </p>
          </div>
          <button className="primary-button" onClick={() => setReviewStarted(true)}>
            {reviewStarted ? 'Review running' : 'Start review'} <ArrowRight size={16} />
          </button>
        </section>

        <section className="content-grid">
          <Card title="Review Team" icon={Users}>
            <div className="reviewers">
              {reviewers.map(([name]) => name)}
              {reviewers.map((reviewer) => {
                const Icon = reviewer.icon;
                return (
                  <article className="reviewer-card" key={reviewer.name}>
                    <div className="reviewer-icon"><Icon size={20} /></div>
                    <div>
                      <strong>{reviewer.label}</strong>
                      <span>{reviewer.plain}</span>
                      <p>{reviewer.output}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>

          <Card title="Decision Matrix" icon={AlertTriangle}>
            <div className="risk-table">
              {riskRows.map(([area, risk, explanation]) => (
                <div className="risk-row" key={area}>
                  <div>
                    <strong>{area}</strong>
                    <span>{explanation}</span>
                  </div>
                  <StatusPill tone={riskTone(risk)}>{risk}</StatusPill>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="content-grid">
          <Card
            title="Required Documents"
            icon={FileCheck2}
            action={<button className="text-button" onClick={markAllDocs}>Mark all received</button>}
          >
            <div className="document-list">
              {requiredDocs.map(([key, title, help]) => (
                <button className={`document-item ${docs[key] ? 'complete' : ''}`} key={key} onClick={() => toggleDoc(key)}>
                  {docs[key] ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  <div>
                    <strong>{title}</strong>
                    <span>{help}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="document-actions">
              <button className="secondary-button" onClick={resetDocs}>Reset</button>
              <button className="primary-button">Send request to sales</button>
            </div>
          </Card>

          <Card title="Approval Recommendation" icon={ShieldCheck}>
            <div className="approval-panel">
              <div className="approval-status">
                {allDocsComplete ? <CheckCircle2 size={26} /> : <AlertTriangle size={26} />}
                <div>
                  <strong>{allDocsComplete ? 'Ready for compliance approval' : 'Keep shipment on HOLD'}</strong>
                  <span>{allDocsComplete ? 'Documents are complete. Human officer can make the final decision.' : 'Missing documents prevent a defensible release decision.'}</span>
                </div>
              </div>
              <div className="decision-buttons">
                <button className="outline-danger">NO-GO</button>
                <button className="hold-button">HOLD</button>
                <button className="outline-success" disabled={!allDocsComplete}>GO</button>
              </div>
            </div>
          </Card>
        </section>

        <section className="content-grid bottom-grid">
          <Card title="Plain-English Summary" icon={FileText}>
            <div className="summary-box">
              <p>
                The product may be sensitive, the buyer is not directly blocked, but the ownership and document evidence is incomplete. The safest professional decision is to hold the order, request four documents, and let a compliance officer approve release only after review.
              </p>
            </div>
          </Card>

          <Card title="Activity & Audit Trail" icon={ShieldCheck}>
            <div className="timeline">
              {timeline.map(([time, event]) => (
                <div className="timeline-item" key={time}>
                  <span>{time}</span>
                  <p>{event}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
