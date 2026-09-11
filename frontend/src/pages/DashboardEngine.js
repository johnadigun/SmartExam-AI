
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardUI from "./DashboardUI";
import useDashboardStats from "./DashboardStats";
import useDashboardAccess from "./DashboardAccess";
import useDashboardActions from "./DashboardActions";

import BASE_URL from "../api/api";

function DashboardEngine() {
const navigate = useNavigate();

const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [exam, setExam] = useState(null);

const {
dashboardStats = {
practiceCompleted: 0,
cbtCompleted: 0,
averageScore: 0,
},
recentActivities = [],
} = useDashboardStats(user);

const {
showCbtModal,
setShowCbtModal,
accessExpired,
requestCBTAccess,
} = useDashboardAccess(user);

const {
openPractice,
openResults,
openReview,
openHistory,
openCertificate,
openPayment,
openProfile,
openSettings,
openSupport,
openCBT,
logout,
} = useDashboardActions();

useEffect(() => {
let mounted = true;


const loadCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/", { replace: true });
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("DASHBOARD CURRENT USER:", data);

    if (!response.ok || !data.user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/", {
        replace: true,
      });

      return;
    }

    if (mounted) {
      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }
  } catch (err) {
    console.error(
      "DASHBOARD USER LOAD ERROR:",
      err
    );

    const savedUser = localStorage.getItem("user");

    if (mounted && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/", {
          replace: true,
        });
      }
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
};

loadCurrentUser();

return () => {
  mounted = false;
};


}, [navigate]);

useEffect(() => {
let mounted = true;


const loadExam = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    if (mounted) {
      setExam(null);
    }

    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/exams`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("DASHBOARD EXAMS:", data);

    if (!mounted) {
      return;
    }

    if (
      response.ok &&
      data &&
      Array.isArray(data.exams) &&
      data.exams.length > 0
    ) {
      setExam(data.exams[0]);
    } else {
      setExam(null);
    }
  } catch (err) {
    console.error(
      "DASHBOARD EXAM LOAD ERROR:",
      err
    );

    if (mounted) {
      setExam(null);
    }
  }
};

loadExam();

return () => {
  mounted = false;
};


}, []);

const handleCBTClick = () => {
try {
const access = requestCBTAccess();


  console.log(
    "CBT ACCESS REQUEST:",
    access
  );

  if (!access) {
    return;
  }

  switch (access.reason) {
    case "login":
      navigate("/", {
        replace: true,
      });
      return;

    case "payment":
      return;

    case "attempt":
      window.alert(
        "Your CBT access has expired or you have exhausted your available attempt."
      );
      return;

    case "completed":
      window.alert(
        "You have already completed your CBT Examination."
      );

      openHistory();
      return;

    case "ok":
      openCBT();
      return;

    default:
      return;
  }
} catch (err) {
  console.error(
    "CBT DASHBOARD ACTION ERROR:",
    err
  );

  window.alert(
    "Unable to open CBT Examination. Please try again."
  );
}


};

const handlePayment = () => {
setShowCbtModal(false);
openPayment();
};

const closeModal = () => {
setShowCbtModal(false);
};

useEffect(() => {
if (!accessExpired) {
return;
}


window.alert(
  "Your CBT access has expired.\nPlease make payment again to continue."
);


}, [accessExpired]);

const username =
user?.firstName ||
user?.name ||
user?.email ||
"Student";

if (loading) {
return ( <DashboardUI
     loading={true}
     username={username}
   />
);
}

return ( <DashboardUI
   loading={false}
   user={user}
   username={username}
   exam={exam}
   dashboardStats={dashboardStats}
   recentActivities={recentActivities}
   showCbtModal={showCbtModal}
   closeModal={closeModal}
   handleCBTClick={handleCBTClick}
   openPractice={openPractice}
   openResults={openResults}
   openReview={openReview}
   openHistory={openHistory}
   openCertificate={openCertificate}
   openPayment={handlePayment}
   openProfile={openProfile}
   openSettings={openSettings}
   openSupport={openSupport}
   logout={logout}
 />
);
}

export default DashboardEngine;
