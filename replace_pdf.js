const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'aegiscare', 'frontend', 'src', 'pages', 'Dashboards', 'ElderlyDashboard', 'Elderly.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "    // Vitals data per period\n    const vitalsData = {";
const endMarker = "      'custom': [\n        'All vital signs are within normal ranges for the selected period.',\n        'Heart rate is steady at 72 BPM.',\n        'Blood pressure is optimal at 120/80 mmHg.',\n        'Glucose levels well-controlled at 110 mg/dL.',\n        'Overall health status: Good. Continue current health regimen.',\n      ],\n    };";

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

const endIndex = content.indexOf(endMarker, startIndex);
if (endIndex === -1) {
    console.error('End marker not found');
    process.exit(1);
}

const newContent = `    // Real vitals data from watch
    const dynamicVitals = [
      ['Heart Rate', healthMetrics.heart.value, healthMetrics.heart.status, '60-100 BPM', '-'],
      ['Body Temperature', healthMetrics.temp.value, healthMetrics.temp.status, '97-99 F', '-'],
      ['Glucose Level', healthMetrics.glucose.value, healthMetrics.glucose.status, '70-140 mg/dL', '-'],
      ['Blood Pressure', healthMetrics.bp.value, healthMetrics.bp.status, '90/60-140/90', '-'],
      ['SpO2', healthMetrics.spo2.value, healthMetrics.spo2.status, '95-100%', '-'],
      ['Steps', healthMetrics.steps.value, healthMetrics.steps.status, 'Goal: 5,000', '-'],
    ];

    const vitalsData = {
      '24h': dynamicVitals,
      '7d': dynamicVitals,
      '30d': dynamicVitals,
      'custom': dynamicVitals,
    };

    const summaryData = {
      '24h': [
        'Vitals Report generated from connected Huawei Watch.',
        healthMetrics.heart.details.summary,
        healthMetrics.bp.details.summary,
        healthMetrics.glucose.details.summary,
      ],
      '7d': [ 'Vitals Report generated from connected Huawei Watch.' ],
      '30d': [ 'Vitals Report generated from connected Huawei Watch.' ],
      'custom': [ 'Vitals Report generated from connected Huawei Watch.' ],
    };`;

const finalContent = content.substring(0, startIndex) + newContent + content.substring(endIndex + endMarker.length);
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully updated PDF generation');
