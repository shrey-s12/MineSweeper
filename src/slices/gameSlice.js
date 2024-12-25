import { createSlice } from "@reduxjs/toolkit";

const grid = [
    [
        { cellState: "closed", hasMine: false }, // cellSate: "open", "closed", "flagged"
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
    ],
    [
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: true }, // 💣
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
    ],
    [
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: true }, // 💣
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
    ],
    [
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: true }, // 💣
        { cellState: "closed", hasMine: false },
    ],
    [
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
        { cellState: "closed", hasMine: false },
    ],
]
const mines = grid.flat().filter(c => c.hasMine).length;

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];

const initialState = {
    grid,
    gameStatus: "idle", // idle, Playing, lost, won
    mines,
    timer: 0,
}

const gameSlice = createSlice({
    name: "gameNameInSlice",
    initialState,
    reducers: {
        revealCell: (state, action) => {
            if (state.gameStatus === "lost" || state.gameStatus === "won") return;

            const { rowIndex, colIndex } = action.payload;
            const cell = state.grid[rowIndex][colIndex];

            // Start the game if not already in progress
            if (state.gameStatus === "idle") {
                state.gameStatus = "Playing";
            }

            // If the cell is already open or flagged, do nothing
            if (cell.cellState === "open" || cell.cellState === "flagged") return;

            // Helper function to count adjacent mines
            const countAdjacentMines = (row, col) => {

                return directions.reduce((count, [dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (
                        newRow >= 0 && newRow < state.grid.length &&
                        newCol >= 0 && newCol < state.grid[0].length &&
                        state.grid[newRow][newCol].hasMine
                    ) {
                        return count + 1;
                    }
                    return count;
                }, 0);
            };

            // Helper function for recursive revealing
            const revealNeighbors = (row, col) => {

                directions.forEach(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (
                        newRow >= 0 && newRow < state.grid.length &&
                        newCol >= 0 && newCol < state.grid[0].length
                    ) {
                        const neighbor = state.grid[newRow][newCol];
                        if (neighbor.cellState === "closed") {
                            neighbor.cellState = "open";
                            const mines = countAdjacentMines(newRow, newCol);
                            neighbor.adjacentMines = mines;

                            if (mines === 0) {
                                revealNeighbors(newRow, newCol); // Recursive reveal
                            }
                        }
                    }
                });
            };

            // Reveal the current cell
            cell.cellState = "open";
            const adjacentMines = countAdjacentMines(rowIndex, colIndex);
            cell.adjacentMines = adjacentMines;

            // If the cell has a mine, the game is lost
            if (cell.hasMine) {
                state.gameStatus = "lost";

                // Reveal all mines
                state.grid.forEach(row =>
                    row.forEach(cell => {
                        if (cell.hasMine) {
                            cell.cellState = "open";
                        }
                    })
                );
            } else if (adjacentMines === 0) {
                // Reveal neighboring cells if no adjacent mines
                revealNeighbors(rowIndex, colIndex);
            }

            // Check if all non-mined cells are revealed
            const totalCells = state.grid.length * state.grid[0].length;
            const revealedCells = state.grid.flat().filter(c => c.cellState === "open").length;
            const totalMines = mines;

            if (revealedCells === totalCells - totalMines) {
                state.gameStatus = "won";
            }
        },
        placeFlag: (state, action) => {
            if (state.gameStatus === "lost" || state.gameStatus === "won") return;
            const { rowIndex, colIndex } = action.payload;
            const cell = state.grid[rowIndex][colIndex];
            state.gameStatus = "Playing";

            // If the cell is already open, do nothing
            if (cell.cellState === "open") return;

            // Toggle the flagged property and update the minesLeft count
            cell.cellState = cell.cellState === "flagged" ? "closed" : "flagged";
            cell.cellState === "flagged" ? state.mines -= 1 : state.mines += 1;
        },
        updateTime: (state) => {
            state.timer += 1;
        },
        resetGame: (state) => {
            state.grid.forEach(row =>
                row.forEach(cell => {
                    cell.cellState = "closed";
                })
            );
            state.gameStatus = "idle";
            state.timer = 0;
            state.mines = mines;
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