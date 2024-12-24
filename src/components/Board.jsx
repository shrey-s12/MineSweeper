import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGrid, revealCell, placeFlag, selectGameStatus } from '../slices/gameSlice';
import Cells from './Cells';

const Board = () => {
    const grid = useSelector(selectGrid);
    const gameStatus = useSelector(selectGameStatus);
    const dispatch = useDispatch();

    const handleCellClick = (rowIndex, colIndex) => {
        if (gameStatus === "lost" || gameStatus === "won") return;
        dispatch(revealCell({ rowIndex, colIndex }));
    };

    let handleFlagClick = (e, rowIndex, colIndex) => {
        e.preventDefault();
        if (gameStatus === "lost" || gameStatus === "won") return;
        dispatch(placeFlag({ rowIndex, colIndex }));
    };

    return (
        <div className="bg-gray-900 mt-2 p-6 rounded-lg">
            <div className="grid gap-1 justify-center"
                style={{ gridTemplateColumns: `repeat(${grid[0].length}, 3rem)` }}>

                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cells
                            key={`${rowIndex}-${colIndex}`}
                            revealed={cell.revealed}
                            hasMine={cell.hasMine}
                            flagged={cell.flagged}
                            adjacentMines={cell.adjacentMines}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            onClick={handleCellClick}
                            onContextMenu={handleFlagClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Board;
