import { Response, Request } from "express";
import ProductService from "../lib/product.service.js";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  console.log(products);
  res.status(200).json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);
  res.status(200).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await productService.update(productId, req.body);
  res.status(201).json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await productService.delete(req.params.productId);
  res.status(204).send("DELETED");
};
