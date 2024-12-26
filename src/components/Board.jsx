import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGrid, revealCell, placeFlag, updateTime, selectGameStatus, resetGame } from '../slices/gameSlice';
import Cells from './Cells';

const Grid = () => {
    const grid = useSelector(selectGrid);
    const gameStatus = useSelector(selectGameStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        if (gameStatus === "Playing") {
            const timer = setInterval(() => {
                dispatch(updateTime());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [gameStatus]);

    const handleCellClick = (rowIndex, colIndex) => {
        dispatch(revealCell({ rowIndex, colIndex }));
    };

    let handleFlagClick = (e, rowIndex, colIndex) => {
        e.preventDefault();
        dispatch(placeFlag({ rowIndex, colIndex }));
    };

    return (
        <div className="grid gap-1 justify-center"
            style={{ gridTemplateColumns: `repeat(${grid[0].length}, 2.5rem)` }}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cells
                        key={`${rowIndex}-${colIndex}`}
                        cellState={cell.cellState}
                        hasMine={cell.hasMine}
                        adjacentMines={cell.adjacentMines}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        onClick={handleCellClick}
                        onContextMenu={handleFlagClick}
                    />
                ))
            )}
        </div>
    )
}

const Reset = () => {
    const dispatch = useDispatch();
    const handleReset = () => {
        dispatch(resetGame(resetGame));
    }
    return (
        <button
            onClick={handleReset}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
            Reset
        </button>
    )
}

const Emoji = () => {
    const gameStatus = useSelector(selectGameStatus);
    return (
        <div className="text-white font-bold text-2xl ml-4">
            {gameStatus === "Playing" ? "🙂" : gameStatus === "won" ? "😎" : "😵"}
        </div>
    )
}

const Board = () => {
    return (
        <div className="bg-gray-900 mt-2 p-5 rounded-lg">
            <Grid />

            <div className="flex justify-center mt-4">
                <Reset />
                <Emoji />
            </div>
        </div>
    );
};

export default Board;
