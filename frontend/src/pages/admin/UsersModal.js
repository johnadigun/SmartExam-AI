
import React, {
  useEffect,
  useState,
} from "react";

function UsersModal({
  user,
  saving,
  onSave,
  onClose,
}) {
  const [form, setForm] =
    useState({
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      email: "",
      cbtAccess: false,
    });

  /* ==========================================
     LOAD USER
  ========================================== */

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      firstName:
        user.firstName || "",

      middleName:
        user.middleName || "",

      lastName:
        user.lastName || "",

      phone:
        user.phone || "",

      email:
        user.email || "",

      cbtAccess:
        Boolean(user.cbtAccess),
    });
  }, [user]);

  /* ==========================================
     HANDLE CHANGE
  ========================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================
     CBT ACCESS
  ========================================== */

  const handleAccess = (e) => {
    setForm((prev) => ({
      ...prev,
      cbtAccess:
        e.target.checked,
    }));
  };

  /* ==========================================
     SAVE
  ========================================== */

  const handleSubmit = () => {
    if (!form.firstName.trim()) {
      alert(
        "First name is required."
      );

      return;
    }

    if (!form.lastName.trim()) {
      alert(
        "Last name is required."
      );

      return;
    }

    if (!form.email.trim()) {
      alert(
        "Email is required."
      );

      return;
    }

    onSave({
      ...user,
      ...form,
    });
  };

  /* ==========================================
     MODAL
  ========================================== */

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="modal">

        <div className="modal-header">

          <div>
            <h2>
              Edit Student
            </h2>

            <p>
              Update student account
              information.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>

        </div>

        {/* ==================================
            FIRST NAME
        ================================== */}

        <label>
          First Name
        </label>

        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          disabled={saving}
        />

        {/* ==================================
            MIDDLE NAME
        ================================== */}

        <label>
          Middle Name
        </label>

        <input
          type="text"
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          disabled={saving}
        />

        {/* ==================================
            LAST NAME
        ================================== */}

        <label>
          Last Name
        </label>

        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          disabled={saving}
        />

        {/* ==================================
            PHONE
        ================================== */}

        <label>
          Phone Number
        </label>

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          disabled={saving}
        />

        {/* ==================================
            EMAIL
        ================================== */}

        <label>
          Email Address
        </label>

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={saving}
        />

        {/* ==================================
            ROLE
        ================================== */}

        <label>
          Account Type
        </label>

        <input
          type="text"
          value="Student"
          disabled
          readOnly
        />

        {/* ==================================
            CBT ACCESS
        ================================== */}

        <div className="checkbox-row">

          <input
            id="cbtAccess"
            type="checkbox"
            checked={
              form.cbtAccess
            }
            onChange={
              handleAccess
            }
            disabled={saving}
          />

          <label
            htmlFor="cbtAccess"
          >
            Allow CBT Access
          </label>

        </div>

        {/* ==================================
            BUTTONS
        ================================== */}

        <div className="modal-buttons">

          <button
            type="button"
            className="save-btn"
            disabled={saving}
            onClick={
              handleSubmit
            }
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default UsersModal;