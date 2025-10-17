// src/ReminderWithAck.jsx

function ReminderWithAck({ task, deadline, onComplete }) {
  const handleClick = () => {
    onComplete(task);
  };

  return (
    <article>
      <h3>{task}</h3>
      <p>Fecha límite: {deadline}</p>
      <button type="button" onClick={handleClick}>
        Marcar como completada
      </button>
    </article>
  );
}

export default ReminderWithAck;