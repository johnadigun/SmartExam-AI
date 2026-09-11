
import React, { useEffect, useState } from "react";
import BASE_URL from "../../api/api";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/admin/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStudents(data.students || []);
      } else {
        alert(data.message || "Unable to load students.");
      }
    } catch (err) {
      console.error("FETCH STUDENTS ERROR:", err);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <div>
          <h1>Students</h1>
          <p>Manage registered student accounts.</p>
        </div>
      </div>

      <div className="students-summary">
        <strong>Total Students:</strong>{" "}
        {students.length}
      </div>

      {loading ? (
        <div className="students-message">
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="students-message">
          No students found.
        </div>
      ) : (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>CBT Access</th>
                <th>Registered</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <strong>
                      {student.firstName || ""}{" "}
                      {student.middleName || ""}{" "}
                      {student.lastName || ""}
                    </strong>
                  </td>

                  <td>
                    {student.email || "-"}
                  </td>

                  <td>
                    {student.phone || "-"}
                  </td>

                  <td>
                    <span
                      className={
                        student.cbtAccess
                          ? "student-status enabled"
                          : "student-status disabled"
                      }
                    >
                      {student.cbtAccess
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </td>

                  <td>
                    {student.createdAt
                      ? new Date(
                          student.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default Students;