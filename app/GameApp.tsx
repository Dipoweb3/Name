"use client";
import { useState, useEffect } from 'react';
import { Heart, Users, Clock, Trophy, ArrowRight, Share2, Check, X } from 'lucide-react';

// Types

type GameState = 'waiting' | 'submitting' | 'voting' | 'results' | null;
type Player = string;
type Scores = { [key: string]: number };
type Stage = 'home' | 'lobby' | 'game' | 'submitting' | 'voting' | 'results';

type ShareOGImageButtonProps = {
  stage: Stage;
  roomId?: string;
  category?: string;
  players?: number;
  winner?: string;
};

// Main Layout Component
export default function GameApp() {
  const [currentPage, setCurrentPage] = useState<Stage>('home');
  const [roomId, setRoomId] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>(null);
  const [category, setCategory] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [mySubmissions, setMySubmissions] = useState<string[]>([]);
  const [scores, setScores] = useState<Scores>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle creating a new game
  const handleCreateGame = async () => {
    setLoading(true);
    try {
      // Mock API call for now
      setTimeout(() => {
        const newRoomId = 'room' + Math.floor(Math.random() * 1000);
        setRoomId(newRoomId);
        setCategory('Nigerian Artists');
        setGameState('waiting');
        setCurrentPage('lobby');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating game:', error);
      setLoading(false);
    }
  };

  // Handle joining a game
  const handleJoinGame = async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setCategory('Nigerian Artists');
        setGameState('waiting');
        setCurrentPage('lobby');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error joining game:', error);
      setLoading(false);
    }
  };

  // Handle starting the game from lobby
  const handleStartGame = () => {
    setGameState('submitting');
    setCurrentPage('game');
    setTimeLeft(60);
  };

  // Handle submitting an answer
  const handleSubmit = () => {
    if (!currentInput.trim()) return;
    setMySubmissions([...mySubmissions, currentInput]);
    setCurrentInput('');
  };

  // Handle voting on a submission
  const handleVote = (isCorrect: boolean) => {
    if (currentSubmissionIndex < submissions.length - 1) {
      setCurrentSubmissionIndex(currentSubmissionIndex + 1);
    } else {
      setGameState('results');
      calculateScores();
    }
  };

  // Calculate final scores based on voting results
  const calculateScores = () => {
    // Mock score calculation
    const mockScores: Scores = {
      'player1': 8,
      'player2': 5,
      'player3': 7
    };
    setScores(mockScores);
    setWinner('player1');
  };

  // Timer effect for submission phase
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameState === 'submitting' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'submitting') {
      setGameState('voting');
      // Mock submissions for voting phase
      setSubmissions(['Burna Boy', 'Wizkid', 'Davido', 'Tems', 'Tiwa Savage']);
    }
    return () => interval && clearInterval(interval);
  }, [gameState, timeLeft]);

  // Render appropriate page based on current state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
          onCreateGame={handleCreateGame} 
          onJoinGame={handleJoinGame}
          roomId={roomId}
          setRoomId={setRoomId}
          loading={loading}
        />;
      case 'lobby':
        return <LobbyPage 
          roomId={roomId} 
          category={category}
          players={['You', 'Player 2', 'Player 3']}
          onStartGame={handleStartGame}
        />;
      case 'game':
        return <GamePage 
          gameState={gameState}
          category={category}
          timeLeft={timeLeft}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          onSubmit={handleSubmit}
          mySubmissions={mySubmissions}
          currentSubmission={submissions[currentSubmissionIndex]}
          onVote={handleVote}
        />;
      case 'results':
        return <ResultsPage 
          scores={scores}
          winner={winner}
          category={category}
          onPlayAgain={() => setCurrentPage('home')}
        />;
      default:
        return <HomePage 
          onCreateGame={handleCreateGame} 
          onJoinGame={handleJoinGame}
          roomId={roomId}
          setRoomId={setRoomId}
          loading={loading}
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md p-6 rounded-lg">
        <Header />
        {renderPage()}
      </div>
    </div>
  );
}

// Header Component with Logo
function Header() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <Heart className="text-white mr-2" size={24} />
          <span className="text-2xl font-bold text-white">Have Fun on Farcaster</span>
        </div>
        <div className="text-sm text-white mt-1">Build apps and websites by chatting with AI</div>
      </div>
      <h1 className="text-3xl font-bold mb-2">Name, Name Arena!</h1>
    </div>
  );
}

// Share OG Image Button
function ShareOGImageButton({ stage, roomId, category, players, winner }: ShareOGImageButtonProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  let url = `${baseUrl}/api/og?stage=${stage}`;
  if (roomId) url += `&roomId=${encodeURIComponent(roomId)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (players !== undefined) url += `&players=${encodeURIComponent(players)}`;
  if (winner) url += `&winner=${encodeURIComponent(winner)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-md flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-600 transition-colors"
    >
      <Share2 size={18} />
      {copied ? 'Copied!' : 'Share OG Image'}
    </button>
  );
}

