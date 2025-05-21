import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'edge';

// Define types for better maintainability
type GameStage = 'home' | 'lobby' | 'submitting' | 'voting' | 'results';

interface GameParams {
  stage: GameStage;
  category: string;
  roomId: string;
  timeLeft: string;
  players: string;
  submission: string;
  progress: string;
  winner: string;
}

const regularFont = fs.readFileSync(path.join(process.cwd(), 'assets', 'Inter-Regular.ttf'));
const boldFont = fs.readFileSync(path.join(process.cwd(), 'assets', 'Inter-Bold.ttf'));

// Helper to parse search params safely
function getGameParams(url: string): GameParams {
  const { searchParams } = new URL(url);
  
  return {
    stage: (searchParams.get('stage') || 'home') as GameStage,
    category: searchParams.get('category') || '',
    roomId: searchParams.get('roomId') || '',
    timeLeft: searchParams.get('timeLeft') || '',
    players: searchParams.get('players') || '0',
    submission: searchParams.get('submission') || '',
    progress: searchParams.get('progress') || '',
    winner: searchParams.get('winner') || '',
  };
}

// Components for different game stages
function HomeStage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '18px' }}>
        Ready to test your wits? Create a new game room or jump into an existing one.
      </p>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div
          style={{
            padding: '12px 0',
            backgroundColor: '#1e293b',
            color: 'white',
            fontWeight: '500',
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Join Game
        </div>
        <div
          style={{
            padding: '12px 0',
            backgroundColor: 'white',
            color: '#0f172a',
            fontWeight: '500',
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Create New Game
        </div>
      </div>
    </div>
  );
}

function LobbyStage({ roomId, players, category }: Pick<GameParams, 'roomId' | 'players' | 'category'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          Room: {roomId}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="9" cy="7" r="4" stroke="#94a3b8" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#94a3b8" strokeWidth="2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#94a3b8" strokeWidth="2" />
            </svg>
            <span style={{ marginLeft: '8px' }}>{players} Players</span>
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
          Category:
        </h2>
        <div 
          style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {category}
        </div>
      </div>
      <div
        style={{
          padding: '12px 0',
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          color: 'white',
          fontWeight: '500',
          borderRadius: '8px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        Start Game
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path 
            d="M5 12h14M12 5l7 7-7 7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function SubmittingStage({ category, timeLeft }: Pick<GameParams, 'category' | 'timeLeft'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '16px',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Category:</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold' }}>{timeLeft}s</span>
          </div>
        </div>
        <div 
          style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          {category}
        </div>
      </div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
        Submit as many valid answers as you can!
      </div>
    </div>
  );
}

function VotingStage({ category, submission, progress }: Pick<GameParams, 'category' | 'submission' | 'progress'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>
          Is this a valid "{category}"?
        </h3>
        <div
          style={{
            backgroundColor: '#334155',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '24px',
            marginBottom: '32px',
          }}
        >
          {submission}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 0',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ marginLeft: '8px' }}>Incorrect</span>
          </div>
          <div
            style={{
              padding: '12px 0',
              backgroundColor: '#16a34a',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ marginLeft: '8px' }}>Correct</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: '16px', color: '#94a3b8' }}>
        {progress}
      </div>
    </div>
  );
}

function ResultsStage({ category, winner }: Pick<GameParams, 'category' | 'winner'>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Game Over!
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '16px' }}>
          Category: {category}
        </p>
        <div style={{ marginBottom: '24px' }}>
          <div 
            style={{
              display: 'inline-block',
              padding: '12px',
              background: 'linear-gradient(to right, #eab308, #f59e0b)',
              borderRadius: '9999px',
              marginBottom: '8px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 16c2.824-2.176 5-4.872 5-8.91C21 3.228 17.761 1 14.333 1c-1.792 0-3.294.574-4.333 1.5C8.961 1.574 7.458 1 5.667 1 2.238 1 1 3.228 1 7.09c0 4.038 2 6.734 5 8.91" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {winner} Wins!
          </h3>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: '12px 0',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            color: 'white',
            fontWeight: '500',
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Play Again
        </div>
        <div
          style={{
            padding: '12px 0',
            background: '#1e293b',
            color: 'white',
            fontWeight: '500',
            borderRadius: '8px',
            flex: 1,
            textAlign: 'center',
          }}
        >
          New Game
        </div>
      </div>
    </div>
  );
}

// Header component
function Header({ category }: { category: string }) {
  // Generate dynamic app title based on category
  const appTitle = category 
    ? `${category} Arena!` 
    : 'Name Arena!';
    
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '32px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          padding: '40px 80px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Have Fun on Farcaster
          </span>
        </div>
      </div>
    </div>
  );
}

export async function GET(req: NextRequest) {
  try {
    // Parse parameters from URL
    const params = getGameParams(req.url);
    
    // Render the OpenGraph image based on game stage
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#020817',
            padding: '40px',
            color: 'white',
            fontFamily: 'Inter',
          }}
        >
          {/* Header with logo and dynamic title */}
          <Header category={params.category} />
          
          {/* Dynamic content based on stage */}
          {params.stage === 'home' && <HomeStage />}
          
          {params.stage === 'lobby' && 
            <LobbyStage 
              roomId={params.roomId} 
              players={params.players} 
              category={params.category} 
            />
          }
          
          {params.stage === 'submitting' && 
            <SubmittingStage 
              category={params.category} 
              timeLeft={params.timeLeft} 
            />
          }
          
          {params.stage === 'voting' && 
            <VotingStage 
              category={params.category} 
              submission={params.submission} 
              progress={params.progress} 
            />
          }
          
          {params.stage === 'results' && 
            <ResultsStage 
              category={params.category} 
              winner={params.winner} 
            />
          }
        </div>
      ),
      {
        width: 800,
        height: 600,
        fonts: [
          {
            name: 'Inter',
            data: regularFont,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: boldFont,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate image', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}