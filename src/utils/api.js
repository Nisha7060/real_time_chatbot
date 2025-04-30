export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const GET_WAB_CHATLIST = `${API_BASE_URL}/getWabChatList`;
export const GET_CHAT_MESSAGES = `${API_BASE_URL}/getWabChatDetails`;
export const GET_CHAT_TAGS = `${API_BASE_URL}/getWabChatTags`;
export const START_NEW_CHAT = `${API_BASE_URL}/startNewWabChat`;
export const CREATE_WAB_TAGS = `${API_BASE_URL}/createWabChatTags`;
export const ASSIGN_WAB_TAGS = `${API_BASE_URL}/assignWabChatTags`;
export const UPDATE_COLLABORATOR = `${API_BASE_URL}/updateWabChatCollaborator`;
export const SEND_WAB_MEDIA = `${API_BASE_URL}/uploadMedia`;
