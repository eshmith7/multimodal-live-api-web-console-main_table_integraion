import React, { useState } from "react";
import { useLiveAPI } from "../contexts/LiveAPIContext";

const QueryTester: React.FC = () => {
  const [query, setQuery] = useState("");
  const { handleAIQuery } = useLiveAPI(); 

  const handleSubmit = () => {
    if (query.trim() !== "") {
      console.log(`Submitting Query: "${query}"`); 
      try {
        handleAIQuery(query); 
      } catch (error) {
        console.error("Error processing query:", error); 
      }
      setQuery(""); 
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f4f4f4",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      <h3>AI Query Tester</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Enter your AI query"
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      <br />
      <button
        onClick={handleSubmit} 
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default QueryTester;


