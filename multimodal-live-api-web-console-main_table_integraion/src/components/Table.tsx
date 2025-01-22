import React from "react";

interface TableProps {
  columns: string[];
  data: { [key: string]: any }[];
  onEdit: (updatedData: { [key: string]: any }[]) => void;
}

const Table: React.FC<TableProps> = ({ columns, data, onEdit }) => {
  const handleInputChange = (value: string, rowIndex: number, columnKey: string) => {
    const newData = [...data];
    newData[rowIndex][columnKey.toLowerCase()] = value;
    onEdit(newData);
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f4f4f4",
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td
                key={colIndex}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <input
                  type="text"
                  value={row[col.toLowerCase()] || ""}
                  onChange={(e) => handleInputChange(e.target.value, rowIndex, col)}
                  style={{ width: "100%", border: "none", textAlign: "center" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

