import axios from "axios";

export const getCommenSellerApplication = async (customer_id: string) => {
  try {
    const getComment = await axios.get(
      "http://localhost:9000/admin/commentsellerapplication",
      { params: { customer_id } }
    );

    return getComment.data;
  } catch (error) {
    console.log("error al obtener la lista de aplicaciones", error);
  }
};
