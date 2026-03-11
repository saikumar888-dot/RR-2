import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Financials.css";

const Financials = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();

  const [revenues, setRevenues]   = useState([]);
  const [expenses, setExpenses]   = useState([]);
  const [dept, setDept]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!deptId) return;
    fetchAll();
  }, [deptId]);

  // ── Each fetch is INDEPENDENT so one 404 never blocks the others ──
  const fetchAll = async () => {
    setLoading(true);
    console.log("📦 Financials — deptId:", deptId);

    // Revenue
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/${deptId}/revenues`,
        { withCredentials: true }
      );
      console.log("✅ revenues raw:", res.data.data);
      // handles: { revenues:[…] }  |  { data:[…] }  |  […]
      const d = res.data?.revenues ?? res.data?.data ?? res.data;
      setRevenues(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error("❌ revenues error:", err.response?.status, err.response?.data);
      setRevenues([]);
    }

    // Expenses
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/${deptId}/expenses`,
        { withCredentials: true }
      );
      console.log("✅ expenses raw:", res.data);
      const d = res.data?.expenses ?? res.data?.data ?? res.data;
      setExpenses(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error("❌ expenses error:", err.response?.status, err.response?.data);
      setExpenses([]);
    }

    // Dept meta (optional — used for name + budget)
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/${deptId}`,
        { withCredentials: true }
      );
      //console.log("✅ dept raw:", res.data);
      const d = res.data?.department ?? res.data?.data ?? res.data;
      setDept(d && typeof d === "object" ? d : null);
    } catch (err) {
      console.warn("⚠️ dept meta unavailable — continuing without it");
      setDept(null);
    }

    setLoading(false);
  };

  // ── Derived numbers ──
  const totalRevenue  = revenues.reduce((s, r) => s + Number(r.amount ?? r.value ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount ?? e.value ?? 0), 0);
  const netProfit      = totalRevenue - totalExpenses;
  const budgetAllocated = dept?.budgetAllocated || 0;
  const budgetUtilized  = budgetAllocated > 0
    ? Math.min((totalExpenses / budgetAllocated) * 100, 100).toFixed(1)
    : 0;

  // ── Chart data — merge revenue + expenses by period key ──
  const buildChartData = () => {
    const map = {};
    const key = (item) =>
      item.date
        ? new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        : item.month || item.label || "—";

    revenues.forEach((r) => {
      const k = key(r);
      if (!map[k]) map[k] = { label: k, revenue: 0, expenses: 0 };
      map[k].revenue += Number(r.amount ?? r.value ?? 0);
    });
    expenses.forEach((e) => {
      const k = key(e);
      if (!map[k]) map[k] = { label: k, revenue: 0, expenses: 0 };
      map[k].expenses += Number(e.amount ?? e.value ?? 0);
    });
    return Object.values(map);
  };
  const chartData = buildChartData();

  const fmtCurrency = (v) =>
    v >= 100000 ? `₹${(v / 100000).toFixed(1)}L`
    : v >= 1000  ? `₹${(v / 1000).toFixed(1)}k`
    : `₹${v}`;

  const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // ── Shared Tooltip style ──
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: "rgba(12,16,24,0.95)",
      border: "1px solid rgba(191,160,84,0.3)",
      borderRadius: "8px",
      padding: "12px 14px",
      fontFamily: "DM Sans, sans-serif",
    },
    labelStyle:   { color: "#E8E4DC", fontSize: "11px", fontWeight: 600 },
    itemStyle:    { color: "#6B7385", fontSize: "11px" },
  };

  if (loading) {
    return (
      <div className="fn-loading">
        <div className="fn-spinner" />
        <p>Loading financials…</p>
      </div>
    );
  }

  return (
    <div className="fn-root">

      {/* ── SIDEBAR STRIP ── */}
      <div className="fn-sidebar-strip">
        <button className="fn-back-btn" onClick={() => navigate(-1)}>←</button>
        <div className="fn-strip-brand">
          <div className="fn-brand-mark">R</div>
        </div>
        <div className="fn-strip-tabs">
          {["overview", "revenue", "expenses"].map((tab) => (
            <button
              key={tab}
              className={`fn-strip-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              title={tab.charAt(0).toUpperCase() + tab.slice(1)}
            >
              {tab === "overview" ? "⬡" : tab === "revenue" ? "📈" : "💳"}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="fn-main">

        {/* TOPBAR */}
        <div className="fn-topbar">
          <div className="fn-topbar-left">
            <div className="fn-breadcrumb">
              <span className="fn-breadcrumb-parent" onClick={() => navigate(-1)}>Departments</span>
              <span className="fn-breadcrumb-sep">›</span>
              <span className="fn-breadcrumb-current">{dept?.name || "Financials"}</span>
            </div>
            <h1 className="fn-page-title">Financials</h1>
            <div className="fn-page-sub">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="fn-topbar-right">
            <div className="fn-live-badge">
              <div className="fn-live-dot" /> Live
            </div>
            <div className="fn-tab-pills">
              {["overview", "revenue", "expenses"].map((tab) => (
                <button
                  key={tab}
                  className={`fn-tab-pill ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SCROLL */}
        <div className="fn-scroll">

          {/* ══════════ OVERVIEW ══════════ */}
          {activeTab === "overview" && (
            <>
              <div className="fn-kpi-grid">
                {/* Revenue */}
                <div className="fn-kpi-card fn-kpi-green">
                  <div className="fn-kpi-header">
                    <span className="fn-kpi-icon">💰</span>
                    <span className="fn-kpi-trend fn-trend-up">↑</span>
                  </div>
                  <div className="fn-kpi-label">Total Revenue</div>
                  <div className="fn-kpi-value">₹{totalRevenue.toLocaleString()}</div>
                  <div className="fn-kpi-sub">{revenues.length} transactions</div>
                </div>

                {/* Expenses */}
                <div className="fn-kpi-card fn-kpi-gold">
                  <div className="fn-kpi-header">
                    <span className="fn-kpi-icon">💳</span>
                    <span className="fn-kpi-trend fn-trend-down">↓</span>
                  </div>
                  <div className="fn-kpi-label">Total Expenses</div>
                  <div className="fn-kpi-value">₹{totalExpenses.toLocaleString()}</div>
                  <div className="fn-kpi-sub">{expenses.length} entries</div>
                </div>

                {/* Net Profit */}
                <div className={`fn-kpi-card ${netProfit >= 0 ? "fn-kpi-blue" : "fn-kpi-red"}`}>
                  <div className="fn-kpi-header">
                    <span className="fn-kpi-icon">{netProfit >= 0 ? "📊" : "⚠️"}</span>
                    <span className={`fn-kpi-trend ${netProfit >= 0 ? "fn-trend-up" : "fn-trend-down"}`}>
                      {netProfit >= 0 ? "↑" : "↓"}
                    </span>
                  </div>
                  <div className="fn-kpi-label">Net Profit</div>
                  <div className="fn-kpi-value">
                    {netProfit < 0 ? "−" : ""}₹{Math.abs(netProfit).toLocaleString()}
                  </div>
                  <div className="fn-kpi-sub">{netProfit >= 0 ? "Surplus" : "Deficit"}</div>
                </div>

                {/* Budget */}
                <div className="fn-kpi-card fn-kpi-purple">
                  <div className="fn-kpi-header">
                    <span className="fn-kpi-icon">🎯</span>
                    <span className="fn-kpi-trend">%</span>
                  </div>
                  <div className="fn-kpi-label">Budget Utilized</div>
                  <div className="fn-kpi-value">
                    {budgetAllocated > 0 ? `${budgetUtilized}%` : "N/A"}
                  </div>
                  <div className="fn-kpi-sub">
                    {budgetAllocated > 0 ? `of ₹${budgetAllocated.toLocaleString()}` : "No budget set"}
                  </div>
                </div>
              </div>

              {/* Budget progress bar */}
              {budgetAllocated > 0 && (
                <div className="fn-budget-track">
                  <div className="fn-budget-track-header">
                    <span>Budget Utilization</span>
                    <span>₹{totalExpenses.toLocaleString()} / ₹{budgetAllocated.toLocaleString()}</span>
                  </div>
                  <div className="fn-budget-bar">
                    <div
                      className={`fn-budget-fill ${
                        parseFloat(budgetUtilized) > 85 ? "fn-budget-danger"
                        : parseFloat(budgetUtilized) > 60 ? "fn-budget-warn"
                        : "fn-budget-ok"
                      }`}
                      style={{ width: `${budgetUtilized}%` }}
                    />
                  </div>
                  <div className="fn-budget-labels">
                    <span>0%</span>
                    <span className="fn-budget-midmark">50%</span>
                    <span>100%</span>
                  </div>
                </div>
              )}

              {/* Combo area chart */}
              {chartData.length > 0 ? (
                <div className="fn-chart-card">
                  <div className="fn-chart-header">
                    <div>
                      <h3 className="fn-chart-title">Revenue vs Expenses Over Time</h3>
                      <p className="fn-chart-sub">Period-wise comparison</p>
                    </div>
                    <div className="fn-chart-legend">
                      <span><span className="fn-dot" style={{ background: "#3DBA7E" }} />Revenue</span>
                      <span><span className="fn-dot" style={{ background: "#BFA054" }} />Expenses</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fnRevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3DBA7E" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3DBA7E" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="fnExpGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#BFA054" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#BFA054" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(191,160,84,0.08)" vertical={false} />
                      <XAxis dataKey="label" stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} />
                      <YAxis stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} tickFormatter={fmtCurrency} />
                      <Tooltip {...tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, ""]} />
                      <Area type="monotone" dataKey="revenue"  stroke="#3DBA7E" strokeWidth={2.5} fillOpacity={1} fill="url(#fnRevGrad)"  name="Revenue"  />
                      <Area type="monotone" dataKey="expenses" stroke="#BFA054" strokeWidth={2.5} fillOpacity={1} fill="url(#fnExpGrad)" name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="fn-empty-chart">
                  <span>📭</span>
                  <p>No data available to display chart</p>
                </div>
              )}
            </>
          )}

          {/* ══════════ REVENUE TABLE ══════════ */}
          {activeTab === "revenue" && (
            <>
              <div className="fn-section-label">Revenue Transactions</div>
              <div className="fn-table-card">
                <div className="fn-table-header">
                  <div className="fn-table-meta">
                    <span className="fn-table-count">{revenues.length} records</span>
                    <span className="fn-table-total">Total: ₹{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="fn-table-wrap">
                  <table className="fn-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title / Source</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenues.length === 0 ? (
                        <tr><td colSpan={6} className="fn-empty-row">No revenue records found</td></tr>
                      ) : (
                        revenues.map((r, i) => (
                          <tr key={r._id || i}>
                            <td className="fn-td-num">{i + 1}</td>
                            <td className="fn-td-title">
                              <span className="fn-td-dot fn-dot-green" />
                              {r.title || r.source || r.description || r.name || "—"}
                            </td>
                            <td><span className="fn-badge fn-badge-green">{r.category || r.type || "Revenue"}</span></td>
                            <td className="fn-td-date">{fmtDate(r.date || r.createdAt)}</td>
                            <td className="fn-td-amount fn-amount-green">₹{Number(r.amount ?? r.value ?? 0).toLocaleString()}</td>
                            <td>
                              <span className={`fn-badge ${r.status === "pending" ? "fn-badge-gold" : "fn-badge-green"}`}>
                                {r.status || "Received"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══════════ EXPENSES TABLE ══════════ */}
          {activeTab === "expenses" && (
            <>
              <div className="fn-section-label">Expense Records</div>
              <div className="fn-table-card">
                <div className="fn-table-header">
                  <div className="fn-table-meta">
                    <span className="fn-table-count">{expenses.length} records</span>
                    <span className="fn-table-total fn-total-exp">Total: ₹{totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
                <div className="fn-table-wrap">
                  <table className="fn-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title / Description</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.length === 0 ? (
                        <tr><td colSpan={6} className="fn-empty-row">No expense records found</td></tr>
                      ) : (
                        expenses.map((e, i) => (
                          <tr key={e._id || i}>
                            <td className="fn-td-num">{i + 1}</td>
                            <td className="fn-td-title">
                              <span className="fn-td-dot fn-dot-gold" />
                              {e.title || e.description || e.name || "—"}
                            </td>
                            <td><span className="fn-badge fn-badge-gold">{e.category || e.type || "Expense"}</span></td>
                            <td className="fn-td-date">{fmtDate(e.date || e.createdAt)}</td>
                            <td className="fn-td-amount fn-amount-gold">₹{Number(e.amount ?? e.value ?? 0).toLocaleString()}</td>
                            <td>
                              <span className={`fn-badge ${
                                e.status === "pending"  ? "fn-badge-gold" :
                                e.status === "rejected" ? "fn-badge-red"  : "fn-badge-green"
                              }`}>
                                {e.status || "Approved"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {chartData.length > 0 && (
                <div className="fn-chart-card" style={{ marginTop: "24px" }}>
                  <div className="fn-chart-header">
                    <div>
                      <h3 className="fn-chart-title">Expense Breakdown</h3>
                      <p className="fn-chart-sub">Monthly spending trend</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={36}>
                      <defs>
                        <linearGradient id="fnExpBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#BFA054" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#BFA054" stopOpacity={0.6}  />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(191,160,84,0.08)" vertical={false} />
                      <XAxis dataKey="label" stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} />
                      <YAxis stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} tickFormatter={fmtCurrency} />
                      <Tooltip {...tooltipStyle} formatter={(v) => [`₹${v.toLocaleString()}`, "Expenses"]} cursor={{ fill: "rgba(191,160,84,0.05)" }} />
                      <Bar dataKey="expenses" fill="url(#fnExpBarGrad)" radius={[8, 8, 0, 0]} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Financials;