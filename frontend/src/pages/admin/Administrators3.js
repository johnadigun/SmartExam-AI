import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";
import "./QuestionManager.css";

function Administrators() {
  const token = localStorage.getItem("token");

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "admin",
  });

  const loadAdmins = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/admin/administrators`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
  setAdmins(Array.isArray(data.admins) ? data.admins : []);
} else {
  setAdmins([]);
  alert(data.message || "Unable to load administrators.");
}
    } catch (err) {
      console.log(err);
      alert("Unable to load administrators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 // ======================================
// EDIT ADMIN
// ======================================

const editAdmin = (admin) => {
  alert("Edit Administrator module is next.");
};

// ======================================
// RESET PASSWORD
// ======================================

// ======================================
// DELETE ADMIN
// ======================================

const deleteAdmin = async (id) => {

  if (!window.confirm("Delete this administrator?")) {
    return;
  }

  try {

    const response = await fetch(
      `${BASE_URL}/admin/administrators/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      loadAdmins();
    }

  } catch (err) {

    console.log(err);

    alert("Unable to delete administrator.");

  }

};

  if (loading) {
    return <div>Loading Administrators...</div>;
  }

  return (
    <div className="question-manager">

      <h2>Administrators</h2>

      <div className="qm-filters">

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          name="middleName"
          placeholder="Middle Name"
          value={form.middleName}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

 const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

// ======================================
// CREATE ADMINISTRATOR
// ======================================

const createAdmin = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/admin/administrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        role: "admin",
      });

      loadAdmins();
    }

  } catch (err) {
    console.log(err);
    alert("Unable to create administrator.");
  }
};

// ======================================
// EDIT ADMIN
// ======================================

const editAdmin = (admin) => {
  alert("Edit Administrator module is next.");
};

// ======================================
// RESET PASSWORD
// ======================================

const resetPassword = (admin) => {
  alert(`Reset password for ${admin.email}`);
};

// ======================================
// DELETE ADMIN
// ======================================

const deleteAdmin = async (id) => {

  if (!window.confirm("Delete this administrator?")) {
    return;
  }

  try {

    const response = await fetch(
      `${BASE_URL}/admin/administrators/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      loadAdmins();
    }

  } catch (err) {

    console.log(err);
    alert("Unable to delete administrator.");

  }

};
      </div>

      <table className="qm-table">

        <thead>

         <tr>
  <th>Name</th>
  <th>Email</th>
  <th>Phone</th>
  <th>Role</th>
  <th>Actions</th>
</tr>

        </thead>

<tbody>

  {admins.length === 0 ? (

    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>
        No administrators found.
      </td>
    </tr>

  ) : (

    admins.map((admin) => (

      <tr key={admin._id}>

        <td>
          {admin.firstName} {admin.middleName} {admin.lastName}
        </td>

        <td>{admin.email}</td>

        <td>{admin.phone}</td>

       <td>{admin.role}</td>

<td>

  <button
    className="edit-btn"
    onClick={() => editAdmin(admin)}
  >
    Edit
  </button>

  <button
    className="reset-btn"
    onClick={() => resetPassword(admin)}
  >
    Reset Password
  </button>

  {admin.role !== "super-admin" && (

    <button
      className="delete-btn"
      onClick={() => deleteAdmin(admin._id)}
    >
      Delete
    </button>

  )}

</td>

      </tr>

    ))

  )}

</tbody>
      </table>

    </div>
  );
}

export default Administrators;