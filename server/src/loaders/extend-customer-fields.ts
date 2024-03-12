export default async function () {
  // Para las rutas de la tienda
  const storeImports = (await import(
    "@medusajs/medusa/dist/api/routes/store/customers/index"
  )) as any;
  storeImports.allowedStoreCustomersFields = [
    ...storeImports.allowedStoreCustomersFields,
    "store_id",
    "role_id",
  ];
  storeImports.defaultStoreCustomersFields = [
    ...storeImports.defaultStoreCustomersFields,
    "store_id",
    "role_id",
  ];

  // Para las rutas del administrador
  const adminImports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/customers/index"
  )) as any;
  adminImports.allowedAdminCustomersFields = [
    ...adminImports.allowedAdminCustomersFields,
    "store_id",
    "role_id",
  ];
  adminImports.defaultAdminCustomersFields = [
    ...adminImports.defaultAdminCustomersFields,
    "store_id",
    "role_id",
  ];
}
