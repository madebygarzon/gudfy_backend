import { Request, Response } from "express";

export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productData = JSON.parse(req.body.productData);
    const payload = JSON.parse(req.body.payload);
    let imagenPath = "";
    if (req.file) imagenPath = req.file.path;

    const productService = req.scope.resolve("productService");
    const productCategories = req.scope.resolve("productCategoryService");
    const productVariant = req.scope.resolve("productVariantService");
    if (imagenPath)
      productData.product.thumbnail = `${
        process.env.BACKEND_URL ?? "http://localhost:9000"
      }/${imagenPath}`;

    if (payload.includes("GEN-INFO")) {
      await productService.update(productData.id, { ...productData.product });
    }
    if (payload.includes("ADD-CATEGORY")) {
      productData.addCategories.forEach(async (category) => {
        await productCategories.addProducts(category.id, [productData.id]);
      });
    }
    if (payload.includes("DELETE-CATEGORY")) {
      productData.deleteCategories.forEach(async (category) => {
        await productCategories.removeProducts(category.id, [productData.id]);
      });
    }
    if (payload.includes("VARIANT")) {
      const dataVariant: Array<{
        title: string;
        prices: Array<{ amount: number; currency_code: string }>;
        options: Array<{ option_id: string; value: String }>;
        inventory_quantity: number;
      }> = await Promise.all(
        productData.variant.map(async (vari) => {
          return {
            title: variantTitle(vari.typeOpcionVariant),
            prices: [
              {
                amount: vari.prices,
                currency_code: "usd",
              },
            ],
            options: await Promise.all(
              vari.typeOpcionVariant.map(async (vop) => ({
                option_id: await getIptionID(
                  vop.titleOption,
                  productData.id,
                  productService,
                  vop
                ),
                value: vop.titleValueVariant,
              }))
            ),
            inventory_quantity: vari.inventory_quantity,
          };
        })
      );

      await productVariant.create(productData.id, dataVariant);
    }

    res.status(200).send({ data: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}

function variantTitle(arrayObjetos) {
  if (Array.isArray(arrayObjetos) && arrayObjetos.length > 0) {
    const palabras = arrayObjetos.map((objeto) => objeto.titleValueVariant);
    return palabras.join(" / ");
  } else {
    return "";
  }
}
async function getIptionID(titleOption, idproduct, productService, vop) {
  const option = await productService.retrieveOptionByTitle(titleOption);
  if (option) {
    return option.id;
  }
  const addOptin = await productService.addOption(idproduct, titleOption);
  const idOption = addOptin.option.find((opt) => opt.title === titleOption);
  return idOption;
}
