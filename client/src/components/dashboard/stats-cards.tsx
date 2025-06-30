import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="dashboard-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">Loading...</div>
                <div className="stat-label">Loading...</div>
              </div>
              <div className="stat-icon primary">📊</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-value">{stats?.totalProducts || 0}</div>
            <div className="stat-label">Total Products</div>
            <div className="stat-change positive">
              <span>↑</span>
              <span>+12%</span>
              <span>from last month</span>
            </div>
          </div>
          <div className="stat-icon primary">📦</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-value">{formatCurrency(stats?.totalValue || 0)}</div>
            <div className="stat-label">Total Inventory Value</div>
            <div className="stat-change positive">
              <span>↑</span>
              <span>+8.2%</span>
              <span>from last month</span>
            </div>
          </div>
          <div className="stat-icon success">💰</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-value">{stats?.lowStockCount || 0}</div>
            <div className="stat-label">Low Stock Items</div>
            <div className="stat-change negative">
              <span>↑</span>
              <span>+{stats?.lowStockCount || 0}</span>
              <span>this week</span>
            </div>
          </div>
          <div className="stat-icon warning">⚠️</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div>
            <div className="stat-value">{stats?.outOfStockCount || 0}</div>
            <div className="stat-label">Out of Stock</div>
            <div className="stat-change negative">
              <span>↑</span>
              <span>+{stats?.outOfStockCount || 0}</span>
              <span>this week</span>
            </div>
          </div>
          <div className="stat-icon danger">🚫</div>
        </div>
      </div>
    </div>
  );
}
