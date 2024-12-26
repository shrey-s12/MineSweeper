import React from 'react';

const Cells = ({ cellState, hasMine, adjacentMines, onClick, onContextMenu, rowIndex, colIndex }) => {
    return (
        <button
            onClick={() => onClick(rowIndex, colIndex)}
            onContextMenu={(e) => onContextMenu(e, rowIndex, colIndex)}
            className={`w-10 h-10 flex items-center justify-center border-2 rounded-md font-bold text-lg 
            ${cellState === "open"
                    ? hasMine
                        ? "bg-red-600 text-white border-red-800 shadow-lg" // Cell with mine
                        : "bg-gray-400 text-gray-800 border-gray-600 shadow-md" // Opened cell without mine
                    : "bg-blue-700 hover:bg-blue-500 border-blue-900 text-white shadow-md" // Closed or flagged cell
                }`}
        >
            {cellState === "open" && hasMine && "💣"}
            {cellState === "flagged" && "🚩"}
            {cellState === "open" && !hasMine && adjacentMines > 0 && adjacentMines}
        </button>
    );
};

export default Cells;
