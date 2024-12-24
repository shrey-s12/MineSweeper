import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    grid: [
        [
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
        ],
        [
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: true, flagged: false, adjacentMines: 0 }, // 💣
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 2 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
        ],
        [
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 2 },
            { revealed: false, hasMine: true, flagged: false, adjacentMines: 0 }, // 💣
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 2 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
        ],
        [
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 2 },
            { revealed: false, hasMine: true, flagged: false, adjacentMines: 0 }, // 💣
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
        ],
        [
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 0 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
            { revealed: false, hasMine: false, flagged: false, adjacentMines: 1 },
        ],
    ],
    gameStatus: "idle",
    mines: 3,
    timer: 0,
}

const gameSlice = createSlice({
    name: "gameNameInSlice",
    initialState,
    reducers: {
        revealCell: (state, action) => {
            const { rowIndex, colIndex } = action.payload;
            const cell = state.grid[rowIndex][colIndex];
            state.gameStatus = "Playing";

            // If the cell is already revealed or flagged, do nothing
            if (cell.revealed || cell.flagged) {
                return;
            }

            // Reveal the cell
            cell.revealed = true;

            // If the cell has a mine, the game is lost
            if (cell.hasMine) {
                state.gameStatus = "lost";

                state.grid.forEach(row => {
                    row.forEach(cell => {
                        if (cell.hasMine) {
                            cell.revealed = true;
                        }
                    })
                });
            } else {
                // Check if the user has revealed all non-mined cells
                const totalCells = state.grid.length * state.grid[0].length;

                // flat() -> Flattens the 2D array (state.grid) into a 1D array.
                const revealedCells = state.grid.flat().filter(c => c.revealed).length;
                const totalMines = state.mines;

                if (revealedCells === totalCells - totalMines) {
                    state.gameStatus = "won";
                }
            }
        },
        placeFlag: (state, action) => {
            const { rowIndex, colIndex } = action.payload;
            state.gameStatus = "Playing";

            // If the cell is already revealed, do nothing
            if (state.grid[rowIndex][colIndex].revealed) {
                return;
            }

            // Toggle the flagged property and update the minesLeft count
            state.grid[rowIndex][colIndex].flagged = !state.grid[rowIndex][colIndex].flagged;
            state.mines += state.grid[rowIndex][colIndex].flagged ? -1 : 1;
        },
        updateTime: (state) => {
            state.timer += 1;
        },
        resetGame: (state) => {
            state.grid.forEach(row =>
                row.forEach(cell => {
                    cell.revealed = false;
                    cell.flagged = false;
                })
            );
            state.gameStatus = "idle";
            state.timer = 0;
            state.mines = 3;
        },
    }
});

export const { initializeGame, revealCell, placeFlag, updateTime, resetGame } = gameSlice.actions;
export default gameSlice.reducer;

export const selectGame = state => state.gameKeyInStore;
export const selectGrid = state => state.gameKeyInStore.grid;
export const selectGameStatus = state => state.gameKeyInStore.gameStatus;
export const selectMines = state => state.gameKeyInStore.mines;
export const selectTimer = state => state.gameKeyInStore.timer;