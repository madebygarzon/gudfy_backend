import type { WidgetConfig } from "@medusajs/admin";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
import { updateSellerAplicationAction } from "../../actions/seller-application-action/update-seller-application-action";
import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
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

type objectSellerApplication = {
  customer_id: string;
  customer: {
    name: string;
    email: string;
  };
  approved: boolean;
  rejected: boolean;
  created_at: string;
};

type ListDataSellerApplication = {
  dataSellers: Array<objectSellerApplication>;
  dataFilter?: Array<objectSellerApplication>;
  dataPreview: Array<objectSellerApplication>;
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
    value: "Aprobado",
    label: "Aprobado",
  },
  {
    value: "Rechazado",
    label: "Rechazado",
  },
  {
    value: "Pendiente",
    label: "Pendiente",
  },
];
const registerNumber = [5, 10, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

const SellerApplication = () => {
  //manejo de la tabla --------------
  const [dataCustomer, setDataCustomer] = useState<ListDataSellerApplication>({
    dataSellers: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);
  //----------------------------------

  //datos para el control y actualizacion del status
  const [dataStatus, setDataStatus] = useState<DataStatusSellerApplication>({
    payload: "",
    customer: {
      customer_id: "",
      name: "",
      email: "",
    },
    comment_status: "",
  });
  //Modals
  //modal copnfirmacion de Aceptar solicitud
  const [openModalAccept, changeModalAccept] = useState(false);
  //modal copnfirmacion de Rechazar solicitud
  const [openModalReject, changeModalReject] = useState(false);
  //modaal commentario de la solicitud
  const [modalComment, changeModalCommen] = useState({
    open: false,
    customer: { name: "", customer_id: "", email: "" },
  });

  const handlerGetListApplication = async (order?: string) => {
    setIsLoading(true);
    const dataApplication = await getListSellerApplication(order).then((e) => {
      setIsLoading(false);
      return e;
    });
    setPagetotal(Math.ceil(dataApplication.length / rowsPages));
    setDataCustomer({
      dataSellers: dataApplication,
      dataPreview: handlerPreviewSellerAplication(dataApplication, 1),
      count: dataApplication.length,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataCustomer.dataFilter!) {
          setDataCustomer({
            ...dataCustomer,
            dataPreview: handlerPreviewSellerAplication(
              dataCustomer.dataFilter,
              page + 1
            ),
          });
          return old + 1;
        } else
          setDataCustomer({
            ...dataCustomer,
            dataPreview: handlerPreviewSellerAplication(
              dataCustomer.dataSellers,
              page + 1
            ),
          });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        if (dataCustomer.dataFilter!) {
          setDataCustomer({
            ...dataCustomer,
            dataPreview: handlerPreviewSellerAplication(
              dataCustomer.dataFilter,
              page - 1
            ),
          });
          return old - 1;
        } else
          setDataCustomer({
            ...dataCustomer,
            dataPreview: handlerPreviewSellerAplication(
              dataCustomer.dataSellers,
              page - 1
            ),
          });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<objectSellerApplication>,
    page,
    rows?
  ) => {
    // cadena de array para filtrar segun la pagina , se debe de pensar en cambiar el llamado a la api para poder
    // solicitar unicamente los que se estan pidiendo en la paginacion
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    //setPage(1);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListApplication();
  }, []);

  const handlerActionStatus = async () => {
    updateSellerAplicationAction({
      payload: dataStatus.payload,
      customer_id: dataStatus.customer.customer_id,
      comment_status: dataStatus.comment_status,
    }).then(() => {
      changeModalAccept(false);
      changeModalReject(false);
      handlerGetListApplication();
      setPage(1);
    });
  };
  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case dataSelecFilter[1].value:
        dataFilter = dataCustomer.dataSellers.filter((data) => data.approved);
        break;
      case dataSelecFilter[2].value:
        dataFilter = dataCustomer.dataSellers.filter((data) => data.rejected);
        break;
      case dataSelecFilter[3].value:
        dataFilter = dataCustomer.dataSellers.filter(
          (data) => !data.approved && !data.rejected
        );
        break;
      default:
        dataFilter = dataCustomer.dataSellers;
        break;
    }
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === dataSelecFilter[0].value ? [] : dataFilter,
    });
  };
  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(
        dataCustomer.dataFilter!
          ? dataCustomer.dataFilter
          : dataCustomer.dataSellers,
        1,
        valueInt
      ),
    });
  };

  const handlerOrderDate = (value: boolean) => {
    handlerGetListApplication(value ? "ASC" : "DESC");
    setOrderDate((data) => !data);
  };
  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataCustomer.dataSellers.filter((data) => {
      const nameIncludes = data.customer.name
        .toLowerCase()
        .includes(e.toLowerCase());
      const emailIncludes = data.customer.email
        .toLowerCase()
        .includes(e.toLowerCase());

      // Devuelve true si la palabra enviada está incluida en el nombre o el correo electrónico
      return nameIncludes || emailIncludes;
    });
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <>
          <div className="mt-2 h-[120px] flex justify-between">
            <h1 className=" text-xl font-bold"> Solicitud de vendedores</h1>
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
          {isLoading ? (
            <div className="min-h-[293px] flex items-center justify-center">
              <Spinner size="large" variant="secondary" />
            </div>
          ) : dataCustomer.dataPreview.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      className="flex cursor-pointer items-center"
                      onClick={() => handlerOrderDate(orderDate)}
                    >
                      Fecha{" "}
                      <TriangleDownMini
                        className={clsx("", {
                          "rotate-180": orderDate === true,
                        })}
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>Usuario</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview?.map((data, i) => {
                    return (
                      <Table.Row key={data.customer_id}>
                        <Table.Cell>
                          {formatarFecha(data.created_at)}
                        </Table.Cell>
                        <Table.Cell>{data.customer.name}</Table.Cell>
                        <Table.Cell>{data.customer.email}</Table.Cell>
                        <Table.Cell>
                          {data.approved
                            ? "Aprobado"
                            : data.rejected
                            ? "Rechazado"
                            : "Pendiente"}
                        </Table.Cell>
                        <Table.Cell className="flex gap-x-2 items-center">
                          <IconButton>
                            <Eye />
                          </IconButton>
                          <DropdownMenu>
                            <DropdownMenu.Trigger asChild>
                              <IconButton>
                                <PencilSquare className="text-ui-fg-subtle" />
                              </IconButton>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Item
                                className="gap-x-2"
                                onClick={() => {
                                  setDataStatus({
                                    payload: APPROVED,
                                    customer: {
                                      customer_id: data.customer_id,
                                      ...data.customer,
                                    },
                                  });
                                  changeModalAccept(true);
                                }}
                              >
                                <Check className="text-ui-fg-subtle" />
                                Aceptar
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                className="gap-x-2"
                                onClick={() => {
                                  setDataStatus({
                                    payload: REJECTED,
                                    customer: {
                                      customer_id: data.customer_id,
                                      ...data.customer,
                                    },
                                    comment_status: "",
                                  });
                                  changeModalReject(true);
                                }}
                              >
                                <XMark className="text-ui-fg-subtle" />
                                Rechazar
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu>
                          <IconButton
                            onClick={() => {
                              changeModalCommen({
                                open: true,
                                customer: {
                                  name: data.customer.name,
                                  customer_id: data.customer_id,
                                  email: data.customer.email,
                                },
                              });
                            }}
                          >
                            <ChatBubble />
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
        </>
      </div>

      <div className="flex p-6">
        <div className="w-[35%]">{`${
          dataCustomer.count || 0
        } solicitudes`}</div>
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
      {
        // Modals
      }
      <ModalApprobed
        openModal={openModalAccept}
        changeModal={changeModalAccept}
        data={dataStatus}
        setDataStatus={setDataStatus}
        handlerActionStatus={handlerActionStatus}
      />
      <ModalRejected
        openModal={openModalReject}
        changeModal={changeModalReject}
        data={dataStatus}
        setDataStatus={setDataStatus}
        handlerActionStatus={handlerActionStatus}
      />
      {modalComment.open ? (
        <ModalComment
          changeModal={changeModalCommen}
          customer={modalComment.customer}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

type ModalProps = {
  openModal: boolean;
  changeModal: (value: React.SetStateAction<boolean>) => void;
  data: DataStatusSellerApplication;
  setDataStatus: React.Dispatch<
    React.SetStateAction<DataStatusSellerApplication>
  >;
  handlerActionStatus: () => void;
};

const ModalApprobed: React.FC<ModalProps> = ({
  openModal,
  changeModal,
  data,
  setDataStatus,
  handlerActionStatus,
}) => {
  if (!openModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Aprobar solicitud al usuario: {data.customer?.name} -{" "}
              {data.customer?.email}
            </Heading>
            <Text className="text-ui-fg-subtle text-center">
              ¿Estás seguro de aprobar a este usuario?
            </Text>
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5">
          <Button onClick={handlerActionStatus}>Aceptar</Button>
          <Button variant="danger" onClick={() => changeModal(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModalRejected: React.FC<ModalProps> = ({
  openModal,
  changeModal,
  data,
  setDataStatus,
  handlerActionStatus,
}) => {
  if (!openModal) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Rechazar solicitud al usuario: {data.customer?.name} -{" "}
              {data.customer?.email}
            </Heading>
            <Text className="text-ui-fg-subtle">
              Comenta las razones del rechazo de solicitud:
            </Text>
            <Textarea
              value={data.comment_status}
              onChange={(e) => {
                setDataStatus((prevData) => ({
                  ...prevData,
                  comment_status: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5 ">
          <Button onClick={handlerActionStatus}>Aceptar</Button>
          <Button variant="danger" onClick={() => changeModal(false)}>
            Cancelar
          </Button>
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
  zone: "customer.list.after",
};

export default SellerApplication;
