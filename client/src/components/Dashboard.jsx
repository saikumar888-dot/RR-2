import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [features, setFeatures] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");
  const [organizationId, setOrganizationId] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [period, setPeriod] = useState("month");
  const [cashFlow, setCashFlow] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budgetAllocated: "",
  });

  // ─── Initial fetch on mount ───────────────────────────────────────────────
  useEffect(() => {
    fetchUser();
    fetchFeatures();
    fetchTotalRevenue();
    fetchTotalExpense();
    fetchCashFlow(period);
  }, []);

  useEffect(() => {
    fetchCashFlow(period);
  }, [period]);

  // ─── BUG FIX: fetch both activities AND departments once organizationId is known
  //     Previously, fetchDepartments() was only called when the user clicked the
  //     Departments nav item — so navigating Dashboard → Analytics directly left
  //     departments=[] and showed all zeros in the insight cards.
  useEffect(() => {
    if (!organizationId) return;

    const fetchActivities = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/activity/getacts/${organizationId}`
        );
        setActivities(res.data.data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      }
    };

    fetchActivities();
    fetchDepartments(); // ← ensures departments are always pre-loaded
  }, [organizationId]);

  // ─── API helpers ──────────────────────────────────────────────────────────
  const fetchCashFlow = async (selectedPeriod) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/analytics/cashflow?period=${selectedPeriod}`,
        { withCredentials: true }
      );
      setCashFlow(res.data.cashFlow);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/revenue/analytics/total",
        { withCredentials: true }
      );
      setTotalRevenue(res.data.totalRevenue);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalExpense = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/expense/analytics/total",
        { withCredentials: true }
      );
      setTotalExpense(res.data.totalExpense);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      setOrganizationId(res.data.user.organizationId);
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/getcompletefeature/orgdashboard",
        { withCredentials: true }
      );
      if (res.data.success) {
        setFeatures(res.data.features);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/getalldepartment?organizationId=${organizationId}`
      );
      console.log(res.data);
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ─── Stats helpers ────────────────────────────────────────────────────────
  const getFeatureIcon = (featureName) => {
    const iconMap = {
      Accidents: "⚠️",
      "Electricity Bill": "⚡",
      Revenue: "💰",
      Expenses: "💳",
      Employees: "👥",
      Projects: "📊",
      Sales: "📈",
      Inventory: "📦",
      default: "📌",
    };
    return iconMap[featureName] || iconMap.default;
  };

  const getStats = () => {
    const stats = [];

    features.forEach((feature) => {
      feature.metrics.forEach((metric) => {
        stats.push({
          icon: getFeatureIcon(feature.featureName),
          title: metric.name,
          value: metric.value !== null ? metric.value.toLocaleString() : "—",
          delta: metric.periodType || "",
          featureName: feature.featureName,
          rawValue: metric.value,
        });
      });
    });

    if (totalRevenue !== null) {
      stats.push({
        icon: "💰",
        title: "Total Revenue",
        value: `₹ ${totalRevenue.toLocaleString()}`,
        delta: "all time",
        featureName: "Finance",
      });
    }

    if (totalExpense !== null) {
      stats.push({
        icon: "💳",
        title: "Total Expense",
        value: `₹ ${totalExpense.toLocaleString()}`,
        delta: "all time",
        featureName: "Finance",
      });
    }

    if (cashFlow !== null) {
      stats.push({
        icon: "💸",
        title: "Cash Flow",
        value: `₹ ${cashFlow.toLocaleString()}`,
        delta: "all time",
        featureName: "Finance",
      });
    }

    return stats;
  };

  // ─── Form handlers ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/departments/createdepartment",
        {
          organizationId,
          name: formData.name,
          description: formData.description,
          budgetAllocated: Number(formData.budgetAllocated),
        }
      );
      setShowForm(false);
      setFormData({ name: "", description: "", budgetAllocated: "" });
      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      setDepartments(departments.filter((dept) => dept._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // ─── Chart data ───────────────────────────────────────────────────────────
  const generateTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      revenue: 5000 + Math.random() * 50000,
      expenses: 30000 + Math.random() * 30000,
      profit: 20000 + Math.random() * 20000,
    }));
  };

  const getDepartmentBudgetData = () => {
    return departments.map((dept) => ({
      name: dept.name,
      budget: dept.budgetAllocated || 0,
      spent: (dept.budgetAllocated || 0) * (0.5 + Math.random() * 0.4),
    }));
  };

  const getFeatureDistribution = () => {
    const stats = getStats();
    const distribution = {};
    stats.forEach((stat) => {
      if (stat.rawValue && !isNaN(stat.rawValue)) {
        if (!distribution[stat.featureName]) distribution[stat.featureName] = 0;
        distribution[stat.featureName] += stat.rawValue;
      }
    });
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value: Math.abs(value),
    }));
  };

  const COLORS = [
    "#3DBA7E", "#BFA054", "#5B8BF5", "#E05252",
    "#E2C47A", "#7A6030", "#4facfe", "#14b8a6",
  ];

  const stats = getStats();

  // ─── View renderer ────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="period-select"
                style={{ marginRight: "8px", fontWeight: "600", color: "#BFA054" }}
              >
                Select Period:
              </label>
              <select
                id="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #BFA054",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>

            <div className="db-section-label">Key Metrics</div>
            <div className="db-stats">
              {stats.map((stat, index) => (
                <div key={index} className="db-stat-card">
                  <div className="db-stat-icon">{stat.icon}</div>
                  <div className="db-stat-feature">{stat.featureName}</div>
                  <div className="db-stat-label">{stat.title}</div>
                  <div className="db-stat-value">{stat.value}</div>
                  <div className="db-stat-delta">{stat.delta}</div>
                </div>
              ))}
            </div>

            <div className="db-section-label">Recent Activity</div>
            <div className="db-activity">
              <ul className="db-activity-list">
                {activities.map((activity) => (
                  <li key={activity._id} className="db-activity-item">
                    {activity.description}
                  </li>
                ))}
              </ul>
            </div>
          </>
        );

      case "departments":
        return (
          <>
            <div className="db-section-label">All Departments</div>
            {departments.length === 0 ? (
              <div className="db-empty-state">
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
                <h3>No Departments Yet</h3>
                <p>Click "Load Departments" or create your first department</p>
              </div>
            ) : (
              <div className="db-dept-grid">
                {departments.map((dept) => (
                  <div key={dept._id} className="db-dept-card">
                    <button
                      className="db-dept-delete"
                      onClick={() => deleteDepartment(dept._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                    <div className="db-dept-name">{dept.name}</div>
                    <div className="db-dept-desc">{dept.description}</div>
                    <div className="db-dept-budget">
                      ₹ Budget Allocated : {dept.budgetAllocated?.toLocaleString()}
                    </div>
                    <button
                      className="db-dept-financials-btn"
                      onClick={() => navigate(`/departments/${dept._id}/financials`)}
                    >
                      📊 View Financials
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case "analytics": {
        const trendData = generateTrendData();
        const deptBudgetData = getDepartmentBudgetData();
        const featureDistribution = getFeatureDistribution();

        return (
          <>
            {/* Key Insight Cards */}
            <div className="db-insights-grid">
              <div className="db-insight-card db-insight-purple">
                <div className="db-insight-header">
                  <div className="db-insight-icon">🏢</div>
                  <div className="db-insight-trend">↑ 12%</div>
                </div>
                <div className="db-insight-title">Total Departments</div>
                <div className="db-insight-value">{departments.length}</div>
                <div className="db-insight-footer">Active units</div>
              </div>

              <div className="db-insight-card db-insight-pink">
                <div className="db-insight-header">
                  <div className="db-insight-icon">💰</div>
                  <div className="db-insight-trend">↑ 8%</div>
                </div>
                <div className="db-insight-title">Total Budget</div>
                <div className="db-insight-value">
                  ₹{" "}
                  {(
                    departments.reduce(
                      (sum, dept) => sum + (dept.budgetAllocated || 0),
                      0
                    ) / 100000
                  ).toFixed(1)}
                  L
                </div>
                <div className="db-insight-footer">Budget allocated</div>
              </div>

              <div className="db-insight-card db-insight-blue">
                <div className="db-insight-header">
                  <div className="db-insight-icon">📊</div>
                  <div className="db-insight-trend">↑ 15%</div>
                </div>
                <div className="db-insight-title">Active Metrics</div>
                <div className="db-insight-value">{stats.length}</div>
                <div className="db-insight-footer">Tracking points</div>
              </div>

              <div className="db-insight-card db-insight-green">
                <div className="db-insight-header">
                  <div className="db-insight-icon">🎯</div>
                  <div className="db-insight-trend">↑ 5%</div>
                </div>
                <div className="db-insight-title">Avg Budget</div>
                <div className="db-insight-value">
                  ₹{" "}
                  {departments.length > 0
                    ? (
                        Math.round(
                          departments.reduce(
                            (sum, dept) => sum + (dept.budgetAllocated || 0),
                            0
                          ) / departments.length
                        ) / 100000
                      ).toFixed(1) + "L"
                    : "0"}
                </div>
                <div className="db-insight-footer">Per department</div>
              </div>
            </div>

            <div className="db-section-label">Financial Analytics</div>

            {/* Area Chart */}
            <div className="db-chart-card">
              <div className="db-chart-header">
                <div>
                  <h3 className="db-chart-title">Revenue & Expenses Overview</h3>
                  <p className="db-chart-subtitle">6-month performance analysis</p>
                </div>
                <div className="db-chart-badge">Last 6 Months</div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3DBA7E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3DBA7E" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BFA054" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#BFA054" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(191,160,84,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} />
                  <YAxis stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(12,16,24,0.95)", border: "1px solid rgba(191,160,84,0.3)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", padding: "12px 14px", fontFamily: "DM Sans, sans-serif" }} formatter={(v) => [`₹${v.toLocaleString()}`, ""]} labelStyle={{ color: "#E8E4DC", fontSize: "11px", fontWeight: 600, marginBottom: "6px" }} itemStyle={{ color: "#6B7385", fontSize: "11px", fontFamily: "DM Mono, monospace" }} />
                  <Legend wrapperStyle={{ paddingTop: "24px" }} iconType="circle" />
                  <Area type="monotone" dataKey="revenue" stroke="#3DBA7E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" animationDuration={1500} />
                  <Area type="monotone" dataKey="expenses" stroke="#BFA054" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Line + Pie Row */}
            <div className="db-chart-row">
              <div className="db-chart-card">
                <div className="db-chart-header">
                  <div>
                    <h3 className="db-chart-title">Profit Trajectory</h3>
                    <p className="db-chart-subtitle">Growth over time</p>
                  </div>
                  <div className="db-chart-badge db-chart-badge-success">+23%</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3DBA7E" />
                        <stop offset="100%" stopColor="#2a8a5e" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(191,160,84,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} />
                    <YAxis stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(12,16,24,0.95)", border: "1px solid rgba(191,160,84,0.3)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", padding: "12px 14px" }} formatter={(v) => [`₹${v.toLocaleString()}`, ""]} labelStyle={{ color: "#E8E4DC", fontSize: "11px", fontWeight: 600 }} itemStyle={{ color: "#6B7385", fontSize: "11px" }} />
                    <Line type="monotone" dataKey="profit" stroke="url(#profitGradient)" strokeWidth={3} dot={{ fill: "#3DBA7E", r: 5, strokeWidth: 2, stroke: "rgba(12,16,24,0.8)" }} activeDot={{ r: 7, fill: "#3DBA7E" }} name="Profit" animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {featureDistribution.length > 0 && (
                <div className="db-chart-card">
                  <div className="db-chart-header">
                    <div>
                      <h3 className="db-chart-title">Metrics Distribution</h3>
                      <p className="db-chart-subtitle">Breakdown by category</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <defs>
                        {featureDistribution.map((_, index) => (
                          <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.75} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie data={featureDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""} outerRadius={110} innerRadius={65} dataKey="value" animationDuration={1500} paddingAngle={2}>
                        {featureDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#pieGradient${index})`} stroke="rgba(12,16,24,0.9)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "rgba(12,16,24,0.95)", border: "1px solid rgba(191,160,84,0.3)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", padding: "12px 14px" }} itemStyle={{ color: "#E8E4DC", fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Bar Chart */}
            {departments.length > 0 && (
              <>
                <div className="db-section-label">Department Performance</div>
                <div className="db-chart-card">
                  <div className="db-chart-header">
                    <div>
                      <h3 className="db-chart-title">Budget Allocation vs Utilization</h3>
                      <p className="db-chart-subtitle">Department-wise spending analysis</p>
                    </div>
                    <div className="db-chart-legend-custom">
                      <span className="db-legend-item">
                        <span className="db-legend-dot" style={{ background: "#5B8BF5" }}></span>
                        Allocated
                      </span>
                      <span className="db-legend-item">
                        <span className="db-legend-dot" style={{ background: "#BFA054" }}></span>
                        Spent
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={deptBudgetData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barGap={8}>
                      <defs>
                        <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5B8BF5" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#5B8BF5" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#BFA054" stopOpacity={0.95} />
                          <stop offset="100%" stopColor="#BFA054" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(191,160,84,0.08)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} />
                      <YAxis stroke="rgba(191,160,84,0.2)" tick={{ fill: "#6B7385", fontSize: 10, fontFamily: "DM Mono, monospace" }} axisLine={{ stroke: "rgba(191,160,84,0.12)" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(12,16,24,0.95)", border: "1px solid rgba(191,160,84,0.3)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", padding: "12px 14px" }} formatter={(v) => [`₹${v.toLocaleString()}`, ""]} labelStyle={{ color: "#E8E4DC", fontSize: "11px", fontWeight: 600 }} itemStyle={{ color: "#6B7385", fontSize: "11px" }} cursor={{ fill: "rgba(191,160,84,0.05)" }} />
                      <Bar dataKey="budget" fill="url(#budgetGradient)" name="Allocated Budget" radius={[8, 8, 0, 0]} animationDuration={1500} />
                      <Bar dataKey="spent" fill="url(#spentGradient)" name="Spent" radius={[8, 8, 0, 0]} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        );
      }

      default:
        return <div className="db-empty-state">Coming Soon</div>;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="db-root">
      {/* SIDEBAR */}
      <div className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-brand-mark">R</div>
          <span className="db-brand-name">RevenueRadar</span>
        </div>

        <div className="db-nav-label">Navigation</div>

        <ul className="db-menu">
          <li
            className={activeView === "dashboard" ? "active" : ""}
            onClick={() => setActiveView("dashboard")}
          >
            <span className="db-menu-icon">⬡</span> Dashboard
          </li>
          <li
            className={activeView === "departments" ? "active" : ""}
            onClick={() => {
              setActiveView("departments");
              fetchDepartments();
            }}
          >
            <span className="db-menu-icon">🏢</span> Departments
          </li>
          <li
            className={activeView === "analytics" ? "active" : ""}
            onClick={() => setActiveView("analytics")}
          >
            <span className="db-menu-icon">📈</span> Analytics
          </li>
        </ul>

        <div className="db-sidebar-footer">
          <button className="db-logout-btn" onClick={logout}>
            ⎋ &nbsp;Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="db-main">
        {/* TOPBAR */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <h2>
              {activeView === "dashboard" && "Executive Overview"}
              {activeView === "departments" && "Departments"}
              {activeView === "analytics" && "Analytics"}
            </h2>
            <div className="db-topbar-sub">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="db-topbar-right">
            <div className="db-live">
              <div className="db-live-dot" />
              Live
            </div>
            {activeView === "departments" && (
              <button className="db-btn db-btn-ghost" onClick={fetchDepartments}>
                Refresh
              </button>
            )}
            {(activeView === "departments" || activeView === "dashboard") && (
              <button
                className="db-btn db-btn-solid"
                onClick={() => setShowForm(true)}
              >
                + New Department
              </button>
            )}
          </div>
        </div>

        {/* SCROLL AREA */}
        <div className="db-scroll">{renderContent()}</div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="db-modal-overlay">
          <div className="db-modal">
            <h3>Create Department</h3>
            <form onSubmit={createDepartment}>
              <label className="db-field-label">Department Name</label>
              <input
                name="name"
                placeholder="e.g. Engineering"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label className="db-field-label">Description</label>
              <textarea
                name="description"
                placeholder="Brief description of this department..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
              <label className="db-field-label">Budget Allocated (₹)</label>
              <input
                name="budgetAllocated"
                type="number"
                placeholder="e.g. 500000"
                value={formData.budgetAllocated}
                onChange={handleChange}
                required
              />
              <div className="db-modal-actions">
                <button
                  type="button"
                  className="db-modal-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="db-modal-submit">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;