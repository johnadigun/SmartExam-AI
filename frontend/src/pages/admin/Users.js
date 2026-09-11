
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import BASE_URL from "../../api/api";

import "./Users.css";

import UsersTable from "./UsersTable";
import UsersModal from "./UsersModal";

function Users() {
  /* ==========================================
     AUTH
  ========================================== */

  const token = localStorage.getItem("token");

  /* ==========================================
     STATES
  ========================================== */

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  /* ==========================================
     LOAD USERS
  ========================================== */

  const loadUsers = async () => {
    try {
      setLoading(true);

      if (!token) {
        alert("Administrator session has expired.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to load users."
        );

        return;
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (err) {
      console.error(
        "LOAD USERS ERROR:",
        err
      );

      alert("Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ==========================================
     SEARCH
  ========================================== */

  const filteredUsers = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      const firstName =
        user.firstName?.toLowerCase() || "";

      const middleName =
        user.middleName?.toLowerCase() || "";

      const lastName =
        user.lastName?.toLowerCase() || "";

      const email =
        user.email?.toLowerCase() || "";

      const phone =
        user.phone?.toLowerCase() || "";

      return (
        firstName.includes(keyword) ||
        middleName.includes(keyword) ||
        lastName.includes(keyword) ||
        email.includes(keyword) ||
        phone.includes(keyword)
      );
    });
  }, [search, users]);

  /* ==========================================
     OPEN EDIT
  ========================================== */

  const editUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  /* ==========================================
     CLOSE MODAL
  ========================================== */

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  /* ==========================================
     SAVE USER
  ========================================== */

  const saveUser = async (updatedUser) => {
    try {
      setSaving(true);

      const response = await fetch(
        `${BASE_URL}/admin/users/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName:
              updatedUser.firstName,
            middleName:
              updatedUser.middleName,
            lastName:
              updatedUser.lastName,
            phone:
              updatedUser.phone,
            email:
              updatedUser.email,
            cbtAccess:
              updatedUser.cbtAccess,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to update user."
        );

        return;
      }

      alert(
        "User updated successfully."
      );

      closeModal();

      await loadUsers();
    } catch (err) {
      console.error(
        "UPDATE USER ERROR:",
        err
      );

      alert("Unable to update user.");
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================
     TOGGLE CBT ACCESS
  ========================================== */

  const toggleAccess = async (userId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}/cbt-access`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to update CBT access."
        );

        return;
      }

      await loadUsers();
    } catch (err) {
      console.error(
        "TOGGLE CBT ACCESS ERROR:",
        err
      );

      alert(
        "Unable to update CBT access."
      );
    }
  };

  /* ==========================================
     DELETE USER
  ========================================== */

  const deleteUser = async (userId) => {
    const ok = window.confirm(
      "Delete this student permanently?\n\nThis action cannot be undone."
    );

    if (!ok) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}`,
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
            "Unable to delete user."
        );

        return;
      }

      alert(
        "User deleted successfully."
      );

      await loadUsers();
    } catch (err) {
      console.error(
        "DELETE USER ERROR:",
        err
      );

      alert("Unable to delete user.");
    }
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="users-loading">
        <div className="users-loading-box">
          <div className="users-spinner"></div>

          <h2>
            Loading Users...
          </h2>

          <p>
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================
     PAGE
  ========================================== */

  return (
    <div className="users-manager">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="users-header">

        <div>
          <h1>
            User Management
          </h1>

          <p>
            Manage registered student
            accounts and CBT access.
          </p>
        </div>

        <div className="users-search">

          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="users-summary">

        <div className="users-summary-card">
          <span>
            Total Students
          </span>

          <strong>
            {users.length}
          </strong>
        </div>

        <div className="users-summary-card">
          <span>
            Search Results
          </span>

          <strong>
            {filteredUsers.length}
          </strong>
        </div>

        <div className="users-summary-card">
          <span>
            CBT Enabled
          </span>

          <strong>
            {
              users.filter(
                (user) =>
                  user.cbtAccess
              ).length
            }
          </strong>
        </div>

      </div>

      {/* ======================================
          TABLE
      ====================================== */}

      <UsersTable
        users={filteredUsers}
        onEdit={editUser}
        onDelete={deleteUser}
        onToggleAccess={
          toggleAccess
        }
      />

      {/* ======================================
          MODAL
      ====================================== */}

      {showModal &&
        selectedUser && (
          <UsersModal
            user={selectedUser}
            saving={saving}
            onSave={saveUser}
            onClose={closeModal}
          />
        )}

    </div>
  );
}

export default Users;