// src/components/EssentialGearList.jsx
import GearItem from "./GearItem.jsx";

export default function EssentialGearList({ showPackedItems }) {
  return (
    <section>
      <h1>Lista para excursión a la sierra</h1>
      <ul>
        <GearItem isPacked={false} name="Botiquín de viaje" />
        {showPackedItems && <GearItem isPacked={true} name="Linterna frontal" />}
        {showPackedItems && <GearItem isPacked={true} name="Mapa impermeable" />}
      </ul>
    </section>
  );
}