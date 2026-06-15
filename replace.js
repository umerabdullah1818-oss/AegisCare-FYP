const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'aegiscare', 'frontend', 'src', 'pages', 'Dashboards', 'ElderlyDashboard', 'Elderly.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '// Dynamic vitals helpers';
const endMarker = '  };';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Start marker not found');
    process.exit(1);
}

const endSearchIndex = content.indexOf('    })()', startIndex);
const endIndex = content.indexOf(endMarker, endSearchIndex);
if (endIndex === -1) {
    console.error('End marker not found');
    process.exit(1);
}

const newContent = `// Dynamic vitals helpers
  const hr = liveVitals?.heartRate;
  const sbp = liveVitals?.systolicBP;
  const dbp = liveVitals?.diastolicBP;
  const gl = liveVitals?.glucose;
  const tp = liveVitals?.temp;
  const sp = liveVitals?.spo2;

  const hasHr = hr != null;
  const hasBp = sbp != null && dbp != null;
  const hasGl = gl != null;
  const hasTp = tp != null;
  const hasSp = sp != null;

  const hrStatus = hasHr ? (hr >= 60 && hr <= 100 ? 'Normal' : hr > 100 ? 'High' : 'Low') : 'No Data';
  const bpStatus = hasBp ? (sbp < 120 && dbp < 80 ? 'Optimal' : sbp <= 140 && dbp <= 90 ? 'Normal' : 'High') : 'No Data';
  const glStatus = hasGl ? (gl >= 70 && gl <= 140 ? 'Normal' : gl > 140 ? 'High' : 'Low') : 'No Data';
  const tpCelsius = hasTp ? (tp < 45 ? tp : Math.round((tp - 32) * 5 / 9 * 10) / 10) : null;
  const tpF = hasTp ? (tp < 45 ? Math.round((tp * 9 / 5 + 32) * 10) / 10 : tp) : null;
  const tpStatus = hasTp ? (tpCelsius >= 36.1 && tpCelsius <= 37.2 ? 'Normal' : tpCelsius > 37.5 ? 'Fever' : 'Low') : 'No Data';
  const spStatus = hasSp ? (sp >= 95 ? 'Excellent' : sp >= 90 ? 'Low' : 'Critical') : 'No Data';

  const healthMetrics = {
    heart: {
      icon: <Heart className="w-6 h-6" />,
      title: "Heart Rate",
      value: hasHr ? \`\${hr} BPM\` : 'No Data',
      status: hrStatus,
      color: hasHr ? "rose" : "slate",
      trend: hasHr ? (hrStatus === 'Normal' ? '↓ Stable' : hr > 100 ? '↑ Elevated' : '↓ Low') : '-',
      description: hasHr ? (hrStatus === 'Normal' ? "Resting heart rate within normal range" : hr > 100 ? "Heart rate is elevated — monitor closely" : "Heart rate is below normal") : "Connect watch to monitor heart rate",
      currentValue: hasHr ? hr : 0,
      minValue: 60,
      maxValue: 100,
      details: {
        summary: hasHr ? (hrStatus === 'Normal' ? 'Your heart rate is within a healthy range.' : 'Your heart rate needs attention — consult your doctor.') : 'No heart rate data available.',
        metrics: [
          { label: 'Resting HR', value: hasHr ? \`\${hr} BPM\` : '-', note: hasHr ? (hrStatus === 'Normal' ? 'Normal (60-100)' : 'Outside normal range') : '-' },
          { label: 'Peak HR Today', value: '-', note: 'Unavailable' },
          { label: 'Avg HR (7 days)', value: '-', note: 'Unavailable' },
          { label: 'HRV', value: '-', note: 'Unavailable' },
        ],
        recommendation: hasHr ? (hrStatus === 'Normal' ? 'Your heart rate is well-controlled. Continue regular light exercise.' : 'Elevated heart rate detected. Please rest and consult your doctor if persistent.') : 'Connect your Huawei Watch to track heart rate.'
      },
      history: hasHr ? [
        { date: 'Latest', value: \`\${hr} BPM\`, status: hrStatus }
      ] : []
    },
    temp: {
      icon: <ThermometerSun className="w-6 h-6" />,
      title: "Body Temp",
      value: hasTp ? \`\${tpF}°F\` : 'No Data',
      status: tpStatus,
      color: hasTp ? "orange" : "slate",
      trend: hasTp ? (tpStatus === 'Normal' ? 'Stable' : tpStatus === 'Fever' ? '↑ Elevated' : '↓ Low') : '-',
      description: hasTp ? (tpStatus === 'Normal' ? "Body temperature optimal" : tpStatus === 'Fever' ? "Temperature elevated — possible fever" : "Temperature below normal") : "Connect watch to monitor temperature",
      currentValue: hasTp ? tpF : 0,
      minValue: 97,
      maxValue: 100,
      details: {
        summary: hasTp ? (tpStatus === 'Normal' ? 'Body temperature is stable with no signs of fever.' : 'Temperature is outside normal range — please monitor.') : 'No body temperature data available.',
        metrics: [
          { label: 'Current Temp', value: hasTp ? \`\${tpF}°F (\${tpCelsius}°C)\` : '-', note: hasTp ? (tpStatus === 'Normal' ? 'Normal (97–99°F)' : 'Outside normal range') : '-' },
          { label: 'Morning Avg', value: '-', note: 'Unavailable' },
          { label: 'Evening Avg', value: '-', note: 'Unavailable' },
          { label: 'Max Recorded', value: '-', note: 'Unavailable' },
        ],
        recommendation: hasTp ? (tpStatus === 'Normal' ? 'Temperature regulation is functioning normally.' : 'Consult your doctor if temperature remains elevated.') : 'Connect your watch to track temperature.'
      },
      history: hasTp ? [
        { date: 'Latest', value: \`\${tpF}°F\`, status: tpStatus }
      ] : []
    },
    glucose: {
      icon: <ActivitySquare className="w-6 h-6" />,
      title: "Glucose",
      value: hasGl ? \`\${gl} mg/dL\` : 'No Data',
      status: glStatus,
      color: hasGl ? "emerald" : "slate",
      trend: hasGl ? (glStatus === 'Normal' ? '↓ Stable' : gl > 140 ? '↑ Elevated' : '↓ Low') : '-',
      description: hasGl ? (glStatus === 'Normal' ? "Within target range" : gl > 140 ? "Glucose elevated — monitor diet" : "Glucose below normal — eat something") : "Connect watch to monitor glucose",
      currentValue: hasGl ? gl : 0,
      minValue: 70,
      maxValue: 140,
      details: {
        summary: hasGl ? (glStatus === 'Normal' ? 'Blood glucose levels are well-controlled.' : 'Blood glucose is outside normal range — please consult your doctor.') : 'No blood glucose data available.',
        metrics: [
          { label: 'Current Glucose', value: hasGl ? \`\${gl} mg/dL\` : '-', note: hasGl ? (glStatus === 'Normal' ? 'Normal (70-140)' : 'Outside normal range') : '-' },
          { label: 'Fasting (est.)', value: '-', note: 'Unavailable' },
          { label: 'Avg (7 days)', value: '-', note: 'Unavailable' },
          { label: 'HbA1c (est.)', value: '-', note: 'Unavailable' },
        ],
        recommendation: hasGl ? (glStatus === 'Normal' ? 'Continue your current meal plan. Maintain low-glycemic food choices.' : 'Glucose is elevated. Reduce sugar/carb intake and consult your doctor.') : 'Connect your watch to track glucose.'
      },
      history: hasGl ? [
        { date: 'Latest', value: \`\${gl} mg/dL\`, status: glStatus }
      ] : []
    },
    bp: {
      icon: <Activity className="w-6 h-6" />,
      title: "Blood Pressure",
      value: hasBp ? \`\${sbp}/\${dbp}\` : 'No Data',
      status: bpStatus,
      color: hasBp ? "blue" : "slate",
      trend: hasBp ? (bpStatus === 'Optimal' ? 'Optimal' : bpStatus === 'Normal' ? 'Normal' : '↑ Elevated') : '-',
      description: hasBp ? (bpStatus === 'Optimal' ? "Ideal reading" : bpStatus === 'Normal' ? "Within acceptable range" : "Blood pressure is elevated") : "Connect watch to monitor BP",
      currentValue: hasBp ? sbp : 0,
      minValue: 90,
      maxValue: 140,
      details: {
        summary: hasBp ? (bpStatus !== 'High' ? 'Blood pressure is within acceptable range.' : 'Blood pressure is elevated — consult your doctor.') : 'No blood pressure data available.',
        metrics: [
          { label: 'Systolic', value: hasBp ? \`\${sbp} mmHg\` : '-', note: hasBp ? (sbp < 120 ? 'Optimal (<120)' : sbp <= 140 ? 'Normal' : 'High (>140)') : '-' },
          { label: 'Diastolic', value: hasBp ? \`\${dbp} mmHg\` : '-', note: hasBp ? (dbp < 80 ? 'Optimal (<80)' : dbp <= 90 ? 'Normal' : 'High (>90)') : '-' },
          { label: 'Pulse Pressure', value: hasBp ? \`\${sbp - dbp} mmHg\` : '-', note: hasBp ? ((sbp - dbp) >= 30 && (sbp - dbp) <= 50 ? 'Normal (30-50)' : 'Outside normal range') : '-' },
          { label: 'MAP', value: hasBp ? \`\${Math.round((sbp + 2 * dbp) / 3)} mmHg\` : '-', note: hasBp ? 'Normal (70-105)' : '-' },
        ],
        recommendation: hasBp ? (bpStatus !== 'High' ? 'Maintain a low-sodium diet and regular exercise.' : 'Blood pressure is high. Reduce salt intake, stay calm, and consult your doctor.') : 'Connect your watch to track blood pressure.'
      },
      history: hasBp ? [
        { date: 'Latest', value: \`\${sbp}/\${dbp}\`, status: bpStatus }
      ] : []
    },
    spo2: {
      icon: <Activity size={22} />,
      title: "SpO2",
      value: hasSp ? \`\${sp}%\` : 'No Data',
      status: spStatus,
      color: hasSp ? "purple" : "slate",
      trend: hasSp ? (spStatus === 'Excellent' ? 'Normal' : '↓ Low') : '-',
      description: hasSp ? (spStatus === 'Excellent' ? "Oxygen saturation optimal" : sp >= 90 ? "Oxygen level slightly low" : "Critically low oxygen — seek help") : "Connect watch to monitor SpO2",
      currentValue: hasSp ? sp : 0,
      minValue: 90,
      maxValue: 100,
      details: {
        summary: hasSp ? (spStatus === 'Excellent' ? 'Oxygen saturation levels are excellent.' : 'Oxygen saturation is below normal — please monitor.') : 'No oxygen saturation data available.',
        metrics: [
          { label: 'Current SpO2', value: hasSp ? \`\${sp}%\` : '-', note: hasSp ? (sp >= 95 ? 'Excellent (≥95%)' : sp >= 90 ? 'Low (90-94%)' : 'Critical (<90%)') : '-' },
          { label: 'Lowest Today', value: '-', note: 'Unavailable' },
          { label: 'Avg (7 days)', value: '-', note: 'Unavailable' },
          { label: 'Perfusion Index', value: '-', note: 'Unavailable' },
        ],
        recommendation: hasSp ? (spStatus === 'Excellent' ? 'SpO2 levels are excellent. No action needed.' : 'Oxygen levels are low. Practice deep breathing. Seek medical attention if persistently below 92%.') : 'Connect your watch to track SpO2.'
      },
      history: hasSp ? [
        { date: 'Latest', value: \`\${sp}%\`, status: spStatus }
      ] : []
    },
    steps: (() => {
      // Dummy data removed, leaving static placeholder or just basic metrics since this isn't from watch right now
      const stepsBase = 0;
      const stepsGoal = 5000;
      const stepsStatus = 'No Data';
      return {
        icon: <Dumbbell className="w-6 h-6" />,
        title: "Steps",
        value: 'No Data',
        status: stepsStatus,
        color: "slate",
        trend: '-',
        description: \`Daily goal: \${stepsGoal.toLocaleString()} steps\`,
        currentValue: 0,
        minValue: 0,
        maxValue: stepsGoal,
        details: {
          summary: 'No step data available.',
          metrics: [
            { label: 'Today\\'s Steps', value: '-', note: '-' },
            { label: 'Calories Burned', value: '-', note: '-' },
            { label: 'Distance', value: '-', note: '-' },
            { label: 'Active Minutes', value: '-', note: '-' },
          ],
          recommendation: 'Connect your watch to track steps.'
        },
        history: []
      };
    })(),
    sleep: (() => {
      // Dummy data removed
      return {
        icon: <BedDouble className="w-6 h-6" />,
        title: "Sleep",
        value: 'No Data',
        status: 'No Data',
        color: "slate",
        trend: '-',
        description: 'Connect watch to monitor sleep',
        currentValue: 0,
        minValue: 5,
        maxValue: 9,
        details: {
          summary: 'No sleep data available.',
          metrics: [
            { label: 'Total Sleep', value: '-', note: '-' },
            { label: 'Deep Sleep', value: '-', note: '-' },
            { label: 'REM Sleep', value: '-', note: '-' },
            { label: 'Sleep Score', value: '-', note: '-' },
          ],
          recommendation: 'Connect your watch to track sleep.'
        },
        history: []
      };
    })()
  };
`;

const finalContent = content.substring(0, startIndex) + newContent + content.substring(endIndex + endMarker.length);
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully updated Elderly.jsx');
