// src/ClickDashboard.jsx

import { useState } from "react";

function ClickDashboard() {
  const [count, setCount] = useState(0);
  const [notes, setNotes] = useState("Sin notas");

  const handleAddNote = () => {
    setNotes("Recordar revisar el informe");
  };

  return (
    <section>
      <h3>Panel de clics</h3>
      <p>Has hecho clic {count} veces.</p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Sumar clic
      </button>
      <button type="button" onClick={handleAddNote}>
        Registrar nota
      </button>
      <p>{notes}</p>
    </section>
  );
}

export default ClickDashboard;