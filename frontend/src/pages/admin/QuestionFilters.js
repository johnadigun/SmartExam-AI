import React from "react";

function QuestionFilters({
  search,
  setSearch,
  subjectFilter,
  setSubjectFilter,
  categoryFilter,
  setCategoryFilter,
  subjects,
  categories,
  onAddQuestion,
}) {
  return (
    <div className="question-filters">

      {/* SEARCH */}
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SUBJECT FILTER */}
      <div className="filter-group">
        <select
          value={subjectFilter}
          onChange={(e) =>
            setSubjectFilter(e.target.value)
          }
        >
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* CATEGORY FILTER */}
      <div className="filter-group">
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* ADD BUTTON */}
      <div className="filter-group">
        <button
          className="add-question-btn"
          onClick={onAddQuestion}
        >
          + Add Question
        </button>
      </div>

    </div>
  );
}

export default QuestionFilters;