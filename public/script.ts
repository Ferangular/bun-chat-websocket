// Crear cookies
// const session = {
//   id: 1,
//   sessionId: 'Abc123',
// };
// const jwtToken = 'MiToken-JWT';
// document.cookie = `session=${JSON.stringify(session)}`;
// document.cookie = `X-Token=${jwtToken}`;

let socket: WebSocket;

const status = document.querySelector('#status')!;
const messageForm = document.querySelector('#message-form')! as HTMLElement;
const messageInput = document.querySelector('#input-message')! as HTMLInputElement;
const messagesContainer = document.querySelector('#messages')!;

const btnDisconnect = document.querySelector('#btn-disconnect')!;
const btnConnect = document.querySelector('#btn-connect')!;

const loginForm = document.querySelector('#login-form')! as HTMLElement;
const inputEmail = document.querySelector('#input-email')! as HTMLInputElement;
const inputPassword = document.querySelector('#input-password')! as HTMLInputElement;
const btnLogin = document.querySelector('#btn-login')!;

const createWebSocket = (): WebSocket => {
  const channelId = 'mi-canal-personalizado';

  const socket = new WebSocket(
    `ws://localhost:3200?channelId=${channelId}`
  );

  socket.onopen = () => {
    console.log('WebSocket conectado');
    messageForm.style.display = 'block';
    status.textContent = 'Conectado';
  };

  socket.onclose = () => {
    console.log('WebSocket desconectado');
    messageForm.style.display = 'none';
    status.textContent = 'Desconectado';
  };

  socket.onerror = (event) => {
    console.log({ error: event });
  };

  socket.onmessage = (event) => {
    // console.log(event.data);
    showMessage(event.data);
  };

  return socket;
};

// Check for existing JWT token on page load
const checkExistingToken = (): void => {
  const cookies = document.cookie.split(';');
  let token: string | null = null;
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'X-Token' && value !== undefined) {
      token = value;
      break;
    }
  }
  
  if (token) {
    console.log('Token encontrado, conectando automáticamente...');
    loginForm.style.display = 'none';
    socket = createWebSocket();
  } else {
    console.log('No se encontró token, mostrando formulario de login');
  }
};

// Check for existing token when page loads
checkExistingToken();

btnDisconnect.addEventListener('click', () => {
  if (socket && socket.readyState !== WebSocket.OPEN) return;
  socket.close();
});

btnConnect.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) return;
  socket = createWebSocket();
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!messageInput.value && messageInput.value.length === 0) return;

  const message = {
    type: 'SEND_GROUP_MESSAGE', // TODO: SEND_DIRECT_MESSAGE
    payload: {
      content: messageInput.value,
      // TODO: a quién le mandamos el mensaje
    },
  };

  socket.send(JSON.stringify(message));
  // showMessage(messageInput.value);
  messageInput.value = '';
});

const showMessage = (message: string): void => {
  const pre = document.createElement('pre');
  pre.innerHTML = JSON.stringify(JSON.parse(message), null, 2);

  messagesContainer.prepend(pre);
};

// Manejo del login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!inputEmail.value && inputEmail.value.length === 0) return;
  if (!inputPassword.value && inputPassword.value.length === 0) return;

  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({
      email: inputEmail.value.trim(),
      password: inputPassword.value,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    alert(data.error);
  }

  console.log({ data });
  document.cookie = `X-Token=${data.token}`;

  // Hide login form and connect WebSocket
  loginForm.style.display = 'none';
  socket = createWebSocket();
});
