/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
// //  */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface LiveAPIContextType {
  handleAIQuery: (query: string) => void;
  connected: boolean;
  initializeAudio: () => void;
  audioInitialized: boolean;
}

const LiveAPIContext = createContext<LiveAPIContextType | undefined>(undefined);

export const LiveAPIProvider: React.FC<{ children: React.ReactNode; url: string; apiKey: string }> = ({
  children,
  url,
  apiKey,
}) => {
  const [connected, setConnected] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket closed:", event);
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (message) => {
      console.log("Message received:", message.data);
    };
  }, [url]);

  const handleAIQuery = useCallback(
    (query: string) => {
      if (socketRef.current && connected) {
        const payload = {
          query,
        };
        socketRef.current.send(JSON.stringify(payload));
        console.log("Submitting query to AI:", payload);
      } else {
        console.warn("WebSocket not connected. Unable to send query.");
      }
    },
    [connected]
  );

  const initializeAudio = useCallback(() => {
    if (!audioInitialized) {
      console.log(`Initializing audio with API Key: ${apiKey} and URL: ${url}`);
      setAudioInitialized(true);
    }
  }, [audioInitialized, apiKey, url]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return (
    <LiveAPIContext.Provider value={{ handleAIQuery, connected, initializeAudio, audioInitialized }}>
      {children}
    </LiveAPIContext.Provider>
  );
};

export const useLiveAPI = () => {
  const context = useContext(LiveAPIContext);
  if (!context) {
    throw new Error("useLiveAPI must be used within a LiveAPIProvider");
  }
  return context;
};
