
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CBTCategoriesUI from "./CBTCategoriesUI";

function CBTCategoriesEngine() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [loading, setLoading] = useState(true);

  const [categories] = useState([
    {
      id: 1,
      name: "Science",
      icon: "🔬",
      description:
        "Physics • Chemistry • Biology • Mathematics",
    },
    {
      id: 2,
      name: "Arts",
      icon: "📚",
      description:
        "Literature • Government • History",
    },
    {
      id: 3,
      name: "Commercial",
      icon: "💼",
      description:
        "Accounting • Commerce • Economics",
    },
    {
      id: 4,
      name: "Social Science",
      icon: "🌍",
      description:
        "Economics • Geography • Government",
    },
  ]);

  useEffect(() => {
    if (!user?.email) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, user]);

  const selectCategory = (category) => {
    navigate("/cbt-subjects", {
      state: {
        category: category.name,
      },
    });
  };

  const backToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <CBTCategoriesUI
      loading={loading}
      user={user}
      categories={categories}
      selectCategory={selectCategory}
      backToDashboard={backToDashboard}
    />
  );
}

export default CBTCategoriesEngine;