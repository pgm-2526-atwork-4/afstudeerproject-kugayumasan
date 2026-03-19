export type ChatSocketHandlers = {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
  onError?: (error: any) => void;
};

export function createChatSocket(
  chatUrl: string,
  token: string,
  handlers: ChatSocketHandlers,
) {
  const wsUrl = chatUrl.replace("https://", "wss://");

  console.log("CONNECTING CHAT SOCKET:", wsUrl);

  const ws = new WebSocket(wsUrl, ["access_token", token]);

  ws.onopen = () => {
    console.log("CHAT SOCKET CONNECTED");
    handlers.onOpen?.();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("CHAT MESSAGE:", data);
      handlers.onMessage?.(data);
    } catch {
      console.log("CHAT RAW:", event.data);
    }
  };

  ws.onerror = (err) => {
    console.error("CHAT SOCKET ERROR", err);
    handlers.onError?.(err);
  };

  ws.onclose = () => {
    console.log("CHAT SOCKET CLOSED");
    handlers.onClose?.();
  };

  return ws;
}

export function sendTranscriptChunk(ws: WebSocket, text: string) {
  if (ws.readyState !== WebSocket.OPEN) return;

  ws.send(
    JSON.stringify({
      type: "transcript",
      text,
    }),
  );
}

export function subscribeConversation(
  chatUrl: string,
  token: string,
  handlers: {
    onMessage?: (data: any) => void;
    onClose?: () => void;
  },
) {
  const url = chatUrl.replace("https://", "wss://").concat(`&token=${token}`);

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("CHAT SUBSCRIBED");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handlers.onMessage?.(data);
    } catch {
      console.log("WS RAW MESSAGE", event.data);
    }
  };

  ws.onclose = () => {
    console.log("CHAT SOCKET CLOSED");
    handlers.onClose?.();
  };

  ws.onerror = (err) => {
    console.error("CHAT SOCKET ERROR", err);
  };

  return () => {
    ws.close();
  };
}
