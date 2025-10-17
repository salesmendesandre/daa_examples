function Reminder({ task, deadline }) {
  return (
    <article>
      <h3>{task}</h3>
      <p>Fecha límite: {deadline}</p>
    </article>
  );
}

export default Reminder;