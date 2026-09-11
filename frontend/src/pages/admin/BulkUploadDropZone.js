import React, { useRef, useState } from "react";

function BulkUploadDropZone({
  file,
  onFileSelected,
}) {

  const inputRef = useRef(null);

  const [dragging, setDragging] = useState(false);

  /* ==========================================
     OPEN FILE PICKER
  ========================================== */

  const openFilePicker = () => {

    if (inputRef.current) {
      inputRef.current.click();
    }

  };

  /* ==========================================
     VALIDATE FILE
  ========================================== */

  const validateFile = (selectedFile) => {

    if (!selectedFile) return;

    if (
      !selectedFile.name
        .toLowerCase()
        .endsWith(".json")
    ) {

      alert(
        "Only JSON files are supported."
      );

      return;

    }

    onFileSelected(selectedFile);

  };

  /* ==========================================
     INPUT CHANGE
  ========================================== */

  const handleInputChange = (e) => {

    const selectedFile = e.target.files[0];

    validateFile(selectedFile);

  };

  /* ==========================================
     DRAG EVENTS
  ========================================== */

  const handleDragOver = (e) => {

    e.preventDefault();

    setDragging(true);

  };

  const handleDragLeave = () => {

    setDragging(false);

  };

  const handleDrop = (e) => {

    e.preventDefault();

    setDragging(false);

    const droppedFile =
      e.dataTransfer.files[0];

    validateFile(droppedFile);

  };

  return (

    <div
      className={
        dragging
          ? "drop-zone dragging"
          : "drop-zone"
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      <h3>Bulk Question Upload</h3>

      <p>

        Drag & Drop your JSON file here

      </p>

      <p>or</p>

      <button
        className="browse-btn"
        onClick={openFilePicker}
      >
        Browse File
      </button>

      {file && (

        <div className="selected-file">

          <strong>Selected File:</strong>

          <br />

          {file.name}

          <br />

          {(file.size / 1024).toFixed(2)} KB

        </div>

      )}

    </div>

  );

}

export default BulkUploadDropZone;