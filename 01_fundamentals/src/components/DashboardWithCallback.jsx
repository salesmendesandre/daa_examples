// src/DashboardWithCallback.jsx

import ReminderWithAck from './ReminderWithAck.jsx';

function DashboardWithCallback() {
  const handleCompletion = (task) => {
    console.log(`Tarea completada: ${task}`);
  };

  return (
    <section>
      <ReminderWithAck
        task="Preparar informe de laboratorio"
        deadline="viernes 17:00"
        onComplete={handleCompletion}
      />
    </section>
  );
}

export default DashboardWithCallback;