import { useEffect, useState } from "react";

/*
==========================================================
DASHBOARD ACCESS
Handles:

• CBT payment verification
• 5-hour expiry
• Remaining attempts
• Payment modal
==========================================================
*/

export default function useDashboardAccess(user) {

  const [showCbtModal, setShowCbtModal] =
    useState(false);

  const [accessExpired, setAccessExpired] =
    useState(false);

  useEffect(() => {

    if (!user) return;

    if (!user.cbtAccess) return;

    if (!user.cbtExpiry) return;

    const expiry =
      new Date(user.cbtExpiry).getTime();

    const now = Date.now();

    if (now >= expiry) {

      const updatedUser = {

        ...user,

        cbtAccess: false,

        isPaid: false,

        cbtExpiry: null,

        remainingAttempts: 0,

      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setAccessExpired(true);

    }

  }, [user]);

  const requestCBTAccess = () => {

    const latestUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!latestUser.email) {

      return {
        allow: false,
        reason: "login",
      };

    }

    if (!latestUser.cbtAccess) {

      setShowCbtModal(true);

      return {
        allow: false,
        reason: "payment",
      };

    }

    if (
      latestUser.remainingAttempts <= 0
    ) {

      return {
        allow: false,
        reason: "attempt",
      };

    }

    if (latestUser.examTaken) {

      return {
        allow: false,
        reason: "completed",
      };

    }

    return {
      allow: true,
      reason: "ok",
    };

  };

  return {

    showCbtModal,

    setShowCbtModal,

    accessExpired,

    requestCBTAccess,

  };

}