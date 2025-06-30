import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import ImageUpload from "@/components/ui/image-upload";
import { useNotifications } from "@/context/notifications";

interface AddProductModalProps {
  onClose: () => void;
}

export default function AddProductModal({ onClose }: AddProductModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    categoryId: "",
    price: "",
    costPrice: "",
    stock: "",
    lowStockThreshold: "10",
    imageUrl: "" as string | null,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Product created",
        description: "New product has been added to your inventory.",
      });
      addNotification({
        title: "New Product Added",
        message: `"${formData.name}" has been successfully added to the inventory.`,
        type: "success"
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = insertProductSchema.parse({
        name: formData.name,
        sku: formData.sku,
        description: formData.description || null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        price: formData.price,
        costPrice: formData.costPrice || null,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        imageUrl: formData.imageUrl || null,
      });
      
      createProductMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Please check your input",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Product</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="productSku">SKU</label>
              <input
                type="text"
                id="productSku"
                className="form-input"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Enter SKU"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="productCategory">Category</label>
              <select
                id="productCategory"
                className="form-input"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="productPrice">Price (₹)</label>
                <input
                  type="number"
                  id="productPrice"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="productCostPrice">Cost Price (₹)</label>
                <input
                  type="number"
                  id="productCostPrice"
                  className="form-input"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="productStock">Initial Stock</label>
                <input
                  type="number"
                  id="productStock"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lowStockThreshold">Low Stock Threshold</label>
                <input
                  type="number"
                  id="lowStockThreshold"
                  className="form-input"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="productDescription">Description</label>
              <textarea
                id="productDescription"
                className="form-input"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Product Image</label>
              <ImageUpload
                onImageChange={(imageUrl) => handleInputChange('imageUrl', imageUrl || '')}
                currentImage={formData.imageUrl}
              />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            form="addProductForm" 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={createProductMutation.isPending}
          >
            {createProductMutation.isPending ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
