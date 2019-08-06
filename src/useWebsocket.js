import React from "react";

import YAxisContext from "./YAxisContext";

const parseDuration = d => {
  const durationString = Array.from(d);
  const unit = durationString.splice(-1, 1)[0];
  const durationNumber = Number(durationString.join(""));

  switch (unit) {
    case "s":
      return durationNumber * 1000;
    case "m":
      return durationNumber * 1000 * 60;
    // TODO implement other units than minutes and seconds
    default:
      return;
  }
};

const useWebsocket = url => {
  const { updateMax } = React.useContext(YAxisContext);

  const [allowedNumMessages, setAllowedNumMessages] = React.useState(0);

  const [messages, updateMessages] = React.useReducer(
    (oldMessages, newMessage) => {
      if (newMessage === "reset") {
        return [];
      }
      updateMax(newMessage.change_size);
      const newMessages = [...oldMessages, newMessage];
      if (allowedNumMessages !== 0 && newMessages.length > allowedNumMessages) {
        newMessages.splice(0, 1);
      }
      return newMessages;
    },
    []
  );

  const websocket = React.useRef(null);

  React.useEffect(() => {
    const urlObj = new URL(url);
    const interval = parseDuration(urlObj.searchParams.get("interval"));
    const backlog = parseDuration(urlObj.searchParams.get("backlog"));

    if (interval && backlog) {
      setAllowedNumMessages(Math.floor(backlog / interval) - 1);
    }

    const ws = new WebSocket(url);
    ws.addEventListener("open", () => {
      ws.addEventListener("message", ev => {
        const json = JSON.parse(ev.data);
        updateMessages(json);
      });
    });
    websocket.current = ws;
    return () => {
      updateMessages("reset");
      ws.close();
      websocket.current = null;
    };
  }, [url]);

  return messages;
};

export default useWebsocket;
