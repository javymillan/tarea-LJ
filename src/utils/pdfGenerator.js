import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LABELS = {
  classic: 'Clásico',
  mental: 'Cálculo Mental',
  bubbles: 'Burbujas',
  maze: 'Laberinto',
  true_false: 'Verdadero o Falso',
  color_by_number: 'Colorea por Número'
};

export const generateIndividualReport = (tableNumber, progressData) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text(`Reporte de Misiones: Tabla del ${tableNumber}`, 14, 20);
  
  doc.setFontSize(14);
  doc.text(`Alumno: Luis Javier`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

  let y = 50;

  const activities = Object.keys(LABELS);

  activities.forEach(activity => {
    const actData = progressData?.[activity];
    if (!actData || !actData.completed) return;

    doc.setFontSize(16);
    doc.text(`Actividad: ${LABELS[activity]}`, 14, y);
    y += 10;

    let bodyData = [];
    
    // Normalize data structure
    const answers = actData.answers || actData;

    if (activity === 'classic' || activity === 'mental') {
      Object.entries(answers).forEach(([m, val]) => {
        if (['completed', 'time', 'puntos', 'answers'].includes(m)) return;
        const correct = parseInt(val, 10) === (tableNumber * m);
        bodyData.push([`${tableNumber} x ${m}`, val, correct ? 'Correcto' : 'Incorrecto']);
      });
      if (actData.time) {
        doc.setFontSize(11);
        doc.text(`Tiempo: ${actData.time}s | Puntos: ${actData.puntos || 0}`, 14, y - 2);
      }
    } else if (activity === 'bubbles') {
      Object.entries(answers).forEach(([id, val]) => {
        if (id === 'completed' || id === 'answers') return;
        bodyData.push([`Burbuja ${id}`, val, 'Completada']);
      });
    } else if (activity === 'maze') {
      const selected = answers || [];
      selected.forEach((idx, i) => {
        bodyData.push([`Paso ${i + 1}`, `Casilla ${idx}`, 'Correcta']);
      });
    } else if (activity === 'true_false') {
      Object.entries(answers).forEach(([q, val]) => {
        if (q === 'completed' || q === 'answers') return;
        bodyData.push([q, val ? 'Verdadero' : 'Falso', 'Respondido']);
      });
    } else if (activity === 'color_by_number') {
      Object.entries(answers).forEach(([sec, val]) => {
        if (sec === 'completed' || sec === 'answers') return;
        bodyData.push([`Sección ${sec}`, val, 'Coloreado']);
      });
    }

    if (bodyData.length > 0) {
      doc.autoTable({
        startY: y,
        head: [['Pregunta / Ítem', 'Respuesta', 'Estado']],
        body: bodyData,
        theme: 'striped',
        headStyles: { fillColor: [0, 116, 217] }
      });
      y = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(11);
      doc.text('Actividad completada satisfactoriamente.', 14, y);
      y += 15;
    }

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`Reporte_Tabla_${tableNumber}_LuisJavier.pdf`);
};

export const generateGenericReport = (allProgress) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text(`Reporte General de Aprendizaje`, 14, 20);
  
  doc.setFontSize(14);
  doc.text(`Alumno: Luis Javier`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 40);

  let y = 50;

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
  doc.text(`Total de misiones completadas: ${totalCompleted} de ${tables.length * activities.length}`, 14, y);
  y += 10;

  doc.autoTable({
    startY: y,
    head: [['Tabla', 'Completadas', 'Actividades', 'Estado']],
    body: summaryData,
    headStyles: { fillColor: [255, 133, 27] }
  });

  doc.save(`Reporte_General_LuisJavier.pdf`);
};
