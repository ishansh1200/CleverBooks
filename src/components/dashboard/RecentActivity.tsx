import React from 'react';
import './dashboard-components.scss';

export const RecentActivity = () => {
  const jobs = [
    { id: 'JOB-902', time: 'Today, 02:00 AM', records: 1250, discrepancies: 45 },
    { id: 'JOB-901', time: 'Yesterday, 02:00 AM', records: 1100, discrepancies: 32 },
  ];

  return (
    <div className="activity-panel">
      <div className="activity-header">
        <h2 className="activity-title">Recent Reconciliation Jobs</h2>
      </div>
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Run Time</th>
              <th>Records Processed</th>
              <th>Discrepancies Found</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="font-medium">{job.id}</td>
                <td>{job.time}</td>
                <td>{job.records}</td>
                <td className="activity-highlight">{job.discrepancies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};