import React, { useState, useEffect } from "react";
import "../styles/Admin.css";
import axios from "axios";


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [organizationId, setOrganizationId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    departmentId: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch logged in admin + users
  const fetchUsers = async () => {
    try {
      const me = await axios.get(
        "http://localhost:5000/api/auth/me",
        { withCredentials: true }
      );

      const orgId = me.data.user.organizationId;
      const role = me.data.user.role;

      if (role !== "ADMIN") {
        alert("Access Denied");
        return;
      }

      setOrganizationId(orgId);

      const response = await axios.get(
        `http://localhost:5000/api/auth/users?organizationId=${orgId}`,
        { withCredentials: true }
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        ...formData,
        organizationId
      },
      { withCredentials: true }
    );

    const newUser = res.data.user;

    // If role is HOD → update department
    if (formData.role === "HOD" && formData.departmentId) {
      await axios.put(
        `http://localhost:5000/api/departments/update/${formData.departmentId}`,
        {
          headId: newUser._id
        },
        { withCredentials: true }
      );
    }

    window.dispatchEvent(
      new CustomEvent("flash", {
        detail: {
          type: "success",
          message: "User Added Successfully"
        }
      })
    );

    setFormData({
      name: "",
      email: "",
      password: "",
      role: "ADMIN",
      departmentId: null
    });

    fetchUsers();

  } catch (error) {
    console.error(error);
  }
};

  const logout = async (req , res) => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout" , {} , {
        withCredentials: true
      })

      window.dispatchEvent(
        new CustomEvent("flash" , {
          detail: {
            type: "success",
            message: "Signed out Successfully"
          }
        })
      )

      window.location.href = "/login"
    } catch (error) {
      console.log(error)
    }
  }
  const assignDepartment = async (userId) => {
  try {

    const departmentId = prompt("Enter Department ID");

    if(!departmentId) return;

    await axios.put(
      `http://localhost:5000/api/auth/edit/${userId}`,
      {
        departmentId
      },
      { withCredentials: true }
    );

    await axios.put(
      `http://localhost:5000/api/departments/update/${departmentId}`,
      {
        headId: userId
      },
      { withCredentials: true }
    );

    fetchUsers();

  } catch (error) {
    console.log(error);
  }
};

  const getRoleBadgeClass = (role) => {
    return `role-badge ${role.toUpperCase()}`;
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Executive <span>Command Center</span></h1>
        <p>Manage your organization's users and access permissions</p>
      </div>

      <div className="admin-grid">
        {/* Add User Card */}
        <div className="admin-card" style={{ "--card-index": 0 }}>
          <h2>Add New User</h2>

          <form className="admin-form" onSubmit={(e) => { e.preventDefault(); addUser(); }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="user@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="ADMIN">Administrator</option>
                <option value="HOD">Head of Department</option>
                <option value="CEO">Chief Executive Officer</option>
              </select>
            </div>

            <button type="submit" className="admin-btn">
              Create User
            </button>

            
          </form>
          <button
              onClick={logout}
              className="admin-btn"
              style={{ marginTop: "15px", background: "#e74c3c" }}
            >
              SignOut
            </button>
        </div>

        {/* Users List Card */}
        <div className="admin-card" style={{ "--card-index": 1 }}>
          <h2>Active Users</h2>

          {users.length > 0 ? (
            <div className="user-table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className="status-indicator">
                          <span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}></span>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{user.departmentId?.name || "None"}</td>
                      <td>
                        {user.role === "HOD" && (
                          <button className="assign-btn" onClick={() => assignDepartment(user._id)}>
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>No users found in your organization</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;