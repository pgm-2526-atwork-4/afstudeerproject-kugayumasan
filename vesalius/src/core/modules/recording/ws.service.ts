import Pusher from "pusher-js";

export function subscribeToConversation(
  conversationId: string,
  token: string,
  onSuccess: () => void,
) {
  const pusher = new Pusher("e4k90jsoqcia4eiibzcd", {
    cluster: "eu",
    authEndpoint: "https://api.assistant.vesalius.ai/api/v1/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const channel = pusher.subscribe(`private-conversations.${conversationId}`);

  channel.bind(".consultation_notes.generated.success", () => {
    console.log("SUMMARY READY");
    onSuccess();
  });

  return () => {
    channel.unsubscribe();
    pusher.disconnect();
  };
}
