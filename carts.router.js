import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';
import { ProductManager } from '../managers/ProductManager.js';

const router = Router();
const cartManager = new CartManager('src/data/carts.json');
const productManager = new ProductManager('src/data/products.json');

// POST /api/carts/
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar carrinho.' });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    // Verificando se o produto existe
    await productManager.getProductById(pid);
    
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router; 
