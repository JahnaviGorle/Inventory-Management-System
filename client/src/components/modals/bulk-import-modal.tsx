import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BulkImportModalProps {
  onClose: () => void;
}

export default function BulkImportModal({ onClose }: BulkImportModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const bulkImportMutation = useMutation({
    mutationFn: async (products: any[]) => {
      const response = await apiRequest("POST", "/api/products/bulk-import", { products });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Bulk import completed",
        description: `Successfully imported ${data.success} products. ${data.errors} errors.`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadTemplate = () => {
    const csvContent = `name,sku,description,categoryId,price,costPrice,stock,lowStockThreshold
iPhone 14 Pro,IPH14P-256,Latest iPhone model,1,99900,85000,50,10
Cotton T-Shirt,TSH-COT-001,Comfortable cotton t-shirt,2,899,450,100,20`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const parseCsvToProducts = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      const product: any = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value) {
          switch (header.trim()) {
            case 'categoryId':
            case 'stock':
            case 'lowStockThreshold':
              product[header.trim()] = parseInt(value) || null;
              break;
            case 'price':
            case 'costPrice':
              product[header.trim()] = value;
              break;
            default:
              product[header.trim()] = value;
          }
        }
      });

      if (product.name && product.sku && product.price) {
        products.push(product);
      }
    }

    return products;
  };

  const handleImport = async () => {
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const csvText = await csvFile.text();
      const products = parseCsvToProducts(csvText);
      
      if (products.length === 0) {
        toast({
          title: "No valid products found",
          description: "Please check your CSV format and try again.",
          variant: "destructive",
        });
        return;
      }

      bulkImportMutation.mutate(products);
    } catch (error) {
      toast({
        title: "File parsing error",
        description: "Could not parse the CSV file. Please check the format.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Bulk Import Products</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="form-input"
            />
            <p className="text-sm color-gray-500 mt-2">
              Upload a CSV file with your product data. 
              <button 
                type="button" 
                className="btn btn-sm" 
                onClick={downloadTemplate}
                style={{ marginLeft: 'var(--spacing-2)', padding: '0', background: 'none', color: 'var(--color-primary)', textDecoration: 'underline' }}
              >
                Download template
              </button>
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">CSV Format</label>
            <div className="text-sm color-gray-500">
              <p>Required columns: name, sku, price</p>
              <p>Optional columns: description, categoryId, costPrice, stock, lowStockThreshold</p>
            </div>
          </div>

          {csvFile && (
            <div className="form-group">
              <p className="text-sm">
                <strong>Selected file:</strong> {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleImport}
            disabled={!csvFile || bulkImportMutation.isPending}
          >
            {bulkImportMutation.isPending ? 'Importing...' : 'Import Products'}
          </button>
        </div>
      </div>
    </div>
  );
}
