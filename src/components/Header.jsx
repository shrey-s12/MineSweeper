import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGameStatus, selectTimer, resetGame, selectMines } from '../slices/gameSlice'

const Status = () => {
    const status = useSelector(selectGameStatus);
    return (
        <div className="text-lg">
            Status: <span className={`font-bold ${status === "lost" ? "text-red-600" : "text-green-600"}`}>
                {status === "won" ? "You Won 🎉" : status}
            </span>
        </div>
    )
}

const Reset = () => {
    const dispatch = useDispatch(resetGame);

    const handleReset = () => {
        dispatch(resetGame());
    }
    return (
        <button
            onClick={handleReset}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
            Reset
        </button>

    )
}

const Header = () => {
    const mines = useSelector(selectMines);
    const timer = useSelector(selectTimer);

    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <Status />
            <div className="text-lg">
                Timer: <span className="font-mono text-yellow-400">{timer}s</span>
            </div>
            <div className="text-lg">
                Mines Left: <span className="font-mono text-red-400">{mines}</span>
            </div>
            <Reset />
        </div>

    )
}

export default Header