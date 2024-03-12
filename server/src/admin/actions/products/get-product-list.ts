import Medusa from "@medusajs/medusa-js";
const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL,
  maxRetries: 3,
});
// must be previously logged in or use api token
async function ProductList() {
  const productList = await medusa.admin.products.list().then((p) => ({
    products: p.products,
    count: p.count,
  }));

  return productList;
}

export default ProductList;
