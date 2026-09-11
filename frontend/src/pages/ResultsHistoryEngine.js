import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import ResultsHistoryUI from "./ResultsHistoryUI";

function ResultsHistoryEngine() {

  const navigate = useNavigate();

  /* ==========================================
     STATES
  ========================================== */

  const [loading, setLoading] =
    useState(true);

  const [results, setResults] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  /* ==========================================
     LOAD RESULTS HISTORY
  ========================================== */

  useEffect(() => {

    const loadHistory = () => {

      try {

        const saved =
          JSON.parse(
            localStorage.getItem(
              "results_history"
            ) || "[]"
          );

        if (Array.isArray(saved)) {

          setResults(saved);

        } else {

          setResults([]);

        }

      } catch (err) {

        console.log(err);

        setResults([]);

      }

      setLoading(false);

    };

    loadHistory();

  }, []);

  /* ==========================================
     FILTER + SEARCH
  ========================================== */

  const filteredResults = useMemo(() => {

    let data = [...results];

    /* ------------------------------
       FILTER
    ------------------------------ */

    if (filter !== "All") {

      data = data.filter((item) => {

        return (
          (item.type || "")
            .toLowerCase() ===
          filter.toLowerCase()
        );

      });

    }

    /* ------------------------------
       SEARCH
    ------------------------------ */

    if (search.trim()) {

      const keyword =
        search.toLowerCase();

      data = data.filter((item) => {

        return (

          (item.category || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (item.subject || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (item.grade || "")
            .toLowerCase()
            .includes(keyword)

          ||

          (item.percentage + "")
            .includes(keyword)

        );

      });

    }

    /* ------------------------------
       SORT (Latest First)
    ------------------------------ */

    return data.sort((a, b) => {

      return (
        new Date(b.completedAt) -
        new Date(a.completedAt)
      );

    });

  }, [
    results,
    filter,
    search,
  ]);

  /* ==========================================
     SUMMARY STATISTICS
  ========================================== */

  const statistics = useMemo(() => {

    if (!results.length) {

      return {

        totalAttempts: 0,

        highestScore: 0,

        averagePercentage: 0,

        bestGrade: "-",

      };

    }
    /* ------------------------------
       HIGHEST SCORE
    ------------------------------ */

    const highestScore = Math.max(

      ...results.map((item) =>

        Number(item.score || 0)

      )

    );

    /* ------------------------------
       AVERAGE PERCENTAGE
    ------------------------------ */

    const averagePercentage = Math.round(

      results.reduce(

        (sum, item) =>

          sum + Number(item.percentage || 0),

        0

      ) / results.length

    );

    /* ------------------------------
       BEST GRADE
    ------------------------------ */

    const order = [

      "A",

      "B",

      "C",

      "D",

      "E",

      "F",

    ];

    let bestGrade = "F";

    results.forEach((item) => {

      if (

        order.indexOf(item.grade) <

        order.indexOf(bestGrade)

      ) {

        bestGrade = item.grade;

      }

    });

    return {

      totalAttempts: results.length,

      highestScore,

      averagePercentage,

      bestGrade,

    };

  }, [results]);



  /* ==========================================
     VIEW RESULT
  ========================================== */

  const viewResult = (result) => {

    if (

      (result.type || "").toLowerCase() ===

      "cbt"

    ) {

      localStorage.setItem(

        "cbt_result",

        JSON.stringify(result)

      );

      navigate("/result");

      return;

    }

    localStorage.setItem(

      "practice_result",

      JSON.stringify(result)

    );

    navigate("/practice-result");

  };



  /* ==========================================
     DELETE RESULT
  ========================================== */

  const deleteResult = (completedAt) => {

    const ok = window.confirm(

      "Delete this result permanently?"

    );

    if (!ok) return;

    const updated = results.filter(

      (item) =>

        item.completedAt !== completedAt

    );

    setResults(updated);

    localStorage.setItem(

      "results_history",

      JSON.stringify(updated)

    );

  };



  /* ==========================================
     CLEAR ALL HISTORY
  ========================================== */

  const clearHistory = () => {

    const ok = window.confirm(

      "Clear ALL examination history?"

    );

    if (!ok) return;

    localStorage.removeItem(

      "results_history"

    );

    setResults([]);

  };
  /* ==========================================
     PRINT HISTORY
  ========================================== */

  const printHistory = () => {

    window.print();

  };


  /* ==========================================
     EXPORT SUMMARY
  ========================================== */

  const exportSummary = () => {

    const summary = {

      generatedAt: new Date(),

      totalAttempts:
        statistics.totalAttempts,

      highestScore:
        statistics.highestScore,

      averagePercentage:
        statistics.averagePercentage,

      bestGrade:
        statistics.bestGrade,

      history: filteredResults,

    };

    console.log(summary);

    alert(
      "Export module will be connected later."
    );

  };


  /* ==========================================
     REFRESH HISTORY
  ========================================== */

  const refreshHistory = () => {

    try {

      const saved =
        JSON.parse(

          localStorage.getItem(
            "results_history"
          ) || "[]"

        );

      setResults(saved);

    } catch (err) {

      console.log(err);

      setResults([]);

    }

  };


  /* ==========================================
     EMPTY HISTORY
  ========================================== */

  const hasResults =
    filteredResults.length > 0;


  /* ==========================================
     TABLE HEADERS
  ========================================== */

  const columns = [

    "S/N",

    "Type",

    "Category",

    "Score",

    "Percentage",

    "Grade",

    "Completed",

    "Action",

  ];
  /* ==========================================
     RENDER UI
  ========================================== */

  return (

    <ResultsHistoryUI

      /* ---------- Loading ---------- */

      loading={loading}

      hasResults={hasResults}

      /* ---------- Statistics ---------- */

      statistics={statistics}

      /* ---------- Table ---------- */

      columns={columns}

      results={filteredResults}

      /* ---------- Search ---------- */

      search={search}

      setSearch={setSearch}

      /* ---------- Filter ---------- */

      filter={filter}

      setFilter={setFilter}

      /* ---------- Actions ---------- */

      refreshHistory={refreshHistory}

      printHistory={printHistory}

      exportSummary={exportSummary}

      viewResult={viewResult}

      deleteResult={deleteResult}

      clearHistory={clearHistory}

    />

  );

}

/* ==========================================
   EXPORT
========================================== */

export default ResultsHistoryEngine;