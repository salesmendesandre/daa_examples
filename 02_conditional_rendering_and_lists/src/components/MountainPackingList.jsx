// src/components/MountainPackingList.jsx
import GearItem from "./GearItem.jsx";

export default function MountainPackingList() {
  return (
    <section>
      <h1>Lista para excursión a la sierra</h1>
      <ul>
        <GearItem isPacked={true} name="Linterna frontal" />
        <GearItem isPacked={true} name="Mapa impermeable" />
        <GearItem isPacked={false} name="Botiquín de viaje" />
      </ul>
    </section>
  );
}