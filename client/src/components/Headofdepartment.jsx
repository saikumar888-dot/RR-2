import React, { useState, useEffect } from "react";
import axios from "axios";

/* ============================================================
   STYLES — Gold / Luxury Finance Aesthetic
   ============================================================ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --gold:          #D4AF37;
  --gold-dark:     #B8941F;
  --gold-light:    #F0C84A;
  --gold-dim:      rgba(212,175,55,0.12);
  --gold-glow:     rgba(212,175,55,0.25);
  --bg:            #080B11;
  --bg-elevated:   #0F1319;
  --surface:       #161C25;
  --surface-2:     #1C2330;
  --border:        rgba(255,255,255,0.07);
  --border-gold:   rgba(212,175,55,0.3);
  --text:          #F2F4F8;
  --text-sec:      #8A96A8;
  --text-muted:    #4A5568;
  --green:         #2DD4A0;
  --green-dim:     rgba(45,212,160,0.12);
  --red:           #F06060;
  --red-dim:       rgba(240,96,96,0.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Page shell ── */
.hod-page {
  min-height: 100vh;
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}

.hod-page::before,
.hod-page::after {
  content: '';
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}
.hod-page::before {
  width: 500px; height: 500px;
  top: -180px; left: -180px;
  background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
}
.hod-page::after {
  width: 400px; height: 400px;
  bottom: -140px; right: -140px;
  background: radial-gradient(circle, rgba(45,212,160,0.06) 0%, transparent 70%);
}

.hod-page-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 32px 32px;
}

.hod-scroll {
  position: relative;
  z-index: 1;
  padding: clamp(28px, 5vw, 60px) clamp(20px, 5vw, 60px);
  max-width: 860px;
  margin: 0 auto;
}

/* ── Header ── */
.hod-header {
  margin-bottom: 48px;
  animation: slideDown 0.55s cubic-bezier(0.22,1,0.36,1) both;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hod-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
  border-radius: 99px;
  padding: 5px 14px;
  margin-bottom: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  color: var(--gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hod-header-badge-dot {
  width: 5px; height: 5px;
  background: var(--gold);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--gold);
  animation: blink 2.4s ease-in-out infinite;
}

@keyframes blink {
  0%,100% { opacity:1; }
  50%      { opacity:0.3; }
}

.hod-header h1 {
  font-family: 'Libre Baskerville', serif;
  font-size: clamp(30px, 4.5vw, 46px);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: var(--text);
}

.hod-header h1 em {
  font-style: italic;
  color: var(--gold);
}

.hod-header p {
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

/* ── Gold rule ── */
.hod-rule {
  height: 1px;
  background: linear-gradient(90deg, var(--gold-dim), var(--border-gold) 40%, transparent);
  margin: 36px 0;
}

/* ── Action buttons ── */
.hod-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
}

@keyframes fadeUp {
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
}

.hod-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 24px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  letter-spacing: 0.01em;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  position: relative;
  overflow: hidden;
}

.hod-btn::after {
  content:'';
  position:absolute;
  inset:0;
  background:rgba(255,255,255,0);
  transition:background 0.15s;
}
.hod-btn:hover::after  { background:rgba(255,255,255,0.06); }
.hod-btn:active        { transform:scale(0.97) !important; }

.hod-btn-expense {
  background: var(--surface);
  color: var(--red);
  border: 1px solid rgba(240,96,96,0.22);
}
.hod-btn-expense:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(240,96,96,0.14);
  border-color: rgba(240,96,96,0.4);
}

.hod-btn-revenue {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
  color: #0a0800;
  box-shadow: 0 4px 18px var(--gold-glow);
  animation: goldPulse 3s ease-in-out infinite 1s;
}
.hod-btn-revenue:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px var(--gold-glow);
}

@keyframes goldPulse {
  0%,100% { box-shadow: 0 4px 18px rgba(212,175,55,0.25); }
  50%      { box-shadow: 0 4px 26px rgba(212,175,55,0.45); }
}

/* ── MODAL ── */
.hod-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.78);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: overlayIn 0.22s ease both;
}

@keyframes overlayIn {
  from { opacity:0; }
  to   { opacity:1; }
}

.hod-modal {
  width: 100%;
  max-width: 580px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
  animation: modalPop 0.32s cubic-bezier(0.34,1.56,0.64,1) both;
  max-height: 90vh;
  overflow-y: auto;
}
.hod-modal::-webkit-scrollbar { width: 4px; }
.hod-modal::-webkit-scrollbar-thumb { background: var(--border); border-radius:4px; }

