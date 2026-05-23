import { useEffect, useRef } from "react";

export default function ProctorCamera({ userId }) {

  const videoRef = useRef(null);

  useEffect(() => {

    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      videoRef.current.srcObject = stream;
    }

    startCamera();

  }, []);

  return (
    <div>
      <h3>AI Proctor Active</h3>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="300"
        height="200"
      />
    </div>
  );
}