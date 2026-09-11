import { useEffect, useState } from "react";

/*
==========================================================
DASHBOARD STATISTICS

Handles:

• Practice history
• Recent activities
• Average score
• Practice completed
• CBT completed
• Certificates
==========================================================
*/

export default function useDashboardStats(user) {

  const [dashboardStats, setDashboardStats] =
    useState({

      practiceCompleted: 0,

      cbtCompleted: 0,

      certificates: 0,

      averageScore: 0,

    });

  const [recentActivities, setRecentActivities] =
    useState([]);

  useEffect(() => {

    try {

      const history = JSON.parse(

        localStorage.getItem(
          "practice_history"
        ) || "[]"

      );

      const completed = history.length;

      let averageScore = 0;

      if (completed > 0) {

        const total = history.reduce(

          (sum, item) =>

            sum + (item.percentage || 0),

          0

        );

        averageScore = Math.round(
          total / completed
        );

      }

      setDashboardStats({

        practiceCompleted: completed,

        cbtCompleted:
          user?.examTaken ? 1 : 0,

        certificates:
          user?.certificateIssued ? 1 : 0,

        averageScore,

      });

      setRecentActivities(

        history
          .slice(-5)
          .reverse()

      );

    } catch (err) {

      console.log(
        "Dashboard Statistics Error:",
        err
      );

      setDashboardStats({

        practiceCompleted: 0,

        cbtCompleted: 0,

        certificates: 0,

        averageScore: 0,

      });

      setRecentActivities([]);

    }

  }, [user]);

  return {

    dashboardStats,

    recentActivities,

  };

}