// src/components/OptionalGearItem.jsx
export default function OptionalGearItem({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}