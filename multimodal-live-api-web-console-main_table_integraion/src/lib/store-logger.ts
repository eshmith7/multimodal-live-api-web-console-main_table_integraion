// /**
//  * Copyright 2024 Google LLC
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */


import { create } from "zustand";
import { StreamingLog } from "../multimodal-live-types";

interface StoreLoggerState {
  maxLogs: number;
  logs: Map<number, StreamingLog>; 
  log: (streamingLog: StreamingLog) => void;
  clearLogs: () => void;
  setMaxLogs: (n: number) => void;
  sortLogs: (column: keyof StreamingLog, ascending: boolean) => void;
  filterLogs: (predicate: (log: StreamingLog) => boolean) => StreamingLog[];
}

export const useLoggerStore = create<StoreLoggerState>((set, get) => ({
  maxLogs: 500,
  logs: new Map<number, StreamingLog>(),

  log: ({ date, type, message }: StreamingLog) => {
    set((state) => {
      const logs = new Map(state.logs); 
      const prevLog = [...logs.values()].at(-1);

      if (prevLog && prevLog.type === type && prevLog.message === message) {
        const updatedLog = {
          ...prevLog,
          count: (prevLog.count || 0) + 1,
        };
        logs.set(logs.size - 1, updatedLog);
      } else {

        if (logs.size >= get().maxLogs) {
          logs.delete([...logs.keys()][0]);
        }
        logs.set(logs.size, { date, type, message } as StreamingLog);
      }

      return { logs };
    });
  },

  clearLogs: () => {
    console.log("Clear logs");
    set({ logs: new Map() });
  },

  setMaxLogs: (n: number) => set({ maxLogs: n }),

  sortLogs: (column: keyof StreamingLog, ascending: boolean) => {
    set((state) => {
      const sortedLogs = [...state.logs.values()].sort((a, b) => {
      const aValue = a[column] ?? ""; 
      const bValue = b[column] ?? ""; 

      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;

        // if (a[column] < b[column]) return ascending ? -1 : 1;
        // if (a[column] > b[column]) return ascending ? 1 : -1;
        // return 0;
      });

      
      const logs = new Map<number, StreamingLog>();
      sortedLogs.forEach((log, index) => logs.set(index, log));

      return { logs };
    });
  },

  filterLogs: (predicate: (log: StreamingLog) => boolean) => {
    const state = get();
    return [...state.logs.values()].filter(predicate);
  },
}));


