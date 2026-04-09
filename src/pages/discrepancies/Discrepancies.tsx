import { useState } from 'react';
import { DiscrepancyDetail } from '../../components/settlements/DiscrepancyDetail';
import './discrepancies.scss';

// Mock data strictly for problematic records
const disputeData = [
  { awb: 'AWB1009284', courier: 'Shiprocket', disputeType: 'Weight Dispute', expected: 850, settled: 0, status: 'ACTION_REQUIRED', date: 'Oct 12, 2025' },
  { awb: 'AWB1009299', courier: 'Delhivery', disputeType: 'Phantom RTO', expected: 1500, settled: 0, status: 'PENDING_COURIER', date: 'Oct 13, 2025' },
  { awb: 'AWB1009301', courier: 'Bluedart', disputeType: 'Short Remittance', expected: 2100, settled: 2000, status: 'ACTION_REQUIRED', date: 'Oct 13, 2025' },
];

export const Discrepancies = () => {
  const [selectedAwb, setSelectedAwb] = useState<string | null>(null);

  return (
    <div className="disputes-wrapper">
      <header className="disputes-header animate-graceful">
        <div className="header-text">
          <h1 className="disputes-title">Discrepancies & Resolutions</h1>
          <p className="disputes-subtitle">Manage and resolve active courier disputes.</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">Export Pending list</button>
        </div>
      </header>

      {/* High-level summary of action items */}
      <div className="disputes-summary animate-graceful delay-100">
        <div className="summary-stat">
          <span className="stat-label">Action Required</span>
          <span className="stat-value text-red-600 dark:text-red-400">2</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Pending Courier Reply</span>
          <span className="stat-value">1</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Total Blocked Funds</span>
          <span className="stat-value font-mono">₹ 4,450</span>
        </div>
      </div>

      <div className="disputes-content animate-graceful delay-200">
        <div className="table-container">
          <table className="disputes-table">
            <thead>
              <tr>
                <th>AWB Number</th>
                <th>Courier</th>
                <th>Dispute Type</th>
                <th>Expected (₹)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {disputeData.map((row) => (
                <tr key={row.awb}>
                  <td className="font-medium font-mono text-sm">{row.awb}</td>
                  <td>{row.courier}</td>
                  <td>
                    <span className="dispute-type-badge">{row.disputeType}</span>
                  </td>
                  <td>{row.expected}</td>
                  <td>
                    <span className={`status-pill pill-${row.status.toLowerCase()}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="resolve-btn"
                      onClick={() => setSelectedAwb(row.awb)}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusing the slide-out drawer from the Settlements module */}
      <DiscrepancyDetail 
        isOpen={!!selectedAwb} 
        onClose={() => setSelectedAwb(null)} 
        awb={selectedAwb || ''} 
      />
    </div>
  );
};