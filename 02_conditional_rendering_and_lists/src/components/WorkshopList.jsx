// src/components/WorkshopList.jsx
import { workshops } from "../data/workshops.js";

export default function WorkshopList({ category }) {
  const selectedWorkshops = workshops.filter((workshop) => workshop.category === category);

  const listItems = selectedWorkshops.map((workshop) => (
    <li key={workshop.id} className="workshop-item">
      <h3>{workshop.title}</h3>
      <p>
        Imparte {workshop.speaker} · {workshop.duration} minutos
      </p>
    </li>
  ));

  return (
    <section>
      <h2>Talleres de la categoría {category}</h2>
      <ul>{listItems}</ul>
    </section>
  );
}