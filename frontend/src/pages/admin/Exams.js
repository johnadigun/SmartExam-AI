
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import BASE_URL from "../../api/api";
import "./Exams.css";

import ExamsTable from "./ExamsTable";
import ExamsModal from "./ExamsModal";

function Exams() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] =
    useState("All");
  const [categoryFilter, setCategoryFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("newest");

  const [selectedExam, setSelectedExam] =
    useState(null);
  const [showModal, setShowModal] =
    useState(false);

  const token =
    localStorage.getItem("token");


  /* =====================================================
     LOAD EXAMS
  ====================================================== */

  const loadExams = async () => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error(
          "Administrator authentication is required."
        );
      }

      const response = await fetch(
        `${BASE_URL}/exams`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load exams."
        );
      }

      setExams(
        Array.isArray(data.exams)
          ? data.exams
          : []
      );
    } catch (err) {
      console.error(
        "LOAD EXAMS ERROR:",
        err
      );

      alert(
        err.message ||
          "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadExams();
  }, []);


  /* =====================================================
     SUBJECT FILTER OPTIONS
  ====================================================== */

  const subjects = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          exams
            .map(
              (exam) => exam.subject
            )
            .filter(Boolean)
        )
      ).sort(),
    ];
  }, [exams]);


  /* =====================================================
     CATEGORY FILTER OPTIONS
  ====================================================== */

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          exams
            .map(
              (exam) => exam.category
            )
            .filter(Boolean)
        )
      ).sort(),
    ];
  }, [exams]);


  /* =====================================================
     STATISTICS
  ====================================================== */

  const statistics = useMemo(() => {
    const totalExams =
      exams.length;

    const publishedExams =
      exams.filter(
        (exam) =>
          exam.published === true
      ).length;

    const draftExams =
      exams.filter(
        (exam) =>
          exam.published !== true
      ).length;

    const totalQuestions =
      exams.reduce(
        (total, exam) =>
          total +
          (Array.isArray(
            exam.questions
          )
            ? exam.questions.length
            : 0),
        0
      );

    return {
      totalExams,
      publishedExams,
      draftExams,
      totalQuestions,
    };
  }, [exams]);


  /* =====================================================
     FILTER AND SORT
  ====================================================== */

  const filteredExams = useMemo(() => {
    const keyword =
      search
        .trim()
        .toLowerCase();

    const result =
      exams.filter((exam) => {
        const matchesSearch =
          !keyword ||
          exam.title
            ?.toLowerCase()
            .includes(keyword) ||
          exam.subject
            ?.toLowerCase()
            .includes(keyword) ||
          exam.category
            ?.toLowerCase()
            .includes(keyword);

        const matchesSubject =
          subjectFilter === "All" ||
          exam.subject ===
            subjectFilter;

        const matchesCategory =
          categoryFilter === "All" ||
          exam.category ===
            categoryFilter;

        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter ===
            "Published" &&
            exam.published ===
              true) ||
          (statusFilter ===
            "Draft" &&
            exam.published !==
              true);

        return (
          matchesSearch &&
          matchesSubject &&
          matchesCategory &&
          matchesStatus
        );
      });

    result.sort((a, b) => {
      if (sortBy === "title") {
        return (
          (a.title || "")
            .localeCompare(
              b.title || ""
            )
        );
      }

      if (
        sortBy === "questions"
      ) {
        return (
          (b.questions
            ?.length || 0) -
          (a.questions
            ?.length || 0)
        );
      }

      if (
        sortBy === "duration"
      ) {
        return (
          Number(
            b.duration || 0
          ) -
          Number(
            a.duration || 0
          )
        );
      }

      const dateA =
        new Date(
          a.createdAt || 0
        ).getTime();

      const dateB =
        new Date(
          b.createdAt || 0
        ).getTime();

      return sortBy === "oldest"
        ? dateA - dateB
        : dateB - dateA;
    });

    return result;
  }, [
    exams,
    search,
    subjectFilter,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);


  /* =====================================================
     EDIT EXAM
  ====================================================== */

  const editExam = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };


  /* =====================================================
     CLOSE MODAL
  ====================================================== */

  const closeModal = () => {
    setSelectedExam(null);
    setShowModal(false);
  };


  /* =====================================================
     CREATE EXAM
  ====================================================== */

  const handleCreateExam = () => {
    window.location.href =
      "/admin/create-exam";
  };


  /* =====================================================
     RETURN
  ====================================================== */

  const handleReturn = () => {
    window.history.back();
  };


  /* =====================================================
     SAVE EXAM
  ====================================================== */

  const saveExam = async (
    updatedExam
  ) => {
    try {
      setSaving(true);

      if (!token) {
        throw new Error(
          "Administrator authentication is required."
        );
      }

      const response =
        await fetch(
          `${BASE_URL}/exams/${updatedExam._id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              updatedExam
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update exam."
        );
      }

      alert(
        "Exam updated successfully."
      );

      closeModal();

      await loadExams();
    } catch (err) {
      console.error(
        "UPDATE EXAM ERROR:",
        err
      );

      alert(
        err.message ||
          "Unable to update exam."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     PUBLISH / UNPUBLISH
  ====================================================== */

  const togglePublished =
    async (exam) => {
      const newStatus =
        exam.published !== true;

      const message =
        newStatus
          ? `Publish "${exam.title}"?`
          : `Move "${exam.title}" back to Draft?`;

      if (
        !window.confirm(
          message
        )
      ) {
        return;
      }

      try {
        setSaving(true);

        if (!token) {
          throw new Error(
            "Administrator authentication is required."
          );
        }

        const response =
          await fetch(
            `${BASE_URL}/exams/${exam._id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                ...exam,
                published:
                  newStatus,
              }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to change exam status."
          );
        }

        await loadExams();
      } catch (err) {
        console.error(
          "TOGGLE PUBLISHED ERROR:",
          err
        );

        alert(
          err.message ||
            "Unable to change exam status."
        );
      } finally {
        setSaving(false);
      }
    };


  /* =====================================================
     DELETE EXAM
  ====================================================== */

  const deleteExam = async (
    examId
  ) => {
    const exam =
      exams.find(
        (item) =>
          item._id === examId
      );

    const title =
      exam?.title ||
      "this exam";

    const ok =
      window.confirm(
        `Delete "${title}" permanently?\n\nThis action cannot be undone.`
      );

    if (!ok) {
      return;
    }

    try {
      setSaving(true);

      if (!token) {
        throw new Error(
          "Administrator authentication is required."
        );
      }

      const response =
        await fetch(
          `${BASE_URL}/exams/${examId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to delete exam."
        );
      }

      alert(
        "Exam deleted successfully."
      );

      await loadExams();
    } catch (err) {
      console.error(
        "DELETE EXAM ERROR:",
        err
      );

      alert(
        err.message ||
          "Unable to delete exam."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =====================================================
     CLEAR FILTERS
  ====================================================== */

  const clearFilters = () => {
    setSearch("");
    setSubjectFilter("All");
    setCategoryFilter("All");
    setStatusFilter("All");
    setSortBy("newest");
  };


  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="exam-loading">
        <div className="exam-loading-card">
          <div className="loading-spinner"></div>

          <h2>
            Loading Exam Manager
          </h2>

          <p>
            Please wait while
            examinations are
            loaded.
          </p>
        </div>
      </div>
    );
  }


  /* =====================================================
     PAGE
  ====================================================== */

  return (
    <div className="exam-manager">

      {/* HEADER */}

      <div className="exam-header">

        <div className="exam-title-area">

          <div className="exam-heading-icon">
            E
          </div>

          <div>
            <h1>
              Exam Manager
            </h1>

            <p>
              Create, review,
              organize and manage
              CBT examinations.
            </p>
          </div>

        </div>


        <div className="exam-header-actions">

          <button
            type="button"
            className="exam-refresh-btn"
            onClick={loadExams}
            disabled={saving}
          >
            ↻ Refresh
          </button>


          <button
            type="button"
            className="exam-create-btn"
            onClick={
              handleCreateExam
            }
          >
            + Create New Exam
          </button>


          <button
            type="button"
            className="exam-return-btn"
            onClick={
              handleReturn
            }
          >
            ← Return
          </button>

        </div>

      </div>


      {/* STATISTICS */}

      <div className="exam-stat-grid">

        <div className="exam-stat-card">

          <div className="stat-icon">
            E
          </div>

          <div>
            <span>
              Total Exams
            </span>

            <strong>
              {
                statistics.totalExams
              }
            </strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="stat-icon published-icon">
            ✓
          </div>

          <div>
            <span>
              Published
            </span>

            <strong>
              {
                statistics.publishedExams
              }
            </strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="stat-icon draft-icon">
            D
          </div>

          <div>
            <span>
              Drafts
            </span>

            <strong>
              {
                statistics.draftExams
              }
            </strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="stat-icon question-icon">
            Q
          </div>

          <div>
            <span>
              Total Questions
            </span>

            <strong>
              {
                statistics.totalQuestions
              }
            </strong>
          </div>

        </div>

      </div>


      {/* FILTER / SEARCH TOOLBAR */}

      <div className="exam-control-panel">

        <div className="exam-search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by title, subject or category..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <select
          value={subjectFilter}
          onChange={(e) =>
            setSubjectFilter(
              e.target.value
            )
          }
          aria-label="Filter by subject"
        >
          {subjects.map(
            (subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject ===
                "All"
                  ? "All Subjects"
                  : subject}
              </option>
            )
          )}
        </select>


        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          aria-label="Filter by category"
        >
          {categories.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category ===
                "All"
                  ? "All Categories"
                  : category}
              </option>
            )
          )}
        </select>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          aria-label="Filter by status"
        >
          <option value="All">
            All Status
          </option>

          <option value="Published">
            Published
          </option>

          <option value="Draft">
            Draft
          </option>
        </select>


        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
          aria-label="Sort exams"
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>

          <option value="title">
            Title A-Z
          </option>

          <option value="questions">
            Most Questions
          </option>

          <option value="duration">
            Longest Duration
          </option>
        </select>


        <button
          type="button"
          className="clear-filter-btn"
          onClick={
            clearFilters
          }
        >
          Clear
        </button>

      </div>


      {/* TABLE INFORMATION BAR */}

      <div className="exam-list-header">

        <div>

          <h2>
            Examinations
          </h2>

          <p>
            Showing{" "}
            <strong>
              {
                filteredExams.length
              }
            </strong>{" "}
            of{" "}
            <strong>
              {exams.length}
            </strong>{" "}
            exams
          </p>

        </div>


        {saving && (
          <span className="saving-indicator">
            Saving...
          </span>
        )}

      </div>


      {/* TABLE */}

      <ExamsTable
        exams={filteredExams}
        onEdit={editExam}
        onDelete={deleteExam}
        onTogglePublished={
          togglePublished
        }
      />


      {/* EDIT / VIEW MODAL */}

      {showModal &&
        selectedExam && (
          <ExamsModal
            exam={selectedExam}
            saving={saving}
            onSave={saveExam}
            onClose={closeModal}
          />
        )}

    </div>
  );
}

export default Exams;