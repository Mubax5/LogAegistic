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
  { id: 'ORD-2026-OM-019', buyer: 'Al-Mizan Logistics LLC', product: 'Thermal Imaging Sensor Module', destination: 'Oman', status: 'HOLD', owner: 'Compliance Team', due: 'Today' },
  { id: 'ORD-2026-SG-022', buyer: 'Northbridge Marine Pte Ltd', product: 'Industrial Sensor Kit', destination: 'Singapore', status: 'READY', owner: 'Sales Ops', due: 'Tomorrow' },
  { id: 'ORD-2026-AE-014', buyer: 'Gulf Storage Systems', product: 'Warehouse Camera Module', destination: 'UAE', status: 'DRAFT', owner: 'Sales', due: '2 days' }
];

const reviewers = [
  { name: 'Manifest Tech-Deconstructor', label: 'Product Review', icon: PackageSearch, plain: 'Checks whether the product description matches the technical specification.', output: 'Thermal capability needs export review.' },
  { name: 'Geopolitical Sanctions Bloodhound', label: 'Buyer Review', icon: ShieldAlert, plain: 'Checks the buyer, ownership links, route, and missing documents.', output: 'No direct match, ownership still unclear.' },
  { name: 'Logistics Legal-Arbitrator', label: 'Decision Review', icon: UserCheck, plain: 'Turns evidence into a clear GO, HOLD, or NO-GO recommendation.', output: 'Hold shipment until documents are reviewed.' }
];

