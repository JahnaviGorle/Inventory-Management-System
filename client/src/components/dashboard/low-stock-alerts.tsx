import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/currency";
import type { ProductWithCategory } from "@shared/schema";

export default function LowStockAlerts() {
  const { data: lowStockProducts = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products/low-stock'],
  });

  if (isLoading) {
    return (
      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Low Stock Alerts</h2>
          <p className="card-subtitle">Products that need restocking</p>
        </div>
        <div className="card-content">
          <div className="text-center">Loading low stock products...</div>
        </div>
      </div>
    );
  }

  const getProductIcon = (categoryName?: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'electronics': return '📱';
      case 'clothing': return '👕';
      case 'books': return '📚';
      case 'home': return '🏠';
      case 'shoes': return '👟';
      case 'accessories': return '⌚';
      default: return '📦';
    }
  };

  const getStockPercentage = (stock: number, threshold: number) => {
    return Math.min((stock / threshold) * 100, 100);
  };

  const restockProduct = (productId: number) => {
    // TODO: Implement restock functionality
    alert(`Restock functionality for product ${productId} would be implemented here`);
  };

  return (
    <div className="card mt-6">
      <div className="card-header">
        <h2 className="card-title">Low Stock Alerts</h2>
        <p className="card-subtitle">Products that need restocking</p>
      </div>
      <div className="card-content">
        {lowStockProducts.length === 0 ? (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">All products are well stocked!</h3>
            <p className="text-sm color-gray-500">
              No products are currently below their low stock threshold.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {lowStockProducts.map((product) => {
              const stockPercentage = getStockPercentage(product.stock, product.lowStockThreshold || 10);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <span style={{ fontSize: '48px' }}>
                      {getProductIcon(product.category?.name)}
                    </span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-sku">SKU: {product.sku}</p>
                    <div className="product-stats">
                      <span className="product-price">{formatCurrency(parseFloat(product.price))}</span>
                      <span className="product-stock">{product.stock} left</span>
                    </div>
                    <div className="progress-bar mb-4">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => restockProduct(product.id)}
                    >
                      Restock Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
