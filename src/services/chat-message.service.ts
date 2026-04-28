import { SERVER_CONFIG } from '../config/server-config';
import { prisma } from '../prisma/db';
import type { ChatMessage } from '../types/chat-message.types';

class ChatMessageService {
  //! Parte de mensajes grupales
  async sendGroupMessage(
    content: string,
    senderId: string,
    groupId?: string
  ): Promise<ChatMessage> {
    if (!groupId) {
      const defaultGroup = await prisma.group.findFirst({
        where: {
          name: SERVER_CONFIG.defaultChannelName,
        },
      });
      if (!defaultGroup) {
        throw new Error('Default group not found');
      }
      groupId = defaultGroup.id;
    }

    const sender = await prisma.user.findFirst({
      where: {
        id: senderId,
      },
    });

    if (!sender) {
      throw new Error('User not found');
    }

    const groupMessage = await prisma.groupMessage.create({
      data: {
        content,
        groupId,
        senderId,
      },
    });

    return {
      id: groupMessage.id,
      content: content,
      createdAt: groupMessage.createdAt.getTime(),
      groupId: groupId,
      sender: {
        id: senderId,
        email: sender.email,
        name: sender.name,
      },
    };
  }

  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    const messages = await prisma.groupMessage.findMany({
      where: { groupId },
      include: {
        sender: true,
        // group: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
    });

    return messages.map((message) => ({
      id: message.id,
      groupId: groupId,
      content: message.content,
      createdAt: message.createdAt.getTime(),
      sender: {
        email: message.sender.email,
        id: message.sender.id,
        name: message.sender.name,
      },
    }));
  }

  //! Parte de mensajes directos
}

export const chatMessageService = new ChatMessageService();
