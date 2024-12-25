import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGrid, revealCell, placeFlag, updateTime, selectGameStatus } from '../slices/gameSlice';
import Cells from './Cells';

const Board = () => {
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
        <div className="bg-gray-900 mt-2 p-6 rounded-lg">
            <div className="grid gap-1 justify-center"
                style={{ gridTemplateColumns: `repeat(${grid[0].length}, 3rem)` }}>

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
        </div>
    );
};

export default Board;
