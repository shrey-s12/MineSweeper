import React from 'react'
import Header from '../components/Header'
import Board from '../components/Board'
import { useSelector } from "react-redux";
import Confetti from "react-confetti";
import { selectGameStatus } from "../slices/gameSlice";

const GamePage = () => {
  const status = useSelector(selectGameStatus);

  return (
    <div>
      {status === "won" && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={300}
        />
      )}
      <Header />
      <Board />
    </div>
  )
}

export default GamePage
