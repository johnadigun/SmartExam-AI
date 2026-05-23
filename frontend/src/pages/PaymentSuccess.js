import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {

  const [params] = useSearchParams();

  const reference = params.get("reference");

  useEffect(() => {

    fetch(`http://localhost:5000/api/payment/verify/${reference}`);

  }, [reference]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment Successful 🎉</h1>
      <p>Verifying your CBT access...</p>
    </div>
  );
}