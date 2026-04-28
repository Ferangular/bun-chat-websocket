import { SERVER_CONFIG } from './config/server-config';

import indexHtml from '../public/index.html';
import { generateUuid } from './utils/generate-uuid';
import type { WebSocketData } from './types';
import { handleMessage } from './handlers/message.handler';
import { handleApiRequest } from './handlers-rest';
import {validateJwtToken} from "./utils/jwt-validation.ts";
import {userService} from "./services/user.service.ts";
import {handleGetGroupMessages} from "./handlers/group-message.handlers.ts";

// export const createServer = () => {
//   const server = Bun.serve<WebSocketData>({
//     port: SERVER_CONFIG.port,
//
//     routes: {
//       '/': indexHtml,
//     },
//
//     fetch(req, server) {
//       const url = new URL(req.url);
//
//       // Primero verificar si es una ruta de API REST
//       if (url.pathname.startsWith('/api/')) {
//         return handleApiRequest(req);
//       }
//
//       // Solo intentar WebSocket upgrade para rutas que no son API
//       const clientId = generateUuid();
//       const upgraded = server.upgrade(req, {
//         data: { clientId },
//       });
//
//       if (upgraded) {
//         return undefined;
//       }
//
//       return new Response('Upgrade failed', { status: 500 });
//     },
//     websocket: {
//       open(ws) {
//         //! Una nueva conexión
//         // console.log(`Cliente: ${ws.data.clientId}`);
//         //! Suscribir el cliente a un canal por defecto
//         // ws.subscribe(SERVER_CONFIG.defaultChannelName);
//         // ! (opcional) Aquí se puede emitir el primer mensaje al cliente
//         // Emitir el primer mensaje al cliente que se acaba de conectar
//         // ws.send({ type: 'my_type', payload: { message: 'Some Payload' } });
//         //! Emitir el mensaje a todos los clientes conectados (-1 cliente que se acaba de conectar)
//         // ws.publish(SERVER_CONFIG.defaultChannelName, JSON.stringify(handleGetParties()));
//       },
//       message(ws, message: string) {
//         //* Todos los mensajes que llegan al servidor de la misma forma
//         // Se envía a un Handler General
//         const response = handleMessage(message);
//         const responseString = JSON.stringify(response);
//
//         //! Envía el mensaje al cliente que lo envió
//         if (response.type === 'ERROR') {
//           ws.send(responseString);
//           return;
//         }
//
//         //! Si el mensaje es exclusivo del cliente que lo envió (No llamar el publish)
//         if (response.type === 'PERSONAL_RESPONSE_MESSAGE') {
//           ws.send(responseString);
//           return;
//         }
//
//         //! Si hay que enviar a todos los clientes conectados (publish + send)
//         // ws.send(responseString);
//         // ws.publish(SERVER_CONFIG.defaultChannelName, responseString);
//       },
//       close(ws, code, message) {
//         //! Una vez que el cliente se desconecta, "de-suscribir" del canal por defecto
//         // console.log(`Cliente desconectado: ${ws.data.clientId}`);
//         ws.unsubscribe(SERVER_CONFIG.defaultChannelName);
//       }, // a socket is closed
//     }, // handlers
//   });
//
//   return server;
// };


export const createServer = () => {
  const server = Bun.serve<WebSocketData>({
    port: SERVER_CONFIG.port,

    routes: {
      '/': indexHtml,
    },

    async fetch(req, server) {
      const response = await handleApiRequest(req);
      if (response) {
        return response;
      }

      const url = new URL(req.url);
      
      // Only require JWT validation for WebSocket upgrade requests
      if (url.searchParams.has('channelId')) {
        //! Identificar nuestros clientes/usuarios
        const cookies = new Bun.CookieMap(req.headers.get('Cookie') || '');
        const jwt = cookies.get('X-Token');
        if (!jwt) {
          return new Response('Unauthorized', { status: 401 });
        }

        const { userId } = await validateJwtToken(jwt);
        if (!userId) {
          return new Response('Unauthorized', { status: 401 });
        }

        const user = await userService.getSenderById(userId);
        if (!user) {
          return new Response('Unauthorized', { status: 401 });
        }

        //* Identificar nuestros clientes
        const clientId = generateUuid();
        const upgraded = server.upgrade(req, {
          data: { clientId, email: user.email, name: user.name, userId: user.id },
        });

        if (upgraded) {
          return undefined;
        }

        return new Response('Upgrade failed', { status: 500 });
      }

      // For regular HTTP requests, serve the HTML page
      return new Response(indexHtml.toString(), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    },
    websocket: {
      async open(ws) {
        //! Una nueva conexión
        //! Suscribir el cliente a un canal por defecto
        ws.subscribe(SERVER_CONFIG.defaultChannelName);
        ws.subscribe(ws.data.userId); // ABC-123 <-

        //! Cuando nos conectamos
        const groupMessages = await handleGetGroupMessages();
        ws.send(JSON.stringify(groupMessages));

        // TODO: notificar que este usuario se conectó al chat
      },
      async message(ws, message: string) {
        //* Todos los mensajes que llegan al servidor de la misma forma
        // Se envía a un Handler General
        const response = await handleMessage(message, ws.data);

        for (const message of response.personal) {
          ws.send(JSON.stringify(message));
        }

        for (const message of response.broadcast) {
          ws.publish(SERVER_CONFIG.defaultChannelName, JSON.stringify(message));
        }
      },
      close(ws, code, message) {
        //! Una vez que el cliente se desconecta, "de-suscribir" del canal por defecto

        ws.unsubscribe(SERVER_CONFIG.defaultChannelName);
        ws.unsubscribe(ws.data.userId);

        // TODO: Notificar que un usuario salio del chat
      }, // a socket is closed
    }, // handlers
  });

  return server;
};