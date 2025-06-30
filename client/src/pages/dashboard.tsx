import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentProducts from "@/components/dashboard/recent-products";
import RecentActivity from "@/components/dashboard/recent-activity";
import LowStockAlerts from "@/components/dashboard/low-stock-alerts";
import AddProductModal from "@/components/modals/add-product-modal";
import BulkImportModal from "@/components/modals/bulk-import-modal";
import { useState } from "react";

export default function Dashboard() {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  const generateReport = () => {
    // TODO: Implement report generation
    alert('Report generation feature would be implemented here');
  };

  const exportData = () => {
    // TODO: Implement data export
    alert('Data export feature would be implemented here');
  };

  return (
    <>
      <StatsCards />

      <div className="content-grid">
        <RecentProducts />
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
          <p className="card-subtitle">Common inventory management tasks</p>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddProductModal(true)}
            >
              <span>➕</span>
              Add New Product
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowBulkImportModal(true)}
            >
              <span>📤</span>
              Bulk Import
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={generateReport}
            >
              <span>📊</span>
              Generate Report
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={exportData}
            >
              <span>📥</span>
              Export Data
            </button>
          </div>
        </div>
      </div>

      <LowStockAlerts />

      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} />
      )}

      {showBulkImportModal && (
        <BulkImportModal onClose={() => setShowBulkImportModal(false)} />
      )}
    </>
  );
}
