import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertInventoryAdjustmentSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize default categories if none exist
  app.get("/api/init", async (req, res) => {
    try {
      const existingCategories = await storage.getCategories();
      if (existingCategories.length === 0) {
        const defaultCategories = [
          { name: "Electronics", description: "Electronic devices and gadgets" },
          { name: "Clothing", description: "Apparel and accessories" },
          { name: "Books", description: "Books and educational materials" },
          { name: "Home & Garden", description: "Home improvement and garden supplies" },
          { name: "Sports", description: "Sports equipment and accessories" },
          { name: "Health & Beauty", description: "Health and beauty products" }
        ];
        
        for (const category of defaultCategories) {
          await storage.createCategory(category);
        }
      }
      res.json({ message: "Initialization complete" });
    } catch (error) {
      console.error("Error initializing categories:", error);
      res.status(500).json({ message: "Failed to initialize" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        lowStock: req.query.lowStock === 'true'
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/low-stock", async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  app.get("/api/products/out-of-stock", async (req, res) => {
    try {
      const products = await storage.getOutOfStockProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching out of stock products:", error);
      res.status(500).json({ message: "Failed to fetch out of stock products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Check if SKU already exists
      const existingProduct = await storage.getProductBySku(validatedData.sku);
      if (existingProduct) {
        res.status(400).json({ message: "Product with this SKU already exists" });
        return;
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      // If SKU is being updated, check if it already exists
      if (validatedData.sku) {
        const existingProduct = await storage.getProductBySku(validatedData.sku);
        if (existingProduct && existingProduct.id !== id) {
          res.status(400).json({ message: "Product with this SKU already exists" });
          return;
        }
      }
      
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Inventory Adjustments
  app.get("/api/inventory-adjustments", async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const adjustments = await storage.getInventoryAdjustments(productId);
      res.json(adjustments);
    } catch (error) {
      console.error("Error fetching inventory adjustments:", error);
      res.status(500).json({ message: "Failed to fetch inventory adjustments" });
    }
  });

  app.post("/api/inventory-adjustments", async (req, res) => {
    try {
      const validatedData = insertInventoryAdjustmentSchema.parse(req.body);
      const adjustment = await storage.createInventoryAdjustment(validatedData);
      res.status(201).json(adjustment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
        return;
      }
      console.error("Error creating inventory adjustment:", error);
      res.status(500).json({ message: "Failed to create inventory adjustment" });
    }
  });

  // Bulk import endpoint
  app.post("/api/products/bulk-import", async (req, res) => {
    try {
      const { products: bulkProducts } = req.body;
      
      if (!Array.isArray(bulkProducts)) {
        res.status(400).json({ message: "Invalid format: expected array of products" });
        return;
      }

      const results = [];
      const errors = [];

      for (let i = 0; i < bulkProducts.length; i++) {
        try {
          const validatedData = insertProductSchema.parse(bulkProducts[i]);
          
          // Check if SKU already exists
          const existingProduct = await storage.getProductBySku(validatedData.sku);
          if (existingProduct) {
            errors.push({ row: i + 1, error: `Product with SKU ${validatedData.sku} already exists` });
            continue;
          }
          
          const product = await storage.createProduct(validatedData);
          results.push(product);
        } catch (error) {
          errors.push({ row: i + 1, error: error instanceof z.ZodError ? error.errors : error.message });
        }
      }

      res.json({
        success: results.length,
        errors: errors.length,
        results,
        errorDetails: errors
      });
    } catch (error) {
      console.error("Error in bulk import:", error);
      res.status(500).json({ message: "Failed to import products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
