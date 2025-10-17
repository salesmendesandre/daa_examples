import Reminder from './Reminder.jsx';

function Dashboard() {
  return (
    <section>
      <Reminder task="Preparar informe de laboratorio" deadline="viernes 17:00" />
      <Reminder task="Partido de padel" deadline="Sabado 10:00" />
    </section>
  );
}

export default Dashboard;