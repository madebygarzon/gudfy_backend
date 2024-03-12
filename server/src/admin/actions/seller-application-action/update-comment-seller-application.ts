import axios from "axios";

export const updateCommentSellerApplication = async (
  customer_id,
  comment_status
) => {
  try {
    const getlist = await axios.post(
      "http://localhost:9000/admin/commentsellerapplication",
      { customer_id, comment_status },
      { withCredentials: true }
    );
    return getlist.data;
  } catch (error) {}
};