const risks = [
  ['Product risk', 'High', 'Thermal range and sensitivity are stronger than the declared use suggests.'],
  ['Buyer risk', 'Medium', 'No direct restricted-party hit, but ownership details are incomplete.'],
  ['Route risk', 'Medium', 'Route uses a transit hub and needs business justification.'],
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

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Card({ title, icon: Icon, children, action }) {
  return (
    <section className="card">
      <div className="cardTop">
        <div className="cardTitle">{Icon && <Icon size={18} />}<h2>{title}</h2></div>
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
  const [docs, setDocs] = useState({ endUser: false, ownership: false, nonReexport: false, route: false });
  const completedDocs = useMemo(() => Object.values(docs).filter(Boolean).length, [docs]);
  const allDocsComplete = completedDocs === requiredDocs.length;

  function toggleDoc(key) {
    setDocs((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="brandMark">A</div><div><strong>AegisTrade</strong><span>Export Review</span></div></div>
        <nav className="nav"><a className="active">Cases</a><a>Documents</a><a>Decision Log</a><a>Settings</a></nav>
        <div className="support"><ShieldCheck size={18} /><p>Held shipments always require human approval before release.</p></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">Professional Compliance Workflow</p><h1>Export Review Workspace</h1><p>Review high-risk orders, request missing documents, and decide whether a shipment can be released.</p></div>
          <div className="topActions"><button className="secondary"><FileText size={16} /> Draft report</button><button className="primary"><Upload size={16} /> Upload document</button></div>
        </header>

        <section className="stats">
          <div className="stat"><span>Open reviews</span><strong>3</strong><p>1 high priority</p></div>
          <div className="stat"><span>Current decision</span><strong>HOLD</strong><p>Release locked</p></div>
          <div className="stat"><span>Documents complete</span><strong>{completedDocs}/4</strong><p>{allDocsComplete ? 'Ready for approval' : 'Action needed'}</p></div>
          <div className="stat"><span>Review team</span><strong>3 agents</strong><p>Product, buyer, decision</p></div>
        </section>

        <section className="layout">
          <Card title="Case Queue" icon={Search}>
            <div className="caseList">{cases.map((item) => <button key={item.id} className={`caseItem ${selectedCase.id === item.id ? 'selected' : ''}`} onClick={() => setSelectedCase(item)}><div><strong>{item.id}</strong><span>{item.buyer}</span></div><Pill tone={statusTone(item.status)}>{item.status}</Pill></button>)}</div>
          </Card>

          <Card title="Current Case" icon={ClipboardCheck} action={<Pill tone={statusTone(selectedCase.status)}>{selectedCase.status}</Pill>}>
            <div className="infoGrid"><div><span>Product</span><strong>{selectedCase.product}</strong></div><div><span>Buyer</span><strong>{selectedCase.buyer}</strong></div><div><span>Destination</span><strong>{selectedCase.destination}</strong></div><div><span>Owner</span><strong>{selectedCase.owner}</strong></div></div>
            <div className="stepper">{['Intake', 'Checks', 'Documents', 'Decision', 'Approval'].map((step, index) => <div className={`step ${index < 2 || allDocsComplete ? 'done' : ''}`} key={step}><span>{index + 1}</span><p>{step}</p></div>)}</div>
          </Card>
        </section>

        <section className="decisionBanner"><div className="bannerIcon"><Lock size={22} /></div><div><h2>{allDocsComplete ? 'Ready for final approval' : 'Hold until documents are complete'}</h2><p>This order is paused because the team needs proof of end user, ownership, route reason, and non-reexport commitment.</p></div><button className="primary">Continue review <ArrowRight size={16} /></button></section>

        <section className="twoCol">
          <Card title="Review Team" icon={Users}>
            <div className="reviewers">{reviewers.map((reviewer) => { const Icon = reviewer.icon; return <article className="reviewer" key={reviewer.name}><div className="reviewerIcon"><Icon size={20} /></div><div><strong>{reviewer.label}</strong><span>{reviewer.plain}</span><p>{reviewer.output}</p></div></article>; })}</div>
          </Card>

          <Card title="Decision Matrix" icon={AlertTriangle}>
            <div className="riskTable">{risks.map(([area, risk, explanation]) => <div className="riskRow" key={area}><div><strong>{area}</strong><span>{explanation}</span></div><Pill tone={riskTone(risk)}>{risk}</Pill></div>)}</div>
          </Card>
        </section>

        <section className="twoCol">
          <Card title="Required Documents" icon={FileCheck2} action={<button className="linkButton" onClick={() => setDocs({ endUser: true, ownership: true, nonReexport: true, route: true })}>Mark all received</button>}>
            <div className="docs">{requiredDocs.map(([key, title, help]) => <button className={`doc ${docs[key] ? 'complete' : ''}`} key={key} onClick={() => toggleDoc(key)}>{docs[key] ? <CheckCircle2 size={20} /> : <XCircle size={20} />}<div><strong>{title}</strong><span>{help}</span></div></button>)}</div>
          </Card>

          <Card title="Approval Recommendation" icon={ShieldCheck}>
            <div className="approval"><div className="approvalStatus">{allDocsComplete ? <CheckCircle2 size={26} /> : <AlertTriangle size={26} />}<div><strong>{allDocsComplete ? 'Ready for compliance approval' : 'Keep shipment on HOLD'}</strong><span>{allDocsComplete ? 'Documents are complete. A human officer can make the final decision.' : 'Missing documents prevent a defensible release decision.'}</span></div></div><div className="decisionButtons"><button className="dangerOutline">NO-GO</button><button className="hold">HOLD</button><button className="successOutline" disabled={!allDocsComplete}>GO</button></div></div>
          </Card>
        </section>

        <section className="twoCol bottom">
          <Card title="Plain-English Summary" icon={FileText}><div className="summary"><p>The product may be sensitive, the buyer is not directly blocked, but ownership and document evidence is incomplete. The safest professional decision is to hold the order, request four documents, and let a compliance officer approve release only after review.</p></div></Card>
          <Card title="Activity & Audit Trail" icon={ShieldCheck}><div className="timeline">{timeline.map(([time, event]) => <div className="timelineItem" key={time}><span>{time}</span><p>{event}</p></div>)}</div></Card>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