@keyframes modalPop {
  from { opacity:0; transform:scale(0.91) translateY(20px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}

.hod-modal-accent {
  height: 3px;
}
.hod-modal-accent.expense {
  background: linear-gradient(90deg, transparent, var(--red), transparent);
}
.hod-modal-accent.revenue {
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.hod-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 0;
}

.hod-modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hod-modal-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.hod-modal-icon.expense {
  background: var(--red-dim);
  border: 1px solid rgba(240,96,96,0.22);
}
.hod-modal-icon.revenue {
  background: var(--gold-dim);
  border: 1px solid var(--border-gold);
}

.hod-modal-title h2 {
  font-family: 'Libre Baskerville', serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--text);
}

.hod-modal-close {
  width: 34px; height: 34px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-sec);
  font-size: 20px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  line-height:1;
}
.hod-modal-close:hover {
  background: var(--surface-2);
  color: var(--text);
  transform: rotate(90deg);
}

/* ── Form ── */
.hod-form {
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hod-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.hod-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hod-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
}

.hod-input,
.hod-select,
.hod-textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 11px 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  -webkit-appearance: none;
}
.hod-input::placeholder,
.hod-textarea::placeholder { color: var(--text-muted); }

.hod-input:focus,
.hod-select:focus,
.hod-textarea:focus {
  border-color: var(--gold);
  background: var(--surface-2);
  box-shadow: 0 0 0 3px var(--gold-dim);
}

.hod-input[type="date"] { color-scheme: dark; }

.hod-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238A96A8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
}
.hod-select option { background: var(--bg-elevated); }

.hod-textarea {
  resize: vertical;
  min-height: 78px;
  line-height: 1.5;
}

