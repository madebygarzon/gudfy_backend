import axios from "axios";
axios.defaults.withCredentials = true;
export const getListSellerApplication = async (order: string = "DESC") => {
  try {
    const getlist = await axios.get(
      "http://localhost:9000/admin/sellerapplication",
      { withCredentials: true, params: { order } }
    );
    return getlist.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
