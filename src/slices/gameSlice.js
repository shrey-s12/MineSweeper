import { createSlice } from "@reduxjs/toolkit";

// Helper function to generate a grid with mines
const generateGrid = (rows, cols, totalMines) => {
    // Create an empty grid
    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            cellState: "closed",
            hasMine: false,
        }))
    );

    // Randomly place mines
    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!grid[row][col].hasMine) {
            grid[row][col].hasMine = true;
            minesPlaced++;
        }
    }

    return grid;
};

// Helper function to set the grid and mines based on difficulty
const setDifficultyProperties = (state, difficulty) => {
    switch (difficulty) {
        case "easy":
            state.grid = generateGrid(9, 9, 10);
            state.mines = 10;
            break;
        case "medium":
            state.grid = generateGrid(16, 16, 40);
            state.mines = 40;
            break;
        case "hard":
            state.grid = generateGrid(25, 25, 99);
            state.mines = 99;
            break;
        default:
            break;
    }
    state.gameStatus = "idle";
    state.timer = 0;
};

// Helper function to count adjacent mines
const countAdjacentMines = (state, row, col) => {

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
const revealNeighbors = (state, row, col) => {

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
                const mines = countAdjacentMines(state, newRow, newCol);
                neighbor.adjacentMines = mines;

                if (mines === 0) {
                    revealNeighbors(state, newRow, newCol); // Recursive reveal
                }
            }
        }
    });
};

const initialState = {
    grid: generateGrid(9, 9, 10), // Default to Easy difficulty
    gameStatus: "idle", // idle, Playing, lost, won
    mines: 10,
    timer: 0,
    difficulty: "easy", // easy, medium, hard
};
const mines = initialState.grid.flat().filter(c => c.hasMine).length;

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];

const gameSlice = createSlice({
    name: "gameNameInSlice",
    initialState,
    reducers: {
        setDifficulty: (state, action) => {
            state.difficulty = action.payload;
            setDifficultyProperties(state, action.payload);
        },
        resetGame: (state) => {
            setDifficultyProperties(state, state.difficulty);
        },
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

            // Reveal the current cell
            cell.cellState = "open";
            const adjacentMines = countAdjacentMines(state, rowIndex, colIndex);
            cell.adjacentMines = adjacentMines;

            // If the cell has a mine, the game is lost and reveal all mines and if no adjacent mines, reveal neighbors
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
                revealNeighbors(state, rowIndex, colIndex);
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
    }
});

export const { setDifficulty, resetGame, revealCell, placeFlag, updateTime } = gameSlice.actions;
export default gameSlice.reducer;

export const selectDifficulty = (state) => state.gameKeyInStore.difficulty;
export const selectGrid = state => state.gameKeyInStore.grid;
export const selectGameStatus = state => state.gameKeyInStore.gameStatus;
export const selectMines = state => state.gameKeyInStore.mines;
export const selectTimer = state => state.gameKeyInStore.timer;