/* ── Submit ── */
.hod-submit {
  margin-top: 6px;
  padding: 14px;
  border-radius: 11px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.hod-submit:active { transform:scale(0.98); }
.hod-submit:disabled { opacity:0.55; cursor:not-allowed; }

.hod-submit.expense {
  background: linear-gradient(135deg, #f06060, #c93a3a);
  color: #fff;
  box-shadow: 0 4px 20px rgba(240,96,96,0.28);
}
.hod-submit.expense:hover:not(:disabled) {
  box-shadow: 0 6px 28px rgba(240,96,96,0.4);
  transform: translateY(-1px);
}

.hod-submit.revenue {
  background: linear-gradient(135deg, var(--gold-light), var(--gold-dark));
  color: #0a0800;
  box-shadow: 0 4px 20px var(--gold-glow);
}
.hod-submit.revenue:hover:not(:disabled) {
  box-shadow: 0 6px 28px rgba(212,175,55,0.45);
  transform: translateY(-1px);
}

/* spinner */
.hod-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(0,0,0,0.2);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }

/* toast */
.hod-toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 2000;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
}
.hod-toast.success { border-color: rgba(45,212,160,0.3); color: var(--green); }
.hod-toast.error   { border-color: rgba(240,96,96,0.3);  color: var(--red);  }
@keyframes toastIn {
  from { opacity:0; transform:translateY(16px) scale(0.95); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}

/* ── Responsive ── */
@media (max-width: 520px) {
  .hod-row { grid-template-columns: 1fr; }
  .hod-form { padding: 18px 18px 22px; }
  .hod-modal-header { padding: 18px 18px 0; }
  .hod-actions { flex-direction: column; }
  .hod-btn { width: 100%; justify-content: center; }
}
`;

/* ============================================================
   COMPONENT
   ============================================================ */
const HeadOfDepartment = () => {
  /* ── auth / ids ── */
  const [user,           setUser]           = useState(null);
  const [departmentId,   setDepartmentId]   = useState(null);
  const [departmentName, setDepartmentName] = useState(null)
  const [organizationId, setOrganizationId] = useState(null);

  /* ── modal visibility ── */
  const [showExpense, setShowExpense] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  /* ── async state ── */
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState(null); // { msg, type }

  /* ── expense form state ── */
  const defaultExpense = {
    title:          "",
    description:    "",
    category:       "",
    amount:         "",
    currency:       "INR",
    expenseType:    "OneTime",
    billingCycle:   "",
    expenseDate:    new Date().toISOString().split("T")[0],
    vendorName:     "",
    invoiceNumber:  "",
    approvalStatus: "Pending",
  };
  const [expenseData, setExpenseData] = useState(defaultExpense);

  /* ── revenue form state ── */
  const defaultRevenue = {
    source:        "",
    clientName:    "",
    amount:        "",
    currency:      "INR",
    type:          "OneTime",
    billingCycle:  null,
    region:        "India",
    receivedDate:  new Date().toISOString().split("T")[0],
    invoiceNumber: "",
  };
  const [revenueData, setRevenueData] = useState(defaultRevenue);

  /* ── on mount: fetch logged-in user ── */
  useEffect(() => {
    fetchUser();
  },[]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
      const u = res.data.user;
      setUser(u);
      if (u.departmentId)   setDepartmentId(u.departmentId);
      if (u.organizationId) setOrganizationId(u.organizationId);
    } catch (err) {
      console.error("fetchUser:", err);
    }
  };

  useEffect(() => {
    fetchDepartmentName();
  },[organizationId]);

  const fetchDepartmentName = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/departments/${departmentId}` , {
        withCredentials: true
      })

      const u = res.data;
      setDepartmentName(res.data.data.name)
    } catch (error) {
      console.log(error)
    }
  }

  /* ── toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── field helpers ── */
  const setExpense = (k, v) => setExpenseData(p => ({ ...p, [k]: v }));
  const setRevenue = (k, v) => setRevenueData(p => ({ ...p, [k]: v }));

  /* ── EXPENSE SUBMIT ── */
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        organizationId,
        departmentId,
        title:          expenseData.title,
        description:    expenseData.description,
        category:       expenseData.category,
        amount:         parseFloat(expenseData.amount),
        currency:       expenseData.currency,
        expenseType:    expenseData.expenseType,
        ...(expenseData.expenseType === "Recurring" && { billingCycle: expenseData.billingCycle }),
        expenseDate:    new Date(expenseData.expenseDate).toISOString(),
        vendorName:     expenseData.vendorName,
        invoiceNumber:  expenseData.invoiceNumber,
        approvalStatus: expenseData.approvalStatus,
        createdBy:      user?._id,
        isActive:       true,
      };

      await axios.post("http://localhost:5000/api/expense/", payload, { withCredentials: true });
      setShowExpense(false);
      setExpenseData(defaultExpense);
      showToast("Expense submitted successfully");
      console.log("expense submitted successfully")
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to submit expense", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── REVENUE SUBMIT ── */
  const handleRevenueSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...revenueData,
        departmentId,
        amount: parseFloat(revenueData.amount),
      };
      await axios.post("http://localhost:5000/api/revenue", payload, { withCredentials: true });
      setShowRevenue(false);
      setRevenueData(defaultRevenue);
      showToast("Revenue recorded successfully");
      console.log("revenue submitted successfully")
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to submit revenue", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <>
      <style>{css}</style>

      <div className="hod-page">
        <div className="hod-page-grid" />

        <div className="hod-scroll">

          {/* ── HEADER ── */}
          <div className="hod-header">
            <div className="hod-header-badge">
              <span className="hod-header-badge-dot" />
              Financial Control
            </div>
            <h1>Head of <em>Department</em></h1>
            <p>Manage your {departmentName} department's financial activity</p>
          </div>

          <div className="hod-rule" />

          {/* ── ACTIONS ── */}
          <div className="hod-actions">
            <button className="hod-btn hod-btn-expense" onClick={() => setShowExpense(true)}>
              <span style={{ fontSize: 16 }}>↓</span>
              Add Expense
            </button>
            <button className="hod-btn hod-btn-revenue" onClick={() => setShowRevenue(true)}>
              <span style={{ fontSize: 16 }}>↑</span>
              Add Revenue
            </button>
          </div>

        </div>
      </div>

      {/* =====================================================
          EXPENSE MODAL
          ===================================================== */}
      {showExpense && (
        <div className="hod-overlay" onClick={() => !submitting && setShowExpense(false)}>
          <div className="hod-modal" onClick={e => e.stopPropagation()}>

            <div className="hod-modal-accent expense" />

            <div className="hod-modal-header">
              <div className="hod-modal-title">
                <div className="hod-modal-icon expense">↓</div>
                <h2>New Expense</h2>
              </div>
              <button className="hod-modal-close" onClick={() => !submitting && setShowExpense(false)}>×</button>
            </div>

            <form className="hod-form" onSubmit={handleExpenseSubmit}>

              {/* Title */}
              <div className="hod-field">
                <label className="hod-label">Title *</label>
                <input className="hod-input" type="text" placeholder="e.g. AWS Cloud Hosting"
                  value={expenseData.title}
                  onChange={e => setExpense("title", e.target.value)}
                  required
                />
              </div>

              {/* Category & Amount */}
              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Category *</label>
                  <input className="hod-input" type="text" placeholder="e.g. Infrastructure"
                    value={expenseData.category}
                    onChange={e => setExpense("category", e.target.value)}
                    required
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Amount *</label>
                  <input className="hod-input" type="number" min="0" step="0.01" placeholder="0.00"
                    value={expenseData.amount}
                    onChange={e => setExpense("amount", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Currency & Expense Type */}
              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Currency</label>
                  <select className="hod-select"
                    value={expenseData.currency}
                    onChange={e => setExpense("currency", e.target.value)}
                  >
                    <option value="INR">INR — ₹</option>
                    <option value="USD">USD — $</option>
                    <option value="EUR">EUR — €</option>
                    <option value="GBP">GBP — £</option>
                  </select>
                </div>
                <div className="hod-field">
                  <label className="hod-label">Expense Type</label>
                  <select className="hod-select"
                    value={expenseData.expenseType}
                    onChange={e => setExpense("expenseType", e.target.value)}
                  >
                    <option value="OneTime">One-Time</option>
                    <option value="Recurring">Recurring</option>
                  </select>
                </div>
              </div>

              {/* Billing Cycle — only for Recurring */}
              {expenseData.expenseType === "Recurring" && (
                <div className="hod-field">
                  <label className="hod-label">Billing Cycle *</label>
                  <select className="hod-select"
                    value={expenseData.billingCycle}
                    onChange={e => setExpense("billingCycle", e.target.value)}
                    required
                  >
                    <option value="">Select cycle…</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              )}

              {/* Vendor & Invoice */}
              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Vendor Name</label>
                  <input className="hod-input" type="text" placeholder="e.g. Amazon Web Services"
                    value={expenseData.vendorName}
                    onChange={e => setExpense("vendorName", e.target.value)}
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Invoice Number</label>
                  <input className="hod-input" type="text" placeholder="e.g. AWS-INV-001"
                    value={expenseData.invoiceNumber}
                    onChange={e => setExpense("invoiceNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* Date & Approval Status */}
              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Expense Date</label>
                  <input className="hod-input" type="date"
                    value={expenseData.expenseDate}
                    onChange={e => setExpense("expenseDate", e.target.value)}
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Approval Status</label>
                  <select className="hod-select"
                    value={expenseData.approvalStatus}
                    onChange={e => setExpense("approvalStatus", e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="hod-field">
                <label className="hod-label">Description</label>
                <textarea className="hod-textarea"
                  placeholder="Brief description of this expense…"
                  value={expenseData.description}
                  onChange={e => setExpense("description", e.target.value)}
                />
              </div>

              <button type="submit" className="hod-submit expense" disabled={submitting}>
                {submitting
                  ? <><span className="hod-spinner" /> Submitting…</>
                  : "Submit Expense"
                }
              </button>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          REVENUE MODAL
          ===================================================== */}
      {showRevenue && (
        <div className="hod-overlay" onClick={() => !submitting && setShowRevenue(false)}>
          <div className="hod-modal" onClick={e => e.stopPropagation()}>

            <div className="hod-modal-accent revenue" />

            <div className="hod-modal-header">
              <div className="hod-modal-title">
                <div className="hod-modal-icon revenue">↑</div>
                <h2>New Revenue</h2>
              </div>
              <button className="hod-modal-close" onClick={() => !submitting && setShowRevenue(false)}>×</button>
            </div>

            <form className="hod-form" onSubmit={handleRevenueSubmit}>

              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Source *</label>
                  <input className="hod-input" type="text" placeholder="Revenue source"
                    value={revenueData.source}
                    onChange={e => setRevenue("source", e.target.value)}
                    required
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Client Name *</label>
                  <input className="hod-input" type="text" placeholder="Client"
                    value={revenueData.clientName}
                    onChange={e => setRevenue("clientName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Amount *</label>
                  <input className="hod-input" type="number" min="0" step="0.01" placeholder="0.00"
                    value={revenueData.amount}
                    onChange={e => setRevenue("amount", e.target.value)}
                    required
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Invoice Number *</label>
                  <input className="hod-input" type="text" placeholder="INV-0001"
                    value={revenueData.invoiceNumber}
                    onChange={e => setRevenue("invoiceNumber", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Currency</label>
                  <select className="hod-select"
                    value={revenueData.currency}
                    onChange={e => setRevenue("currency", e.target.value)}
                  >
                    <option value="INR">INR — ₹</option>
                    <option value="USD">USD — $</option>
                    <option value="EUR">EUR — €</option>
                    <option value="GBP">GBP — £</option>
                  </select>
                </div>
                <div className="hod-field">
                  <label className="hod-label">Type</label>
                  <select className="hod-select"
                    value={revenueData.type}
                    onChange={e => setRevenue("type", e.target.value)}
                  >
                    <option value="OneTime">One-Time</option>
                    <option value="Recurring">Recurring</option>
                  </select>
                </div>
              </div>

              <div className="hod-row">
                <div className="hod-field">
                  <label className="hod-label">Region</label>
                  <input className="hod-input" type="text" placeholder="e.g. India"
                    value={revenueData.region}
                    onChange={e => setRevenue("region", e.target.value)}
                  />
                </div>
                <div className="hod-field">
                  <label className="hod-label">Received Date</label>
                  <input className="hod-input" type="date"
                    value={revenueData.receivedDate}
                    onChange={e => setRevenue("receivedDate", e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="hod-submit revenue" disabled={submitting}>
                {submitting
                  ? <><span className="hod-spinner" /> Submitting…</>
                  : "Submit Revenue"
                }
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`hod-toast ${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default HeadOfDepartment;