import React from 'react';

const Cells = ({ revealed, hasMine, flagged, adjacentMines, onClick, onContextMenu, rowIndex, colIndex }) => {
    return (
        <button
            onClick={() => onClick(rowIndex, colIndex)}
            onContextMenu={(e) => onContextMenu(e, rowIndex, colIndex)}
            className={`w-12 h-12 flex items-center justify-center border-2 rounded-md font-bold text-lg 
        ${revealed
                    ? hasMine
                        ? "bg-red-600 text-white border-red-800 shadow-lg"
                        : "bg-gray-400 text-gray-800 border-gray-600"
                    : "bg-blue-700 hover:bg-blue-500 border-blue-900 text-white shadow-md"
                }`}
        >
            {revealed && hasMine && "💣"}
            {revealed && !hasMine && adjacentMines > 0 && adjacentMines}
            {flagged && !revealed && "🚩"}
        </button>

    );
};

export default Cells;
