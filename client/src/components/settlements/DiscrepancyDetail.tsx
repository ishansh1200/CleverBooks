import React from 'react';
import './drawer.scss';

// Premium close icon
const CloseIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

interface DiscrepancyDetailProps {
  isOpen: boolean;
  onClose: () => void;
  awb: string;
}

export const DiscrepancyDetail: React.FC<DiscrepancyDetailProps> = ({ isOpen, onClose, awb }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      {/* Stop propagation so clicking inside the drawer doesn't close it */}
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-header">
          <div>
            <h2 className="drawer-title">Discrepancy Details</h2>
            <p className="drawer-subtitle">AWB: <span className="font-mono font-medium">{awb}</span></p>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            {CloseIcon}
          </button>
        </header>

        <div className="drawer-content">
          <div className="alert-box alert-error">
            <span className="font-semibold">Weight Dispute Detected:</span> Courier charged for 2.5kg, but declared weight was 1.0kg.
          </div>

          <div className="comparison-grid">
            {/* Merchant Expected Column */}
            <div className="comparison-column">
              <h3 className="column-title">Merchant Expected</h3>
              <div className="data-row">
                <span className="data-label">Declared Weight</span>
                <span className="data-value">1.00 kg</span>
              </div>
              <div className="data-row">
                <span className="data-label">COD Expected</span>
                <span className="data-value">₹ 1,200.00</span>
              </div>
              <div className="data-row">
                <span className="data-label">Order Status</span>
                <span className="data-value text-emerald-600 font-medium">DELIVERED</span>
              </div>
            </div>

            {/* Courier Claimed Column */}
            <div className="comparison-column courier-column">
              <h3 className="column-title">Courier Claimed</h3>
              <div className="data-row discrepancy-highlight">
                <span className="data-label">Charged Weight</span>
                <span className="data-value">2.50 kg</span>
              </div>
              <div className="data-row">
                <span className="data-label">COD Settled</span>
                <span className="data-value">₹ 1,200.00</span>
              </div>
              <div className="data-row">
                <span className="data-label">RTO Charged</span>
                <span className="data-value">₹ 0.00</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="drawer-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary">Raise Dispute via API</button>
        </footer>
      </div>
    </div>
  );
};