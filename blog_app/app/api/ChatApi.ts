import instance from "./apiContanst";

export const createChat = async (data: { members: string[] }) => {
  const response = await instance.post("/chat/create", data);
  return response.data;
};

export const getChats = async (firstId: string, secondId: string) => {
  const response = await instance.get(`/chat/all/${firstId}/${secondId}`);
  return response.data;
};

export const getChatsOfUser = async (userId: string) => {
  const response = await instance.get(`/chat/${userId}`);
  return response.data;
};

export const getChatById = async (chatId: string) => {
  const response = await instance.get(`/chat/${chatId}`);
  return response.data;
};
