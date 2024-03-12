import React, { useState, useEffect } from "react";
import { Button, Heading, Textarea, Text } from "@medusajs/ui";
import { getCommenSellerApplication } from "../../actions/seller-application-action/get-comment-seller-application";
import { updateCommentSellerApplication } from "../../actions/seller-application-action/update-comment-seller-application";
type ModalProps = {
  changeModal: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      customer: {};
    }>
  >;
  customer: {
    name: string;
    customer_id: string;
    email: string;
  };
};

export const ModalComment: React.FC<ModalProps> = ({
  changeModal,
  customer,
}) => {
  const [comment, setComment] = useState({
    changeComment: "",
    currentComment: "",
  });

  const handlerGetComment = async () => {
    const commentSeller = await getCommenSellerApplication(
      customer.customer_id
    );
    setComment({
      changeComment: commentSeller.comment_status,
      currentComment: commentSeller.comment_status,
    });
  };
  const handlerResetState = () => {
    setComment({ changeComment: "", currentComment: "" });
    changeModal({ open: false, customer: {} });
  };
  const handlerUpdateComment = async () => {
    await updateCommentSellerApplication(
      customer.customer_id,
      comment.changeComment
    );
    handlerResetState();
  };

  useEffect(() => {
    handlerGetComment();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 border border-gray-200 rounded-lg max-w-lg">
        <div className="flex w-full max-w-lg flex-col gap-y-8 justify-center items-center">
          <div className="flex flex-col gap-y-1">
            <Heading>
              Comentarios de la solicitud de: {customer.name} - {customer.email}
            </Heading>
            <Text className="text-ui-fg-subtle">
              Edite o agregue un comentario:
            </Text>
            <Textarea
              value={comment.changeComment}
              placeholder="No hay comentarios "
              onChange={(e) => {
                setComment((data) => ({
                  ...data,
                  changeComment: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 pt-5 ">
          <Button
            disabled={
              comment.currentComment === comment.changeComment ? true : false
            }
            onClick={() => handlerUpdateComment()}
          >
            Guardar
          </Button>
          <Button variant="danger" onClick={() => handlerResetState()}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
