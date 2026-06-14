import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ClipboardCheck, Video as VideoIcon, CalendarCheck, Stethoscope, X, FileSearch, Download, ActivitySquare, TestTube } from 'lucide-react';
import { getColorClass } from '../helpers';
import GlassCard from './GlassCard';
import AnimatedCard from './AnimatedCard';
import BeautifulFooter from './BeautifulFooter';

const LabReports = ({ isDarkMode, labReports, showToast, setActiveModule }) => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);

    // Derive test categories dynamically from labReports
    const testCategories = (() => {
      const categoryMap = {
        'in-person': { name: 'In-Person Reports', icon: <ClipboardCheck className="w-5 h-5" />, color: 'rose' },
        'video': { name: 'Video Reports', icon: <VideoIcon className="w-5 h-5" />, color: 'blue' },
        'follow-up': { name: 'Follow-Up Reports', icon: <CalendarCheck className="w-5 h-5" />, color: 'purple' },
        'consultation': { name: 'Consultation Reports', icon: <Stethoscope className="w-5 h-5" />, color: 'amber' },
      };
      const counts = {};
      labReports.forEach(r => {
        const rawType = (r.raw?.type || 'consultation').toLowerCase();
        const key = Object.keys(categoryMap).find(k => rawType.includes(k)) || 'consultation';
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(categoryMap).map(([key, val]) => ({
        ...val,
        key,
        count: counts[key] || 0
      }));
    })();

    // Filter reports by selected category
    const displayedReports = categoryFilter
      ? labReports.filter(r => {
          const rawType = (r.raw?.type || 'consultation').toLowerCase();
          return rawType.includes(categoryFilter);
        })
      : labReports;

    // Generate PDF for a selected report
    const handleDownloadPDF = (report) => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('AegisCare', 14, 18);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Lab Report', 14, 28);
      doc.setFontSize(9);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 18, { align: 'right' });
      y = 50;

      // Report Info
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Report Details', 14, y);
      y += 10;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const infoItems = [
        ['Report', report.test],
        ['Patient', report.patient],
        ['Date', report.date],
        ['Status', report.status],
        ['Type', report.raw?.type || 'Consultation'],
        ['Time Slot', report.raw?.timeSlot || 'N/A'],
        ['Doctor', report.raw?.doctorName || 'N/A'],
        ['Notes', report.raw?.notes || 'None'],
      ];
      infoItems.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 14, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), 55, y);
        y += 7;
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`AegisCare Lab Report — Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`${(report.patient || 'Patient').replace(/\s+/g, '_')}_Lab_Report.pdf`);
      showToast('Lab report PDF downloaded successfully!', 'success');
    };

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <GlassCard color="green" hoverable={false} darkMode={isDarkMode}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent`}>
                Laboratory Reports
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-green-200/80' : 'text-green-700/80'}`}>
                Review and analyze patient lab test results
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {categoryFilter && (
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm border ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              )}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-green-950/40 border border-green-900/30' : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200'
              }`}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  {categoryFilter ? `Filtered: ${displayedReports.length}` : `Total: ${labReports.length}`} reports
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Recent Reports */}
        <GlassCard color="green" darkMode={isDarkMode} className="lg:col-span-2">
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            <ClipboardCheck className="w-6 h-6 animate-pulse" />
            {categoryFilter ? `Filtered Lab Reports` : `Recent Lab Reports`}
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedReports.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No reports found{categoryFilter ? ' for this category' : ''}.</p>
              </div>
            ) : (
              displayedReports.map((report, idx) => (
                <AnimatedCard key={report.id} delay={idx}>
                  <div 
                    onClick={() => setSelectedTest(selectedTest?.id === report.id ? null : report)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isDarkMode ? 'bg-gray-800/40 border-gray-700 hover:border-gray-600' : 'bg-white/50 border-gray-200 hover:border-gray-300'
                    } ${selectedTest?.id === report.id ? (isDarkMode ? 'ring-2 ring-green-500' : 'ring-2 ring-green-400') : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {report.test}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            👤 {report.patient}
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            📅 {report.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          report.status === 'Normal' 
                            ? isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                            : report.status === 'Cancelled'
                            ? isDarkMode ? 'bg-rose-900/30 text-rose-300' : 'bg-rose-100 text-rose-700'
                            : isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))
            )}
          </div>
        </GlassCard>

        {/* Test Results Analysis */}
        {selectedTest && (
          <GlassCard color="emerald" darkMode={isDarkMode}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
            }`}>
              <ActivitySquare className="w-6 h-6 animate-pulse" />
              Report Details: {selectedTest.test}
            </h3>
            
            <div className="space-y-4">
              {/* Patient Info */}
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Patient: {selectedTest.patient}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date: {selectedTest.date}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    selectedTest.status === 'Normal' ? 'text-emerald-500' :
                    selectedTest.status === 'Cancelled' ? 'text-rose-500' :
                    'text-amber-500'
                  }`}>
                    {selectedTest.status}
                  </div>
                </div>
              </div>

              {/* Report Details from raw data */}
              <div className="space-y-3">
                {[
                  { label: 'Appointment Type', value: selectedTest.raw?.type || 'N/A' },
                  { label: 'Time Slot', value: selectedTest.raw?.timeSlot || 'N/A' },
                  { label: 'Doctor', value: selectedTest.raw?.doctorName || 'Assigned Doctor' },
                  { label: 'Appointment Status', value: selectedTest.raw?.status || 'N/A' },
                  { label: 'Notes', value: selectedTest.raw?.notes || 'No additional notes' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-xl flex items-center justify-between ${
                    isDarkMode ? 'bg-gray-800/40' : 'bg-white/50'
                  }`}>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    <span className={`font-semibold capitalize ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button 
                  onClick={() => handleDownloadPDF(selectedTest)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button 
                  onClick={() => setSelectedTest(null)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Lab Test Categories */}
        <GlassCard color="green" darkMode={isDarkMode}>
          <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-green-300' : 'text-green-600'
          }`}>
            <TestTube className="w-6 h-6 animate-pulse" />
            Test Categories
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {testCategories.map((category, idx) => (
              <AnimatedCard key={idx} delay={idx}>
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                } ${categoryFilter === category.key ? (isDarkMode ? 'ring-2 ring-green-500' : 'ring-2 ring-green-400') : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? getColorClass(category.color, 'darkBg') : getColorClass(category.color, 'bg')
                    }`}>
                      <div className={isDarkMode ? getColorClass(category.color, 'darkText') : getColorClass(category.color, 'text')}>
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {category.name}
                      </h4>
                      <div className={`text-2xl font-bold ${
                        isDarkMode ? getColorClass(category.color, 'darkText') : getColorClass(category.color, 'text')
                      }`}>
                        {category.count}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setCategoryFilter(categoryFilter === category.key ? null : category.key)}
                    disabled={category.count === 0}
                    className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                      category.count === 0 
                        ? (isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                        : categoryFilter === category.key
                          ? (isDarkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white')
                          : (isDarkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white')
                    }`}
                  >
                    {categoryFilter === category.key ? 'Showing' : 'View Tests'}
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </GlassCard>

        <BeautifulFooter isDarkMode={isDarkMode} setActiveModule={setActiveModule} />
      </div>
    );
};

export default LabReports;
