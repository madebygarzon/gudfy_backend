import { Request, Response } from "express";

export async function CreateSellerProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productData = JSON.parse(req.body.productData);
    const imagenPath = req.file.path;

    const productService = req.scope.resolve("productService");
    const dataProduct = {
      title: productData.product.title,
      subtitle: productData.product.subtitle,
      description: productData.product.description,
      mid_code: productData.product.mid_code,
      is_giftcard: false,
      discountable: true,
      options: productData.optionVariant.map((option) => ({
        title: option.titleOption,
      })),
      variants: productData.variant.map((v) => ({
        title: variantTitle(v.typeOpcionVariant),
        prices: [
          {
            amount: v.prices,
            currency_code: "usd",
          },
        ],
        options: v.typeOpcionVariant.map((vop) => ({
          value: vop.titleValueVariant,
        })),
        inventory_quantity: v.inventory_quantity,
      })),
      categories: productData.categories.map((c) => ({ id: c.id })),
    };

    const product = await productService.createProductStoreCustomer(
      dataProduct,
      imagenPath
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
}
//funsion para crear el titulo de la variante segun sus opciones
function variantTitle(arrayObjetos) {
  if (Array.isArray(arrayObjetos) && arrayObjetos.length > 0) {
    const palabras = arrayObjetos.map((objeto) => objeto.titleValueVariant);
    return palabras.join(" / ");
  } else {
    return "";
  }
}
