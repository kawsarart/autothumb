import { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setImage(base64);
    };

    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return alert("Upload image first!");

    const res = await fetch("/.netlify/functions/analyze", {
      method: "POST",
      body: JSON.stringify({ image }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Thumbnail Analyzer</h1>

      <input type="file" onChange={handleUpload} />
      <br /><br />

      <button onClick={analyze}>Analyze</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Score: {result.score}</h2>
          <h3>CTR: {result.ctr_prediction}</h3>

          <h3>Tips:</h3>
          <ul>
            {result.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <h3>Title:</h3>
          <p>{result.title_suggestion}</p>
        </div>
      )}
    </div>
  );
}
