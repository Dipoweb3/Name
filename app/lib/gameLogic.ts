import { supabase } from './supabase';
import { Room, Participant, Submission, Vote, Score } from '../types';

export async function startGame(roomId: string) {
  await supabase.from('rooms').update({ state: 'submitting' }).eq('roomId', roomId);
}

export async function endSubmission(roomId: string) {
  await supabase.from('rooms').update({ state: 'voting' }).eq('roomId', roomId);
}

export async function endVoting(roomId: string) {
  await supabase.from('rooms').update({ state: 'done' }).eq('roomId', roomId);
}

export async function calculateScores(roomId: string): Promise<Score[]> {
  const { data: submissions } = await supabase.from('submissions').select('*').eq('roomId', roomId);
  const { data: votes } = await supabase.from('votes').select('*').eq('roomId', roomId);
  const { data: participants } = await supabase.from('participants').select('*').eq('roomId', roomId);

  if (!participants || !submissions || !votes) {
    return [];
  }

  const scores: Score[] = participants.map((p) => ({ fid: p.fid, username: p.username, points: 0 }));

  submissions.forEach((submission) => {
    const submissionVotes = votes.filter((v) => v.answerId === submission.id);
    const correctVotes = submissionVotes.filter((v) => v.vote === 'correct').length;
    if (correctVotes >= submissionVotes.length / 2) {
      const score = scores.find((s) => s.fid === submission.fid);
      if (score) score.points += 1;
    }
  });

  return scores;
} 