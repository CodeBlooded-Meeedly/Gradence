import { v4 as uuidv4 } from 'uuid'

const USER_ID_KEY = 'anonymous_voter_user_id'
const VOTES_KEY = 'anonymous_voter_votes'

export const getUserID = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

export const getStoredVotes = (): Record<string, number> => {
  const votes = localStorage.getItem(VOTES_KEY)
  return votes ? JSON.parse(votes) : {}
}

export const storeVote = (subjectId: string, voteValue: number): void => {
  const votes = getStoredVotes()
  votes[subjectId] = voteValue
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
}

export const hasVoted = (subjectId: string): boolean => {
  const votes = getStoredVotes()
  return subjectId in votes
}

export const getVoteValue = (subjectId: string): number | null => {
  const votes = getStoredVotes()
  return votes[subjectId] || null
} 