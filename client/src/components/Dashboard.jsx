import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budgetAllocated: "",
  });

  useEffect(() => {
    fetchUser();
    fetchFeatures();
  }, []);

  const fetchUser = async (req, res) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
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

    console.log("FEATURE RESPONSE:", res.data);

    if (res.data.success) {
      setFeatures(res.data.features);
    }
  } catch (error) {
    console.log(error);
  }
};

  // Transform features into stats format
  const getStats = () => {
    const stats = [];
    
    features.forEach((feature) => {
      feature.metrics.forEach((metric) => {
        // Get icon based on feature name
        const icon = getFeatureIcon(feature.featureName);
        
        stats.push({
          icon: icon,
          title: metric.name,
          value: metric.value !== null ? metric.value.toLocaleString() : "—",
          delta: metric.periodType || "",
          featureName: feature.featureName
        });
      });
    });
    
    return stats;
  };

  // Helper function to assign icons based on feature name
  const getFeatureIcon = (featureName) => {
    const iconMap = {
      "Accidents": "⚠️",
      "Electricity Bill": "⚡",
      "Revenue": "💰",
      "Expenses": "💳",
      "Employees": "👥",
      "Projects": "📊",
      "Sales": "📈",
      "Inventory": "📦",
      "default": "📌"
    };
    
    return iconMap[featureName] || iconMap.default;
  };

  const organizationId = user?.organizationId;

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/getalldepartment?organizationId=${organizationId}`
      );
      setDepartments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/departments/createdepartment", {
        organizationId,
        name: formData.name,
        description: formData.description,
        budgetAllocated: Number(formData.budgetAllocated),
      });
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

  const logout = async (req, res) => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const stats = getStats();
  console.log("Features:", features);
  console.log("Stats:", stats);

  return (
    <>
      <div className="db-root">
        {/* SIDEBAR */}
        <div className="db-sidebar">
          <div className="db-sidebar-logo">
            <div className="db-brand-mark">R</div>
            <span className="db-brand-name">RevenueRadar</span>
          </div>

          <div className="db-nav-label">Navigation</div>

          <ul className="db-menu">
            <li className="active">
              <span className="db-menu-icon">⬡</span> Dashboard
            </li>
            <li onClick={fetchDepartments}>
              <span className="db-menu-icon">🏢</span> Departments
            </li>
            <li>
              <span className="db-menu-icon">📈</span> Analytics
            </li>
            <li>
              <span className="db-menu-icon">💳</span> Expenses
            </li>
            <li>
              <span className="db-menu-icon">⚙</span> Settings
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
              <h2>Executive Overview</h2>
              <div className="db-topbar-sub">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <div className="db-topbar-right">
              <div className="db-live">
                <div className="db-live-dot" />
                Live
              </div>
              <button className="db-btn db-btn-ghost" onClick={fetchDepartments}>
                Load Departments
              </button>
              <button className="db-btn db-btn-solid" onClick={() => setShowForm(true)}>
                + New Department
              </button>
            </div>
          </div>

          {/* SCROLL AREA */}
          <div className="db-scroll">

            {/* STATS */}
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

            {/* DEPARTMENTS */}
            {departments.length > 0 && (
              <>
                <div className="db-section-label">Departments</div>
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
                      <div className="db-dept-budget">₹ {dept.budgetAllocated?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ACTIVITY */}
            <div className="db-section-label">Recent Activity</div>
            <div className="db-activity">
              <ul className="db-activity-list">
                <li className="db-activity-item">New user registered</li>
                <li className="db-activity-item">Expense approved</li>
                <li className="db-activity-item">Payment received</li>
                <li className="db-activity-item">Backup completed</li>
              </ul>
            </div>

          </div>
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
                  <button type="button" className="db-modal-cancel" onClick={() => setShowForm(false)}>
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
    </>
  );
};

export default Dashboard;