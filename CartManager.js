import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async #getCarts() {
    try {
      const carts = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(carts);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async createCart() {
    const carts = await this.#getCarts();
    const newCart = {
      id: randomUUID(),
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#getCarts();
    const cart = carts.find((c) => c.id === id);
    if (!cart) {
      throw new Error('Carrinho não encontrado.');
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) {
      throw new Error('Carrinho não encontrado.');
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex((p) => p.product === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
} 
