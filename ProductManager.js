import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #getProducts() {
    try {
      const products = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
    const products = await this.#getProducts();
    
    if (!title || !description || !code || price === undefined || stock === undefined || !category) {
        throw new Error('Todos os campos obrigatórios devem ser fornecidos.');
    }

    if (products.some(product => product.code === code)) {
        throw new Error(`Produto com o código ${code} já existe.`);
    }

    const newProduct = {
      id: randomUUID(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async getProducts() {
    return this.#getProducts();
  }

  async getProductById(id) {
    const products = await this.#getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Produto não encontrado.');
    }
    return product;
  }

  async updateProduct(id, updates) {
    const products = await this.#getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Produto não encontrado.');
    }

    const updatedProduct = { ...products[index], ...updates };
    delete updatedProduct.id; 

    products[index] = { ...products[index], ...updatedProduct };

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Produto não encontrado.');
    }

    products.splice(index, 1);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }
} 
