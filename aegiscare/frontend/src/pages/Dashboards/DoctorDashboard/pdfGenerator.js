import { jsPDF } from 'jspdf';

// ===== PDF Export Utility =====
const generatePatientPDF = (patient, isDarkMode) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('AegisCare', 14, 18);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient Medical Report', 14, 28);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`Report ID: RPT-${Date.now().toString(36).toUpperCase()}`, pageWidth - 14, 26, { align: 'right' });
  y = 50;

  // Patient Info Section
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 14, y);
  y += 2;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const infoItems = [
    ['Name', patient.name || 'N/A'],
    ['Age', `${patient.age || 'N/A'} years`],
    ['Gender', patient.gender || 'N/A'],
    ['Condition', patient.condition || 'N/A'],
    ['Status', patient.status || 'N/A'],
    ['Last Visit', patient.lastVisit || 'N/A']
  ];
  infoItems.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, y);
    y += 7;
  });
  y += 5;

  // Vitals Section
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Current Vitals', 14, y);
  y += 2;
  doc.setDrawColor(16, 185, 129);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  const vitals = patient.vitals || {};
  const vitalItems = [
    ['Heart Rate', `${vitals.heartRate || 'N/A'} BPM`],
    ['Blood Pressure', vitals.bp || 'N/A'],
    ['Glucose', `${vitals.glucose || 'N/A'} mg/dL`],
    ['Temperature', `${vitals.tempF || (vitals.temp ? (vitals.temp < 45 ? Math.round((vitals.temp * 9 / 5 + 32) * 10) / 10 : vitals.temp) : 'N/A')} °F`],
    ['SpO2', `${vitals.spo2 || 'N/A'}%`]
  ];
  vitalItems.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 55, y);
    y += 7;
  });
  y += 5;

  // Medications Section
  const raw = patient.raw || {};
  if (raw.medications && raw.medications.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Active Medications', 14, y);
    y += 2;
    doc.setDrawColor(6, 182, 212);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    // Table header
    doc.setFont('helvetica', 'bold');
    doc.text('Medication', 14, y);
    doc.text('Dosage', 70, y);
    doc.text('Frequency', 100, y);
    doc.text('Time', 140, y);
    doc.text('Prescribed By', 165, y);
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y, pageWidth - 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    raw.medications.forEach(med => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(med.name || 'N/A', 14, y);
      doc.text(med.dosage || 'N/A', 70, y);
      doc.text(med.frequency || 'N/A', 100, y);
      doc.text(med.scheduledTime || 'N/A', 140, y);
      doc.text(med.prescribedBy || 'N/A', 165, y);
      y += 6;
    });
    y += 5;
  }

  // Appointment History
  if (raw.appointments && raw.appointments.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointment History', 14, y);
    y += 2;
    doc.setDrawColor(139, 92, 246);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    raw.appointments.slice(0, 10).forEach(appt => {
      if (y > 270) { doc.addPage(); y = 20; }
      const dateStr = new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      doc.setFont('helvetica', 'bold');
      doc.text(`${appt.type || 'Consultation'} — ${dateStr}`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Time: ${appt.timeSlot || 'N/A'} | Status: ${appt.status || 'N/A'} | Doctor: ${appt.doctorName || 'N/A'}`, 14, y + 5);
      if (appt.notes) doc.text(`Notes: ${appt.notes}`, 14, y + 10);
      y += appt.notes ? 16 : 12;
    });
    y += 5;
  }

  // Consultation History
  if (raw.consultations && raw.consultations.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Consultation History', 14, y);
    y += 2;
    doc.setDrawColor(236, 72, 153);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    raw.consultations.slice(0, 10).forEach(c => {
      if (y > 270) { doc.addPage(); y = 20; }
      const dateStr = new Date(c.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      doc.setFont('helvetica', 'bold');
      doc.text(`${c.type || 'General Consult'} — ${dateStr}`, 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`Priority: ${c.priority || 'Normal'} | Status: ${c.status || 'N/A'}`, 14, y + 5);
      if (c.notes) doc.text(`Notes: ${c.notes}`, 14, y + 10);
      y += c.notes ? 16 : 12;
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`AegisCare Medical Report — Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text('This report is confidential and intended for authorized medical personnel only.', pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
  }

  doc.save(`${(patient.name || 'Patient').replace(/\s+/g, '_')}_Medical_Report.pdf`);
};

export { generatePatientPDF };
