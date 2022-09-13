import { Router } from "../../devDeps.ts";
import {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productos.ts";

const router = new Router();

router
    .get('/api/producto', getProducts)
    .get('/api/producto/:id', getProduct)
    .post('/api/producto', addProduct)
    .put('/api/producto/:id', updateProduct)
    .delete('/api/producto/:id', deleteProduct)

export default router