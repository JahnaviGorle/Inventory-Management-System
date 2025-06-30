import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProductWithCategory } from "@shared/schema";
import ProductCard from "@/components/products/product-card";
import AddProductModal from "@/components/modals/add-product-modal";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products', { search: searchQuery, categoryId: selectedCategory, lowStock: showLowStock }],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card mb-6">
        <div className="card-header">
          <h1 className="card-title">Products</h1>
          <p className="card-subtitle">Manage your inventory items</p>
        </div>
        <div className="card-content">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <select
              className="form-input"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : undefined)}
              style={{ maxWidth: '200px' }}
            >
              <option value="">All Categories</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
              />
              Low Stock Only
            </label>
            <button
              className="btn btn-primary ml-auto"
              onClick={() => setShowAddModal(true)}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card">
          <div className="card-content text-center">
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-sm color-gray-500">
              {searchQuery || selectedCategory || showLowStock
                ? "Try adjusting your filters"
                : "Get started by adding your first product"
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
