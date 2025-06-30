import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import type { ProductWithCategory } from "@shared/schema";

export default function RecentProducts() {
  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products'],
  });

  const recentProducts = products.slice(0, 5);

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Products</h2>
          <p className="card-subtitle">Latest additions to your inventory</p>
        </div>
        <div className="card-content">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'badge-danger' };
    if (stock < threshold) return { label: 'Low Stock', className: 'badge-warning' };
    return { label: 'In Stock', className: 'badge-success' };
  };

  const getProductIcon = (categoryName?: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'electronics': return '📱';
      case 'clothing': return '👕';
      case 'books': return '📚';
      case 'home': return '🏠';
      default: return '📦';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Recent Products</h2>
        <p className="card-subtitle">Latest additions to your inventory</p>
      </div>
      <div className="card-content">
        {recentProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-sm color-gray-500">No products found</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => {
                  const status = getStockStatus(product.stock, product.lowStockThreshold || 10);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: 'var(--color-gray-100)', 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            {getProductIcon(product.category?.name)}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="text-sm color-gray-500">{product.sku}</td>
                      <td>
                        <span className="badge badge-gray">
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="font-medium">{product.stock}</td>
                      <td className="font-medium">{formatCurrency(product.price)}</td>
                      <td>
                        <span className={`badge ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
