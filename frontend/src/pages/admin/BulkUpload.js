import React, { useState } from "react";
import BASE_URL from "../../api/api";

import "./BulkUpload.css";

import BulkUploadDropZone from "./BulkUploadDropZone";
import BulkUploadPreview from "./BulkUploadPreview";

function BulkUpload() {

  /* ==========================================
     STATES
  ========================================== */

  const [subject, setSubject] = useState("");

  const [category, setCategory] = useState("");

  const [examBoard, setExamBoard] =
    useState("JAMB");

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState([]);

  const [uploading, setUploading] =
    useState(false);

  const [result, setResult] = useState(null);

  /* ==========================================
     FILE SELECTED
  ========================================== */

  const handleFileSelected = (selectedFile) => {

    setFile(selectedFile);

    setResult(null);

    if (!selectedFile) {

      setPreview([]);

      return;

    }

    const reader = new FileReader();

    reader.onload = (event) => {

      try {

        const json = JSON.parse(event.target.result);

        if (Array.isArray(json)) {

          setPreview(json);

        } else {

          alert("JSON file must contain an array.");

          setPreview([]);

        }

      } catch (err) {

        console.error(err);

        alert("Invalid JSON file.");

        setPreview([]);

      }

    };

    reader.readAsText(selectedFile);

  };

  /* ==========================================
     RESET
  ========================================== */

  const resetUpload = () => {

    setFile(null);

    setPreview([]);

    setResult(null);

  };
  /* ==========================================
     UPLOAD QUESTIONS
  ========================================== */

  const uploadQuestions = async () => {

    if (!subject) {
      alert("Please select a subject.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!file) {
      alert("Please select a JSON file.");
      return;
    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("subject", subject);
      formData.append("category", category);
      formData.append("examBoard", examBoard);

      const response = await fetch(
        `${BASE_URL}/bulk-upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {

        alert(data.message);

        return;

      }

      setResult(data);

      alert("Bulk upload completed successfully.");

    } catch (err) {

      console.error(err);

      alert("Unable to upload questions.");

    } finally {

      setUploading(false);

    }

  };

  /* ==========================================
     PAGE
  ========================================== */

  return (

    <div className="bulk-upload-page">

      <h1>Bulk Question Upload</h1>

      <div className="bulk-upload-form">

        <div className="form-group">

          <label>Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            placeholder="Example: English"
          />

        </div>

        <div className="form-group">

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="">
              Select Category
            </option>

            <option value="Science">
              Science
            </option>

            <option value="Arts">
              Arts
            </option>

            <option value="Commercial">
              Commercial
            </option>

            <option value="General">
              General
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Exam Board</label>

          <select
            value={examBoard}
            onChange={(e) =>
              setExamBoard(e.target.value)
            }
          >

            <option value="JAMB">JAMB</option>

            <option value="WAEC">WAEC</option>

            <option value="NECO">NECO</option>

            <option value="SCHOOL">SCHOOL</option>

          </select>

        </div>

      </div>

      <BulkUploadDropZone
        file={file}
        onFileSelected={handleFileSelected}
      />

      <BulkUploadPreview
        preview={preview}
        result={result}
      />

      <div className="bulk-actions">

        <button
          className="upload-btn"
          disabled={uploading}
          onClick={uploadQuestions}
        >
          {uploading
            ? "Uploading..."
            : "Upload Questions"}
        </button>

        <button
          className="reset-btn"
          onClick={resetUpload}
        >
          Reset
        </button>

      </div>

    </div>

  );

}

export default BulkUpload;