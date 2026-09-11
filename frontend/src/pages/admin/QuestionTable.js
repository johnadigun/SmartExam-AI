
import React from "react";

function QuestionTable({
questions,
onEdit,
onDelete,
}) {
if (!questions || questions.length === 0) {
return ( <div className="no-data">
No questions found. </div>
);
}

return ( <div className="question-table-container">


  <table className="question-table">

    <thead>
      <tr>
        <th>No.</th>
        <th>Subject</th>
        <th>Category</th>
        <th>Question</th>
        <th>Answer</th>
        <th>Difficulty</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

      {questions.map((question, index) => (
        <tr key={question._id}>

          <td className="question-number">
            {index + 1}
          </td>

          <td>
            {question.subject || "—"}
          </td>

          <td>
            {question.category || "—"}
          </td>

          <td className="question-cell">
            {question.question || "—"}
          </td>

          <td className="answer-cell">
            {question.answer || "—"}
          </td>

          <td>
            <span
              className={`badge ${
                question.difficulty || "medium"
              }`}
            >
              {question.difficulty || "medium"}
            </span>
          </td>

          <td className="actions">

            <button
              type="button"
              className="edit-btn"
              onClick={() =>
                onEdit(question)
              }
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={() =>
                onDelete(question._id)
              }
            >
              Delete
            </button>

          </td>

        </tr>
      ))}

    </tbody>

  </table>

</div>


);
}

export default QuestionTable;
