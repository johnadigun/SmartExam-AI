const BASE_URL = "http://localhost:5000/api";

/* ================= AUTH ================= */

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

/* ================= EXAMS ================= */

export const getExams = async (token) => {
  const res = await fetch(`${BASE_URL}/exam`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
};

export const submitExam = async (data, token) => {
  const res = await fetch(`${BASE_URL}/exam/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

/* ================= PAYMENT ================= */

export const payCBT = async (email) => {
  const res = await fetch(`${BASE_URL}/payment/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
};