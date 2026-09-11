
import React from "react";

function formatDate(dateValue) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function ExamsTable({
  exams,
  onEdit,
  onDelete,
  onTogglePublished,
}) {
  if (!exams || exams.length === 0) {
    return (
      <div className="no-exams">
        <div className="empty-exam-icon">
          E
        </div>

        <h3>No Exams Found</h3>

        <p>
          There are no examinations matching
          the current search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="exam-table-container">
      <table className="exam-table">

        <thead>
          <tr>
            <th>Examination</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Questions</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => {
            const questionCount =
              Array.isArray(exam.questions)
                ? exam.questions.length
                : 0;

            const isPublished =
              exam.published === true;

            return (
              <tr key={exam._id}>

                <td>
                  <div className="exam-name-cell">
                    <div className="exam-row-icon">
                      E
                    </div>

                    <div>
                      <strong>
                        {exam.title ||
                          "Untitled Exam"}
                      </strong>

                      <small>
                        ID:{" "}
                        {exam._id
                          ? exam._id.slice(-8)
                          : "—"}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  {exam.subject || "—"}
                </td>

                <td>
                  <span className="category-label">
                    {exam.category || "—"}
                  </span>
                </td>

                <td>
                  <span className="question-count">
                    {questionCount}
                  </span>
                </td>

                <td>
                  {exam.duration || 0} mins
                </td>

                <td>
                  <span
                    className={
                      isPublished
                        ? "status published"
                        : "status draft"
                    }
                  >
                    <span className="status-dot"></span>

                    {isPublished
                      ? "Published"
                      : "Draft"}
                  </span>
                </td>

                <td>
                  {formatDate(
                    exam.createdAt
                  )}
                </td>

                <td>
                  <div className="exam-actions">

                    <button
                      type="button"
                      className="table-action edit-btn"
                      onClick={() =>
                        onEdit(exam)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={
                        isPublished
                          ? "table-action unpublish-btn"
                          : "table-action publish-btn"
                      }
                      onClick={() =>
                        onTogglePublished(
                          exam
                        )
                      }
                    >
                      {isPublished
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      className="table-action delete-btn"
                      onClick={() =>
                        onDelete(exam._id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

export default ExamsTable;