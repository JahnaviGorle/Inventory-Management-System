import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: lowStockProducts = [] } = useQuery({
    queryKey: ['/api/products/low-stock'],
  });

  const { data: outOfStockProducts = [] } = useQuery({
    queryKey: ['/api/products/out-of-stock'],
  });

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats,
      lowStockProducts,
      outOfStockProducts
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <>
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title">Reports & Analytics</h1>
          <p className="card-subtitle">Detailed inventory insights and reporting</p>
        </div>
        <div className="card-content">
          <div className="flex gap-4">
            <button className="btn btn-primary" onClick={generateReport}>
              📊 Generate Report
            </button>
            <button className="btn btn-secondary" onClick={printReport}>
              🖨️ Print Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{stats?.totalProducts || 0}</div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-icon primary">📦</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{formatCurrency(stats?.totalValue || 0)}</div>
              <div className="stat-label">Total Inventory Value</div>
            </div>
            <div className="stat-icon success">💰</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{stats?.lowStockCount || 0}</div>
              <div className="stat-label">Low Stock Items</div>
            </div>
            <div className="stat-icon warning">⚠️</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-value">{stats?.outOfStockCount || 0}</div>
              <div className="stat-label">Out of Stock</div>
            </div>
            <div className="stat-icon danger">🚫</div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Low Stock Report */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Low Stock Items</h2>
            <p className="card-subtitle">Products requiring attention</p>
          </div>
          <div className="card-content">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-sm color-gray-500">No low stock items</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Stock</th>
                      <th>Threshold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product: any) => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td className="text-sm color-gray-500">{product.sku}</td>
                        <td>
                          <span className="badge badge-warning">{product.stock}</span>
                        </td>
                        <td className="text-sm color-gray-500">{product.lowStockThreshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Out of Stock Report */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Out of Stock Items</h2>
            <p className="card-subtitle">Products needing immediate restocking</p>
          </div>
          <div className="card-content">
            {outOfStockProducts.length === 0 ? (
              <p className="text-center text-sm color-gray-500">No out of stock items</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStockProducts.map((product: any) => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td className="text-sm color-gray-500">{product.sku}</td>
                        <td>
                          <span className="badge badge-gray">{product.category?.name || 'Uncategorized'}</span>
                        </td>
                        <td className="font-medium">{formatCurrency(parseFloat(product.price))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