// Home Page Component
interface HomePageProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  loading: boolean;
}
function HomePage({ onCreateGame, onJoinGame, roomId, setRoomId, loading }: HomePageProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-400 text-center mb-6">
        Ready to test your wits? Create a new game room or jump into an existing one.
      </p>
      <div className="w-full mb-6">
        <label className="block text-gray-300 mb-2">Enter Room ID (Optional)</label>
        <input 
          type="text" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="ajdjd"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex w-full gap-4">
        <button
          onClick={onJoinGame}
          disabled={!roomId || loading}
          className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Join Game'}
        </button>
        <button
          onClick={onCreateGame}
          disabled={loading}
          className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Create New Game'}
        </button>
      </div>
    </div>
  );
}

// Lobby Page Component
interface LobbyPageProps {
  roomId: string;
  category: string;
  players: string[];
  onStartGame: () => void;
}
function LobbyPage({ roomId, category, players, onStartGame }: LobbyPageProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
        <h2 className="text-xl font-bold mb-2">Room: {roomId}</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users size={18} className="mr-2 text-gray-400" />
            <span>{players.length} Players</span>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
        <h2 className="text-xl font-bold mb-2">Category:</h2>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-md text-center text-xl font-bold">
          {category}
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
        <h2 className="text-xl font-bold mb-4">Players:</h2>
        <div className="space-y-3">
          {players.map((player: string, index: number) => (
            <div key={index} className="flex items-center gap-3 bg-gray-700 p-3 rounded-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                {player.charAt(0)}
              </div>
              <span>{player}</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={onStartGame}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md flex items-center justify-center gap-2"
      >
        Start Game <ArrowRight size={18} />
      </button>
      <ShareOGImageButton stage="lobby" roomId={roomId} category={category} players={players.length} winner={undefined} />
    </div>
  );
}

// Game Page Component
interface GamePageProps {
  gameState: GameState;
  category: string;
  timeLeft: number;
  currentInput: string;
  setCurrentInput: (input: string) => void;
  onSubmit: () => void;
  mySubmissions: string[];
  currentSubmission: string;
  onVote: (isCorrect: boolean) => void;
}
function GamePage({ 
  gameState, 
  category, 
  timeLeft, 
  currentInput, 
  setCurrentInput, 
  onSubmit,
  mySubmissions,
  currentSubmission,
  onVote
}: GamePageProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Category:</h2>
          <div className="flex items-center">
            <Clock size={18} className="mr-2 text-gray-400" />
            <span className="text-lg font-bold">{timeLeft}s</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-md text-center text-xl font-bold">
          {category}
        </div>
      </div>
      {gameState === 'submitting' && (
        <>
          <div className="w-full mb-6">
            <div className="flex mb-4">
              <input 
                type="text" 
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={onSubmit}
                className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-md"
              >
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 w-full">
              <h3 className="text-lg font-bold mb-3">Your submissions:</h3>
              <div className="space-y-2">
                {mySubmissions.length > 0 ? (
                  mySubmissions.map((submission: string, idx: number) => (
                    <div key={idx} className="bg-gray-700 p-2 rounded-md">
                      {submission}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No submissions yet...</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {gameState === 'voting' && (
        <div className="w-full">
          <div className="bg-gray-800 rounded-lg p-6 w-full mb-6 text-center">
            <h3 className="text-xl mb-6">Is this a valid "{category}"?</h3>
            <div className="bg-gray-700 p-4 rounded-md text-2xl mb-8">
              {currentSubmission}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onVote(false)}
                className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
              >
                <X size={20} className="mr-2" /> Incorrect
              </button>
              <button 
                onClick={() => onVote(true)}
                className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center"
              >
                <Check size={20} className="mr-2" /> Correct
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Results Page Component
interface ResultsPageProps {
  scores: Scores;
  winner: string | null;
  category: string;
  onPlayAgain: () => void;
}
function ResultsPage({ scores, winner, category, onPlayAgain }: ResultsPageProps) {
  const sortedPlayers = Object.entries(scores) as [string, number][];
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-6 text-center">
        <h2 className="text-xl font-bold mb-2">Game Over!</h2>
        <p className="text-gray-400 mb-4">Category: {category}</p>
        <div className="mb-6">
          <div className="inline-block p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
            <Trophy size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mt-2">{winner} Wins!</h3>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 w-full mb-8">
        <h3 className="text-lg font-bold mb-4">Final Scores:</h3>
        <div className="space-y-3">
          {sortedPlayers.map(([player, score]: [string, number], index: number) => (
            <div key={player} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-gray-600'}`}>
                  {index + 1}
                </div>
                <span>{player}</span>
              </div>
              <span className="font-bold">{score} pts</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={onPlayAgain}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md"
      >
        Play Again
      </button>
      <ShareOGImageButton stage="results" category={category} winner={winner ?? ''} roomId={undefined} players={undefined} />
    </div>
  );
} 