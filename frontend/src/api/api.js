
/*
=========================================================
SMARTEXAM API CONFIGURATION
=========================================================

LOCAL DEVELOPMENT
-----------------
Frontend:
http://localhost:3000

Backend:
http://localhost:5000


PRODUCTION
----------
Frontend:
Render

Backend:
https://smartexam-ai-1-b0yj.onrender.com
=========================================================
*/

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://smartexam-ai-1-b0yj.onrender.com/api";

export default BASE_URL;