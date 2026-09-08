/**
 * Demostración del Event Loop, Promesas y async/await
 */

export const simularConsultaBD = (id, ms = 50) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error(`ID inválido: ${id}`));
      } else {
        resolve({ id, titulo: `Documento #${id}`, autor: "DocuMind System" });
      }
    }, ms);
  });
};

export const consultarDocumentosParalelo = async (ids) => {
  try {
    const promesas = ids.map(id => simularConsultaBD(id));
    return await Promise.all(promesas);
  } catch (error) {
    console.error("Error en consulta concurrente:", error.message);
    throw error;
  }
};
