// src/components/ReadingListItem.jsx
export default function ReadingListItem({ title, isCompleted }) {
  return (
    <li className="item">
      {isCompleted ? <del>{title} ✅</del> : title}
    </li>
  );
}