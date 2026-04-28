import { z } from 'zod';

export const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SEND_GROUP_MESSAGE'),
    payload: z.object({
      content: z.string({ required_error: 'Content is required' }),
      groupId: z.string().optional(), // Usaré el default chat id
    }),
  }),

  z.object({
    type: z.literal('SEND_DIRECT_MESSAGE'),
    payload: z.object({
      content: z.string({ required_error: 'Content is required' }),
      receiverId: z.string({ required_error: 'ReceiverID is required' }),
    }),
  }),

  z.object({
    type: z.literal('GET_GROUP_MESSAGES'),
    payload: z.object({
      groupId: z.string({ required_error: 'GroupID is required' }),
    }),
  }),

  z.object({
    type: z.literal('GET_DIRECT_MESSAGES'),
    payload: z.object({
      receiverId: z.string({ required_error: 'ReceiverId is required' }),
    }),
  }),
]);
