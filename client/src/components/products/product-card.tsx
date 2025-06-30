import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import type { ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Product deleted",
        description: "Product has been removed from your inventory.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', className: 'badge-danger' };
    if (product.stock < (product.lowStockThreshold || 10)) return { label: 'Low Stock', className: 'badge-warning' };
    return { label: 'In Stock', className: 'badge-success' };
  };

  const getProductIcon = () => {
    switch (product.category?.name?.toLowerCase()) {
      case 'electronics': return '📱';
      case 'clothing': return '👕';
      case 'books': return '📚';
      case 'home': return '🏠';
      case 'shoes': return '👟';
      case 'accessories': return '⌚';
      default: return '📦';
    }
  };

  const handleDelete = () => {
    deleteProductMutation.mutate(product.id);
    setShowDeleteConfirm(false);
  };

  const status = getStockStatus();

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <span style={{ fontSize: '48px' }}>
            {getProductIcon()}
          </span>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-sku">SKU: {product.sku}</p>
          
          <div className="product-stats">
            <span className="product-price">{formatCurrency(product.price)}</span>
            <span className="product-stock">{product.stock} in stock</span>
          </div>

          <div className="mb-4">
            <span className={`badge ${status.className}`}>
              {status.label}
            </span>
            {product.category && (
              <span className="badge badge-gray ml-2">
                {product.category.name}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button className="btn btn-sm btn-secondary">
              Edit
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Delete Product</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
