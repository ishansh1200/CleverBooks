import { useState, useEffect } from 'react';
import './logs.scss';

type LogTab = 'JOBS' | 'NOTIFICATIONS';

export const SystemLogs = () => {
  const [activeTab, setActiveTab] = useState<LogTab>('JOBS');
  const [jobs, setJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === 'JOBS' ? 'jobs' : 'notifications';
        const response = await fetch(`http://localhost:5000/api/logs/${endpoint}`);
        const data = await response.json();
        
        if (activeTab === 'JOBS') setJobs(data);
        else setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [activeTab]);

  return (
    <div className="logs-wrapper">
      <header className="logs-header">
        <h1 className="logs-title">System Logs</h1>
        <p className="logs-subtitle">Monitor background reconciliation and external webhooks.</p>
      </header>

      <div className="logs-tabs">
        <button 
          className={`log-tab-btn ${activeTab === 'JOBS' ? 'active' : ''}`}
          onClick={() => setActiveTab('JOBS')}
        >
          Reconciliation Jobs
        </button>
        <button 
          className={`log-tab-btn ${activeTab === 'NOTIFICATIONS' ? 'active' : ''}`}
          onClick={() => setActiveTab('NOTIFICATIONS')}
        >
          Notification Deliveries
        </button>
      </div>

      <div className="logs-content">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Fetching latest logs...</div>
        ) : activeTab === 'JOBS' ? (
          <JobsTable data={jobs} />
        ) : (
          <NotificationsTable data={notifications} />
        )}
      </div>
    </div>
  );
};

const JobsTable = ({ data }: { data: any[] }) => (
  <div className="log-table-container">
    <table className="log-table">
      <thead>
        <tr>
          <th>Job ID</th>
          <th>Start Time (IST)</th>
          <th>Processed</th>
          <th>Discrepancies</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map(job => (
          <tr key={job.jobId}>
            <td className="font-mono">{job.jobId}</td>
            <td>{new Date(job.startTime).toLocaleString('en-IN')}</td>
            <td>{job.recordsProcessed}</td>
            <td className={job.discrepanciesFound > 0 ? "text-red-500 font-bold" : ""}>
              {job.discrepanciesFound}
            </td>
            <td>
              <span className={`status-badge badge-${job.status.toLowerCase()}`}>
                {job.status}
              </span>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-10">No jobs recorded yet.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const NotificationsTable = ({ data }: { data: any[] }) => (
  <div className="log-table-container">
    <table className="log-table">
      <thead>
        <tr>
          <th>AWB Ref</th>
          <th>Discrepancy</th>
          <th>Time</th>
          <th>Attempts</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map(notif => (
          <tr key={notif.eventId}>
            <td className="font-mono">{notif.awbNumber}</td>
            <td className="max-w-xs truncate" title={notif.discrepancyType}>
              {notif.discrepancyType}
            </td>
            <td>{new Date(notif.createdAt).toLocaleString('en-IN')}</td>
            <td className="text-center">{notif.attempts}</td>
            <td>
              <span className={`status-badge badge-${notif.status.toLowerCase()}`}>
                {notif.status}
              </span>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-10">No notifications sent yet.</td></tr>
        )}
      </tbody>
    </table>
  </div>
);