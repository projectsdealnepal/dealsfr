import api from "@/lib/interceptor";
import { setInitialLoad } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const useWebSocket = (): WebSocket | null => {
  const [wsURL, setWsURL] = useState("");
  const dispatch = useAppDispatch();
  const { initialLoad } = useAppSelector((s) => s.userData);
  const ws = useRef<WebSocket | null>(null);
  const [notificationMessage, setnotificationMessage] = useState("");
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

  const generateUUID = async () => {
    console.log("Generating UUID for WebSocket connection");
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}stream/get-uuid/`
      );
      if (response) {
        setWsURL(process.env.NEXT_PUBLIC_WS_BASE_URL + response.data.uuid);
      }
    } catch (error) {
      console.error("Failed to generate UUID:", error);
    }
  };

  useEffect(() => {
    if (initialLoad) {
      generateUUID();
      dispatch(setInitialLoad(false));
    }
  }, [wsURL, initialLoad]);

  useEffect(() => {
    if (notificationMessage !== "") {
      toast.info(notificationMessage);
    }
  }, [notificationMessage]);

  const connectWebSocket = useCallback(() => {
    console.log("Connecting to WebSocket:", wsURL);
    ws.current = new WebSocket(wsURL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      // Clear the reconnect interval if it exists
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
        reconnectInterval.current = null;
      }
    };

    ws.current.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setnotificationMessage(parsedData?.data?.message);
      console.log("Message received:", parsedData?.data?.message);
      toast.info(parsedData?.data?.message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      // Try to reconnect after 5 seconds
      setWsURL("");
      ws.current = null;
      dispatch(setInitialLoad(true));
      // if (!reconnectInterval.current) {
      //   reconnectInterval.current = setInterval(() => {
      //     console.log("Attempting to reconnect...");
      //     generateUUID();
      //   }, 5000);
      // }
    };
  }, [wsURL]);

  useEffect(() => {
    if (wsURL !== "" && !ws.current) {
      connectWebSocket();

      // Cleanup function
      // return () => {
      //   if (ws.current) {
      //     ws.current.close();
      //     ws.current = null;
      //   }
      //   if (reconnectInterval.current) {
      //     clearInterval(reconnectInterval.current);
      //     reconnectInterval.current = null;
      //   }
      // };
    }
  }, [wsURL]);

  return ws.current;
};

export default useWebSocket;
