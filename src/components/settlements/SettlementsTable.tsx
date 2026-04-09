import { useState, useEffect } from 'react';
import './settlements-components.scss';

type StatusType = 'ALL' | 'MATCHED' | 'DISCREPANCY' | 'PENDING_REVIEW';

export const SettlementsTable = () => {
  const [activeFilter, setActiveFilter] = useState<StatusType>('ALL');
  const [settlements, setSettlements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the backend when the component mounts or the filter changes
  useEffect(() => {
    const fetchSettlements = async () => {
      setIsLoading(true);
      try {
        // Calling the GET /api/settlements endpoint we built
        const response = await fetch(`http://localhost:5000/api/settlements?status=${activeFilter}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setSettlements(data);
      } catch (error) {
        console.error("Failed to fetch settlements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, [activeFilter]); // Re-run this whenever the activeFilter changes

  return (
    <div className="table-panel">
      {/* Header & Filters (Keep your existing header code here) */}
      
      <div className="table-container">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading records...</div>
        ) : (
          <table className="data-table">
            <thead>
              {/* Keep your existing table headers here */}
            </thead>
            <tbody>
              {settlements.map((row) => (
                <tr key={row.awbNumber}>
                  <td className="font-medium">{row.awbNumber}</td>
                  <td>{/* You might need to populate the courier from the Order schema if you want to display it here */}</td>
                  <td>{new Date(row.settlementDate).toLocaleDateString()}</td>
                  <td>{/* Expected COD from Order */}</td>
                  <td>{row.settledCodAmount}</td>
                  <td>
                    <span className={`status-badge badge-${row.status.toLowerCase()}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};