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
// */

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import Select from "react-select";
import { useLiveAPI } from "../../contexts/LiveAPIContext";
import { useLoggerStore } from "../../lib/store-logger";
import Logger, { LoggerFilterType } from "../logger/Logger";
import "./side-panel.scss";

const filterOptions = [
  { value: "conversations", label: "Conversations" },
  { value: "tools", label: "Tool Use" },
  { value: "none", label: "All" },
];

export default function SidePanel() {
  const { connected, initializeAudio, audioInitialized } = useLiveAPI();
  const [open, setOpen] = useState(true);
  const loggerRef = useRef<HTMLDivElement>(null);
  const loggerLastHeightRef = useRef<number>(-1);
  const { logs } = useLoggerStore();
  const [textInput, setTextInput] = useState("");

  // Initialize audio when connected
  useEffect(() => {
    if (connected && !audioInitialized) {
      initializeAudio();
    }
  }, [connected, audioInitialized, initializeAudio]);

  const handleSubmit = () => {
    console.log("Submitting:", textInput);
    setTextInput("");
  };

  return (
    <div className={`side-panel ${open ? "open" : ""}`}>
      <header className="top">
        <h2>Console</h2>
        {open ? (
          <button className="opener" onClick={() => setOpen(false)}>
            <RiSidebarFoldLine />
          </button>
        ) : (
          <button className="opener" onClick={() => setOpen(true)}>
            <RiSidebarUnfoldLine />
          </button>
        )}
      </header>
      <section className="indicators">
        <Select
          defaultValue={null}
          options={filterOptions}
          placeholder="Filter Logs"
        />
        <div className={cn("streaming-indicator", { connected })}>
          {connected ? "🔵 Streaming" : "⏸️ Paused"}
        </div>
      </section>
      <div className="side-panel-container" ref={loggerRef}>
        <Logger filter="none" />
      </div>
      <div className="input-container">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type something..."
        ></textarea>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

