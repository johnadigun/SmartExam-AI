
import React from "react";

function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleAccess,
}) {
  if (!users || users.length === 0) {
    return (
      <div className="no-users">
        <div className="no-users-icon">
          👤
        </div>

        <h3>
          No Students Found
        </h3>

        <p>
          There are currently no
          students matching your search.
        </p>
      </div>
    );
  }

  return (
    <div className="users-table-container">

      <table className="users-table">

        <thead>
          <tr>
            <th>
              Name
            </th>

            <th>
              Email
            </th>

            <th>
              Phone
            </th>

            <th>
              Role
            </th>

            <th>
              CBT Access
            </th>

            <th>
              Created
            </th>

            <th>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user._id}>

              <td>
                <strong>
                  {user.firstName || ""}
                  {" "}
                  {user.middleName || ""}
                  {" "}
                  {user.lastName || ""}
                </strong>
              </td>

              <td>
                {user.email || "-"}
              </td>

              <td>
                {user.phone || "-"}
              </td>

              <td>
                <span className="role-badge student">
                  Student
                </span>
              </td>

              <td>
                <span
                  className={
                    user.cbtAccess
                      ? "status enabled"
                      : "status disabled"
                  }
                >
                  {user.cbtAccess
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </td>

              <td>
                {user.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>

                <div className="user-actions">

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() =>
                      onEdit(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="access-btn"
                    onClick={() =>
                      onToggleAccess(
                        user._id
                      )
                    }
                  >
                    {user.cbtAccess
                      ? "Disable CBT"
                      : "Enable CBT"}
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      onDelete(
                        user._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default UsersTable;