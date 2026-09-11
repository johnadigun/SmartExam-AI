import React from "react";

function BulkUploadPreview({
  preview,
  result,
}) {

  return (

    <div className="bulk-preview">

      {/* ==========================================
          PREVIEW
      ========================================== */}

      {preview.length > 0 && (

        <>

          <h2>

            Preview ({preview.length} Questions)

          </h2>

          <div className="preview-table">

            <table>

              <thead>

                <tr>

                  <th>#</th>

                  <th>Question</th>

                  <th>Options</th>

                  <th>Answer</th>

                  <th>Difficulty</th>

                </tr>

              </thead>

              <tbody>

                {preview.map((question, index) => (

                  <tr key={index}>

                    <td>{index + 1}</td>

                    <td>

                      {question.question}

                    </td>

                    <td>

                      {Array.isArray(question.options)

                        ? question.options.join(", ")

                        : "-"}

                    </td>

                    <td>

                      {question.answer}

                    </td>

                    <td>

                      {question.difficulty || "medium"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </>

      )}

      {/* ==========================================
          IMPORT RESULT
      ========================================== */}

      {result && result.summary && (

        <div className="upload-summary">

          <h2>

            Upload Summary

          </h2>

          <table>

            <tbody>

              <tr>

                <td>Total Questions</td>

                <td>

                  {result.summary.total}

                </td>

              </tr>

              <tr>

                <td>Imported</td>

                <td>

                  {result.summary.imported}

                </td>

              </tr>

              <tr>

                <td>Skipped</td>

                <td>

                  {result.summary.skipped}

                </td>

              </tr>

              <tr>

                <td>Subject</td>

                <td>

                  {result.summary.subject}

                </td>

              </tr>

              <tr>

                <td>Category</td>

                <td>

                  {result.summary.category}

                </td>

              </tr>

              <tr>

                <td>Exam Board</td>

                <td>

                  {result.summary.examBoard}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default BulkUploadPreview;