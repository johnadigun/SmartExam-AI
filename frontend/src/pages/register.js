import { useState } from "react";
import { registerUser } from "../api/api";

export default function Register() {

  const [form, setForm] = useState({});

  const submit = async () => {

    const data = await registerUser(form);

    if (data.success) {
      alert("Registered Successfully");
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Middle Name" onChange={e => setForm({ ...form, middleName: e.target.value })} />
      <input placeholder="Surname" onChange={e => setForm({ ...form, surname: e.target.value })} />
      <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />

      <button onClick={submit}>Register</button>
    </div>
  );
}