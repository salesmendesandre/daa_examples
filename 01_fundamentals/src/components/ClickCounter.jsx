import { useState } from "react";

function ClickCounter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Has hecho clic {count} veces.</p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Sumar clic
      </button>
    </section>
  );
}

export default ClickCounter;