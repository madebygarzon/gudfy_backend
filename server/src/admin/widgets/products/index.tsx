import type { WidgetConfig } from "@medusajs/admin";
import { Link } from "react-router-dom";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
import { updateSellerAplicationAction } from "../../actions/seller-application-action/update-seller-application-action";
import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { Thumbnail } from "../../components/thumbnail";
import {
  PencilSquare,
  XMark,
  Eye,
  Check,
  ArrowLongRight,
  ArrowLongLeft,
  TriangleDownMini,
  ChatBubble,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Input, Select, Button, Heading, Textarea, Text } from "@medusajs/ui";
import clsx from "clsx";
import { ModalComment } from "../../components/seller-application/modal-commet";
import { useAdminProducts } from "medusa-react";
import ProductList from "../../actions/products/get-product-list";
import { Product as ProductM, Customer } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

type ProductC = ProductM & {
  customer?: Customer;
};

type ListDataSellerApplication = {
  dataProducts: Array<ProductC | PricedProduct>;
  dataFilter?: Array<ProductC | PricedProduct>;
  dataPreview: Array<ProductC | PricedProduct>;
  count: number;
};
type DataStatusSellerApplication = {
  payload?: string;
  customer?: {
    customer_id: string;
    name: string;
    email: string;
  };
  comment_status?: string;
};
const dataSelecFilter = [
  {
    value: "Todos",
    label: "Todos",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "published",
    label: "Published",
  },
];
const registerNumber = [15, 30, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

const SellerApplication = () => {
  //datos de losproductos -----------------

  //---------------------------------------

  //manejo de la tabla --------------
  const [dataProduct, setDataCustomer] = useState<ListDataSellerApplication>({
    dataProducts: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(15);
  const [isLoading2, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);
  //----------------------------------

  const handlerGetListProduct = async (order?: string) => {
    setIsLoading(true);

    const product = await ProductList().then((p) => {
      setIsLoading(false);
      return p;
    });
    setPagetotal(Math.ceil(product.count / rowsPages));
    setDataCustomer({
      dataProducts: product.products,
      dataPreview: handlerPreviewSellerAplication(product.products, 1),
      count: product.count,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page + 1
            ),
          });
          return old + 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataProducts,
              page + 1
            ),
          });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page - 1
            ),
          });
          return old - 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataProducts,
              page - 1
            ),
          });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<ProductC | PricedProduct>,
    page,
    rows?
  ) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    setPage(1);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListProduct();
  }, []);

  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case dataSelecFilter[1].value:
        dataFilter = dataProduct.dataProducts.filter(
          (data) => data.status == dataSelecFilter[1].value
        );
        break;
      case dataSelecFilter[2].value:
        dataFilter = dataProduct.dataProducts.filter(
          (data) => data.status == dataSelecFilter[2].value
        );
        break;
      default:
        dataFilter = dataProduct.dataProducts;
        break;
    }
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === dataSelecFilter[0].value ? [] : dataFilter,
    });
  };
  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(
        dataProduct.dataFilter!
          ? dataProduct.dataFilter
          : dataProduct.dataProducts,
        1,
        valueInt
      ),
    });
  };

  const handlerOrderDate = (value: boolean) => {
    handlerGetListProduct(value ? "ASC" : "DESC");
    setOrderDate((data) => !data);
  };
  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataProduct.dataProducts.filter((data) => {
      if ("customer" in data) {
        const nameIncludes = data.title.toLowerCase().includes(e.toLowerCase());
        const emailIncludes = data.customer?.email
          .toLowerCase()
          .includes(e.toLowerCase());
        return nameIncludes || emailIncludes;
      }
      return false;
    });

    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg mb-10">
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className=" text-xl font-bold"> Productos</h1>
        <div className="flex gap-5 h-full items-end py-4">
          <div className="w-[156px] ">
            <Select onValueChange={handlerFilter}>
              <Select.Trigger>
                <Select.Value placeholder="Filtar por: " />
              </Select.Trigger>
              <Select.Content>
                {dataSelecFilter.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div className="w-[250px]">
            <Input
              placeholder="Search"
              id="search-input"
              type="search"
              onChange={(e) => handlerSearcherbar(e.target.value)}
            />
          </div>
        </div>
      </div>
      {isLoading2 ? (
        <div className="min-h-[293px] flex items-center justify-center">
          <Spinner size="large" variant="secondary" />
        </div>
      ) : dataProduct.dataPreview.length ? (
        <div className="min-h-[293px] pb-10">
          <Table>
            <Table.Header>
              <Table.Row>
                {/* <Table.HeaderCell
                      className="flex cursor-pointer items-center"
                      onClick={() => handlerOrderDate(orderDate)}
                    >
                      Fecha{" "}
                      <TriangleDownMini
                        className={clsx("", {
                          "rotate-180": orderDate === true,
                        })}
                      />
                    </Table.HeaderCell> */}
                <Table.HeaderCell> Nombre</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell>Collection</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Inventario</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataProduct.dataPreview?.map((data, i) => {
                return (
                  <Table.Row key={data.id}>
                    {/* <Table.Cell>
                          {formatarFecha(data.created_at)}
                        </Table.Cell> */}
                    <Table.Cell>
                      <Link to={`${data.id}`}>
                        <div className="flex gap-2">
                          <Thumbnail src={data.thumbnail} size="small" />
                          {data.title}
                        </div>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {"customer" in data ? data.customer?.email : ""}
                    </Table.Cell>
                    <Table.Cell>{"-"}</Table.Cell>
                    <Table.Cell>{data.status}</Table.Cell>
                    <Table.Cell>{"10 en stock"}</Table.Cell>

                    <Table.Cell className="flex gap-x-2 items-center">
                      <IconButton>
                        <PencilSquare className="text-ui-fg-subtle" />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className=" flex items-center justify-center min-h-[293px]">
          <XMark className="text-ui-fg-subtle" />{" "}
          <span>No hay datos relacionados</span>
        </div>
      )}

      <div className="flex pt-[10] mt-[10] ">
        <div className="w-[35%]">{`${dataProduct.count || 0} Products`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="5" />
              </Select.Trigger>
              <Select.Content>
                {registerNumber.map((num) => (
                  <Select.Item key={num} value={`${num}`}>
                    {num}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <>
            {page} of {pageTotal}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == pageTotal ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatarFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  const opcionesDeFormato: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const fechaFormateada: string = fecha.toLocaleDateString(
    "en-US",
    opcionesDeFormato
  );
  return fechaFormateada;
}

export const config: WidgetConfig = {
  zone: "product.list.before",
};

export default SellerApplication;
