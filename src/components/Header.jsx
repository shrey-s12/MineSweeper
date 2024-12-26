import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGameStatus, selectTimer, selectMines, setDifficulty } from '../slices/gameSlice'

const Status = () => {
    const status = useSelector(selectGameStatus);
    return (
        <div className="text-lg border-r-2 pr-4">
            Status: <span className={`font-bold ${status === "lost" ? "text-red-600" : "text-green-600"}`}>
                {status === "won" ? "You Won 🎉" : status}
            </span>
        </div>
    )
}

const Timer = () => {
    const timer = useSelector(selectTimer);
    return (
        <div className="text-lg border-r-2 pr-4">
            Timer: <span className="font-mono text-yellow-400">{timer}s</span>
        </div>
    )
}

const MinesLeft = () => {
    const mines = useSelector(selectMines);
    return (
        <div className="text-lg border-r-2 pr-4">
            Mines Left: <span className="font-mono text-red-400">{mines}</span>
        </div>
    )
}

const Levels = () => {
    const dispatch = useDispatch();
    const handleDifficultyChange = (e) => {
        const difficulty = e.target.value;
        dispatch(setDifficulty(difficulty));
    };
    return (
        <select
            onChange={handleDifficultyChange}
            defaultValue="easy"
            className="bg-gray-700 text-white py-2 px-4 rounded-md">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>
    )
}

const Header = () => {
    return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-md flex justify-between items-center space-x-4">
            <Status />
            <Timer />
            <MinesLeft />
            <Levels />
        </div>
    )
}

export default Header