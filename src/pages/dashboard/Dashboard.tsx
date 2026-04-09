import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import './Dashboard.scss';

export const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header animate-graceful">
        <h1 className="dashboard-title">System Overview</h1>
        <p className="dashboard-subtitle">Logistics intelligence and settlement tracking.</p>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-section animate-graceful delay-100">
          <SummaryCards />
        </section>

        <section className="dashboard-section animate-graceful delay-200">
          <RecentActivity />
        </section>
      </div>
    </div>
  );
};