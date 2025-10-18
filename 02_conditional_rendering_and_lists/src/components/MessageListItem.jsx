// src/components/MessageListItem.jsx
export default function MessageListItem({ sender, isPriority }) {
  return (
    <li className="item">
      {sender} {isPriority && "✅"}
    </li>
  );
}