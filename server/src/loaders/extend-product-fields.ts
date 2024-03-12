export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;
  imports.allowedAdminProductsFields = [
    ...imports.allowedAdminProductsFields,
    "store_id",
    ,
  ];
  imports.defaultAdminProductsFields = [
    ...imports.defaultAdminProductsFields,
    "store_id",
    ,
  ];
  (imports.defaultAdminProductsRelations = [
    ...imports.defaultAdminProductsRelations,
    "store",
  ]),
    (imports.allowedAdminProductsRelations = [
      ...imports.allowedAdminProductsRelations,
      "store",
    ]);
}
