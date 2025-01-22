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
*/

import { useEffect, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLiveAPI } from "../../contexts/LiveAPIContext";
import Table from "../Table"; 


type TableRow = {
  category: string;
  value: number;
};

function AltairComponent() {
  const [tableData, setTableData] = useState<TableRow[]>([
    { category: "A", value: 28 },
    { category: "B", value: 5 },
    { category: "C", value: 43 },
  ]);
  const { handleAIQuery } = useLiveAPI();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      console.log("Voice command detected:", transcript);
      handleAIQuery(transcript);
      resetTranscript();
    }
  }, [transcript, handleAIQuery, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div>
      {/* Chart container */}
      <div id="altair-chart" style={{ width: "100%", height: "400px" }}></div>

      {/* Table for displaying data */}
      <Table
        columns={["Category", "Value"]}
        data={tableData}
        onEdit={(updatedData) => {

          const transformedData: TableRow[] = updatedData.map((row) => ({
            category: row.category || "",
            value: Number(row.value) || 0,
          }));
          console.log("Table updated data:", transformedData); 
          setTableData(transformedData); 
        }}
      />

      {/* Button to trigger Altair chart rendering via AI query*/}
      <button
        onClick={() =>
          handleAIQuery("Render an Altair chart with sample data")
        }
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Generate Chart
      </button>

      {/* Voice recognition controls */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={SpeechRecognition.startListening}
          style={{
            padding: "10px 20px",
            backgroundColor: listening ? "#28a745" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {listening ? "Listening..." : "Start Listening"}
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Stop Listening
        </button>
      </div>
    </div>
  );
}

const Altair = memo(AltairComponent);
export default Altair;

