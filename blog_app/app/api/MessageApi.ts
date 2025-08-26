import instance from "./apiContanst";

export const createMessage = async (data: {
  chatId: string;
  senderId: string;
  text: string;
}) => {
  const response = await instance.post("/message/create", data);
  return response.data;
};

export const getMessages = async (chatId: string) => {
  const response = await instance.get(`/message/${chatId}`);
  return response.data;
};
