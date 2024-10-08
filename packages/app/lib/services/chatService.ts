import { IChat } from 'streameth-new-server/src/interfaces/chat.interface';
import { IExtendedChat } from '../types';
import { apiUrl } from '../utils/utils';
import { fetchClient } from './fetch-client';

export async function fetchChat({
  stageId,
}: {
  stageId?: string;
}): Promise<IExtendedChat[]> {
  try {
    if (!stageId) {
      return [];
    }

    const data = await fetch(`${apiUrl()}/chats/${stageId}`, {
      cache: 'no-store',
    });

    if (!data.ok) {
      return [];
    }
    return (await data.json()).data;
  } catch (e) {
    console.log('error in fetchChat', e);
    throw e;
  }
}

export const createChat = async ({
  chat,
}: {
  chat: IChat;
}): Promise<IExtendedChat> => {
  try {
    const response = await fetchClient(`${apiUrl()}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chat),
    });
    if (!response.ok) {
      throw 'Error creating chat';
    }
    return (await response.json()).data;
  } catch (e) {
    console.log('error in createChat', e);
    throw e;
  }
};
