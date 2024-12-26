import GamePage from './pages/GamePage';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-800">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-lg">
        Minesweeper
      </h1>
      <div className="bg-gray-600 shadow-lg rounded-xl p-6">
        <GamePage />
      </div>
    </div>
  );
}

export default App;
