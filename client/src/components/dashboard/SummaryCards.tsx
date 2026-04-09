import React from 'react';
import './dashboard-components.scss';

export const SummaryCards = () => {
  const metrics = [
    { label: 'Total Disputed Value', value: '₹ 45,230', status: 'error' },
    { label: 'Pending Reviews', value: '142', status: 'neutral' },
    { label: 'Matched Settlements', value: '8,405', status: 'success' }
  ];

  return (
    <div className="summary-container">
      {metrics.map((metric, idx) => (
        <div key={idx} className="summary-card">
          <span className="summary-label">{metric.label}</span>
          <span className={`summary-value status-${metric.status}`}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
};