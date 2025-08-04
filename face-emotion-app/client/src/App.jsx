import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./App.css"; // Don't forget to import your CSS

const App = () => {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post("http://localhost:5000/predict", formData);
    const data = response.data.emotions;

    if (data.length > 0) setEmotion(data[0].label);
    else setEmotion("No face detected");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">🧠 Real-Time Emotion Detector</h1>

        <div className="webcam-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
        </div>

        <button className="capture-button" onClick={capture}>
          Capture & Predict
        </button>

        <h2 className="emotion-text">Emotion: <span>{emotion || "Waiting..."}</span></h2>
      </div>
    </div>
  );
};

export default App;

