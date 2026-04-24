import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LABELS = {
  classic: 'Clásico',
  mental: 'Cálculo Mental',
  bubbles: 'Burbujas',
  maze: 'Laberinto',
  true_false: 'Verdadero o Falso',
  color_by_number: 'Colorea por Número'
};

export const generateIndividualReport = (tableNumber, progressData) => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text(`Reporte de Misiones: Tabla del ${tableNumber}`, 14, 20);
    
    doc.setFontSize(14);
    doc.text(`Alumno: Luis Javier`, 14, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

    let currentY = 50;

    const activities = Object.keys(LABELS);

    activities.forEach(activity => {
      const actData = progressData?.[activity];
      if (!actData || !actData.completed) return;

      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(16);
      doc.text(`Actividad: ${LABELS[activity]}`, 14, currentY);
      currentY += 10;

      let bodyData = [];
      
      // Normalize data structure
      const answers = actData.answers || actData;

      if (activity === 'classic' || activity === 'mental') {
        Object.entries(answers).forEach(([m, val]) => {
          if (['completed', 'time', 'puntos', 'answers'].includes(m)) return;
          const correct = parseInt(val, 10) === (tableNumber * m);
          bodyData.push([`${tableNumber} x ${m}`, String(val), correct ? 'Correcto' : 'Incorrecto']);
        });
        if (actData.time) {
          doc.setFontSize(11);
          doc.text(`Tiempo: ${actData.time}s | Puntos: ${actData.puntos || 0}`, 14, currentY - 2);
        }
      } else {
        // bubbles, maze, true_false, color_by_number
        const dataArray = Array.isArray(answers) ? answers : Object.values(answers);
        dataArray.forEach((item, idx) => {
          if (typeof item === 'object' && item !== null && item.question) {
            bodyData.push([
              String(item.question), 
              String(item.userAnswer || '-'), 
              item.isCorrect ? 'Correcto' : 'Revisado'
            ]);
          } else if (typeof item !== 'object') {
            bodyData.push([`Item ${idx + 1}`, String(item), 'Completado']);
          }
        });
      }

      if (bodyData.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [['Pregunta / Ítem', 'Respuesta', 'Estado']],
          body: bodyData,
          theme: 'striped',
          headStyles: { fillColor: [0, 116, 217] },
          margin: { top: 20 },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(11);
        doc.text('Actividad completada satisfactoriamente.', 14, currentY);
        currentY += 15;
      }
    });

    doc.save(`Reporte_Tabla_${tableNumber}_LuisJavier.pdf`);
  } catch (error) {
    console.error("Error generating individual report:", error);
    alert("Hubo un error al generar el PDF. Revisa la consola.");
  }
};

export const generateGenericReport = (allProgress) => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text(`Reporte General de Aprendizaje`, 14, 20);
    
    doc.setFontSize(14);
    doc.text(`Alumno: Luis Javier`, 14, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

    let currentY = 50;

    const tables = Array.from({ length: 10 }, (_, i) => i + 1);
    const activities = Object.keys(LABELS);

    let summaryData = [];
    let totalCompleted = 0;

    tables.forEach(t => {
      const tableProgress = allProgress[t] || {};
      let completedList = [];
      activities.forEach(act => {
        if (tableProgress[act]?.completed) {
          completedList.push(LABELS[act]);
          totalCompleted++;
        }
      });

      const status = completedList.length === activities.length ? '¡MAESTRO!' : (completedList.length > 0 ? 'En Progreso' : 'Pendiente');
      summaryData.push([
        `Tabla del ${t}`, 
        `${completedList.length} / ${activities.length}`, 
        completedList.join(', ') || 'Ninguna',
        status
      ]);
    });

    doc.setFontSize(12);
    doc.text(`Total de misiones completadas: ${totalCompleted} de ${tables.length * activities.length}`, 14, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [['Tabla', 'Completadas', 'Actividades', 'Estado']],
      body: summaryData,
      headStyles: { fillColor: [255, 133, 27] }
    });

    doc.save(`Reporte_General_LuisJavier.pdf`);
  } catch (error) {
    console.error("Error generating generic report:", error);
    alert("Hubo un error al generar el PDF general.");
  }
};
