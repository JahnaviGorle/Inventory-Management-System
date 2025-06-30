import { 
  users, 
  categories, 
  products, 
  inventoryAdjustments,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithCategory,
  type InventoryAdjustment,
  type InsertInventoryAdjustment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, ilike, sql, and, lt } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getProducts(filters?: { search?: string; categoryId?: number; lowStock?: boolean }): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(): Promise<ProductWithCategory[]>;
  getOutOfStockProducts(): Promise<ProductWithCategory[]>;

  // Inventory Adjustments
  getInventoryAdjustments(productId?: number): Promise<InventoryAdjustment[]>;
  createInventoryAdjustment(adjustment: InsertInventoryAdjustment): Promise<InventoryAdjustment>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: number, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  async getProducts(filters?: { search?: string; categoryId?: number; lowStock?: boolean }): Promise<ProductWithCategory[]> {
    let query = db
      .select({
        ...products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const conditions = [];

    if (filters?.search) {
      conditions.push(
        sql`(${ilike(products.name, `%${filters.search}%`)} OR ${ilike(products.sku, `%${filters.search}%`)})`
      );
    }

    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }

    if (filters?.lowStock) {
      conditions.push(lt(products.stock, products.lowStockThreshold));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(products.createdAt));
    
    return result.map(row => ({
      ...row.products,
      category: row.category
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select({
        ...products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (!result) return undefined;

    return {
      ...result.products,
      category: result.category
    };
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({
        ...product,
        updatedAt: new Date()
      })
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  async getLowStockProducts(): Promise<ProductWithCategory[]> {
    const result = await db
      .select({
        ...products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(
        lt(products.stock, products.lowStockThreshold),
        eq(products.isActive, true)
      ))
      .orderBy(asc(products.stock));

    return result.map(row => ({
      ...row.products,
      category: row.category
    }));
  }

  async getOutOfStockProducts(): Promise<ProductWithCategory[]> {
    const result = await db
      .select({
        ...products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(
        eq(products.stock, 0),
        eq(products.isActive, true)
      ))
      .orderBy(desc(products.updatedAt));

    return result.map(row => ({
      ...row.products,
      category: row.category
    }));
  }

  async getInventoryAdjustments(productId?: number): Promise<InventoryAdjustment[]> {
    let query = db.select().from(inventoryAdjustments);
    
    if (productId) {
      query = query.where(eq(inventoryAdjustments.productId, productId));
    }

    return await query.orderBy(desc(inventoryAdjustments.createdAt));
  }

  async createInventoryAdjustment(adjustment: InsertInventoryAdjustment): Promise<InventoryAdjustment> {
    const [newAdjustment] = await db
      .insert(inventoryAdjustments)
      .values(adjustment)
      .returning();

    // Update product stock
    const quantityChange = adjustment.type === 'out' ? -adjustment.quantity : adjustment.quantity;
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} + ${quantityChange}`,
        updatedAt: new Date()
      })
      .where(eq(products.id, adjustment.productId));

    return newAdjustment;
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    outOfStockCount: number;
  }> {
    const [stats] = await db
      .select({
        totalProducts: sql<number>`count(*)::int`,
        totalValue: sql<number>`sum(${products.price} * ${products.stock})::numeric`,
        lowStockCount: sql<number>`sum(case when ${products.stock} < ${products.lowStockThreshold} then 1 else 0 end)::int`,
        outOfStockCount: sql<number>`sum(case when ${products.stock} = 0 then 1 else 0 end)::int`
      })
      .from(products)
      .where(eq(products.isActive, true));

    return {
      totalProducts: stats.totalProducts || 0,
      totalValue: Number(stats.totalValue) || 0,
      lowStockCount: stats.lowStockCount || 0,
      outOfStockCount: stats.outOfStockCount || 0
    };
  }
}

export const storage = new DatabaseStorage();
