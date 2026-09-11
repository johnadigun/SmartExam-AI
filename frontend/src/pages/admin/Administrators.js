
import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";
import "./QuestionManager.css";

function Administrators() {
  const token = localStorage.getItem("token");

  /* =========================================================
     ADMINISTRATORS
  ========================================================= */

  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  /* =========================================================
     CREATE / EDIT FORM
  ========================================================= */

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    role: "school-admin",
  });

  /* =========================================================
     EDIT MODE
  ========================================================= */

  const [editingAdmin, setEditingAdmin] = useState(null);

  /* =========================================================
     RESET PASSWORD
  ========================================================= */

  const [resetAdmin, setResetAdmin] = useState(null);

  const [newPassword, setNewPassword] = useState("");

  const [resettingPassword, setResettingPassword] =
    useState(false);

  /* =========================================================
     LOAD ADMINISTRATORS
  ========================================================= */

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
        setAdmins(
          Array.isArray(data.administrators)
            ? data.administrators
            : []
        );
      } else {
        setAdmins([]);

        alert(
          data.message ||
            "Unable to load administrators."
        );
      }
    } catch (err) {
      console.error(
        "LOAD ADMINISTRATORS ERROR:",
        err
      );

      alert(
        "Unable to load administrators."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadAdmins();
  }, []);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      role: "school-admin",
    });

    setEditingAdmin(null);
  };

  /* =========================================================
     CREATE ADMINISTRATOR
  ========================================================= */

  const createAdmin = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert(
        "First name, last name, email and password are required."
      );

      return;
    }

    if (form.password.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${BASE_URL}/admin/administrators`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            firstName: form.firstName.trim(),

            middleName:
              form.middleName.trim(),

            lastName: form.lastName.trim(),

            phone: form.phone.trim(),

            email:
              form.email.trim().toLowerCase(),

            password: form.password,

            role: form.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to create administrator."
        );

        return;
      }

      alert(
        "Administrator created successfully."
      );

      resetForm();

      await loadAdmins();
    } catch (err) {
      console.error(
        "CREATE ADMINISTRATOR ERROR:",
        err
      );

      alert(
        "Unable to create administrator."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     START EDIT
  ========================================================= */

  const editAdmin = (admin) => {
    setEditingAdmin(admin);

    setResetAdmin(null);

    setForm({
      firstName:
        admin.firstName || "",

      middleName:
        admin.middleName || "",

      lastName:
        admin.lastName || "",

      phone:
        admin.phone || "",

      email:
        admin.email || "",

      password: "",

      role:
        admin.role || "school-admin",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     UPDATE ADMINISTRATOR
  ========================================================= */

  const updateAdmin = async () => {
    if (!editingAdmin) {
      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim()
    ) {
      alert(
        "First name, last name and email are required."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${BASE_URL}/admin/administrators/${editingAdmin._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            middleName:
              form.middleName.trim(),

            lastName:
              form.lastName.trim(),

            phone:
              form.phone.trim(),

            email:
              form.email.trim().toLowerCase(),

            role: form.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to update administrator."
        );

        return;
      }

      alert(
        "Administrator updated successfully."
      );

      resetForm();

      await loadAdmins();
    } catch (err) {
      console.error(
        "UPDATE ADMINISTRATOR ERROR:",
        err
      );

      alert(
        "Unable to update administrator."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     RESET PASSWORD WINDOW
  ========================================================= */

  const openResetPassword = (admin) => {
    setEditingAdmin(null);

    setResetAdmin(admin);

    setNewPassword("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     CANCEL RESET PASSWORD
  ========================================================= */

  const cancelResetPassword = () => {
    setResetAdmin(null);

    setNewPassword("");
  };

  /* =========================================================
     RESET ADMINISTRATOR PASSWORD
  ========================================================= */

  const resetPassword = async () => {
    if (!resetAdmin) {
      return;
    }

    if (!newPassword.trim()) {
      alert(
        "Please enter a new password."
      );

      return;
    }

    if (newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters long."
      );

      return;
    }

    try {
      setResettingPassword(true);

      const response = await fetch(
        `${BASE_URL}/admin/administrators/${resetAdmin._id}/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to reset administrator password."
        );

        return;
      }

      alert(
        "Administrator password reset successfully."
      );

      cancelResetPassword();
    } catch (err) {
      console.error(
        "RESET PASSWORD ERROR:",
        err
      );

      alert(
        "Unable to reset administrator password."
      );
    } finally {
      setResettingPassword(false);
    }
  };

  /* =========================================================
     DELETE ADMINISTRATOR
  ========================================================= */

  const deleteAdmin = async (id) => {
    const administrator = admins.find(
      (admin) => admin._id === id
    );

    if (
      administrator &&
      administrator.role === "super-admin"
    ) {
      alert(
        "Super Administrator cannot be deleted."
      );

      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this administrator?"
      )
    ) {
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

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to delete administrator."
        );

        return;
      }

      alert(
        "Administrator deleted successfully."
      );

      await loadAdmins();
    } catch (err) {
      console.error(
        "DELETE ADMINISTRATOR ERROR:",
        err
      );

      alert(
        "Unable to delete administrator."
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="question-manager">
        <h2>Loading Administrators...</h2>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="question-manager">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <h2>
        {editingAdmin
          ? "Edit Administrator"
          : "Administrators"}
      </h2>

      {/* =====================================================
          RESET PASSWORD PANEL
      ===================================================== */}

      {resetAdmin && (
        <div
          style={{
            background: "#f8f9fa",
            border: "1px solid #d9dee3",
            borderRadius: "8px",
            padding: "18px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              marginBottom: "8px",
              color: "#343a40",
            }}
          >
            Reset Administrator Password
          </h3>

          <p
            style={{
              marginBottom: "15px",
              color: "#555",
            }}
          >
            Reset password for{" "}
            <strong>
              {resetAdmin.email}
            </strong>
          </p>

          <div
            className="qm-filters"
          >
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

            <button
              className="add-btn"
              onClick={resetPassword}
              disabled={resettingPassword}
            >
              {resettingPassword
                ? "Resetting..."
                : "Reset Password"}
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={
                cancelResetPassword
              }
              disabled={resettingPassword}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT FORM
      ===================================================== */}

      {!resetAdmin && (
        <div className="qm-filters">

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={form.middleName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          {!editingAdmin && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="school-admin">
              School Administrator
            </option>

            <option value="super-admin">
              Super Administrator
            </option>
          </select>

          {editingAdmin ? (
            <>
              <button
                className="add-btn"
                onClick={updateAdmin}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Edit
              </button>
            </>
          ) : (
            <button
              className="add-btn"
              onClick={createAdmin}
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create Administrator"}
            </button>
          )}

        </div>
      )}

      {/* =====================================================
          ADMINISTRATORS TABLE
      ===================================================== */}

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
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                }}
              >
                No administrators found.
              </td>
            </tr>

          ) : (

            admins.map((admin) => (

              <tr key={admin._id}>

                <td>
                  {admin.firstName}{" "}
                  {admin.middleName}{" "}
                  {admin.lastName}
                </td>

                <td>
                  {admin.email}
                </td>

                <td>
                  {admin.phone || "-"}
                </td>

                <td>
                  {admin.role ===
                  "super-admin"
                    ? "Super Administrator"
                    : "School Administrator"}
                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editAdmin(admin)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="reset-btn"
                    onClick={() =>
                      openResetPassword(
                        admin
                      )
                    }
                  >
                    Reset Password
                  </button>

                  {admin.role !==
                    "super-admin" && (

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteAdmin(
                          admin._id
                        )
                      }
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