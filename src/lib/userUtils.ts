import { v4 as uuidv4 } from 'uuid'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const VOTER_UUID_KEY = 'Voter-UUID'
const VOTED_SUBJECTS_KEY = 'Voted-Subjects'

// Generates and stores a unique user ID in localStorage.
export const getUserID = (): string => {
  let userId = localStorage.getItem(VOTER_UUID_KEY)
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem(VOTER_UUID_KEY, userId)
  }
  return userId
}

// Generates a browser fingerprint for additional duplicate vote checking.
export const getFingerprint = async (): Promise<string> => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}

// Stores a record of a user voting for a subject in localStorage.
export const storeVote = (subjectId: string, voteValue: number) => {
  const votedSubjects = getVotedSubjects()
  votedSubjects[subjectId] = voteValue
  localStorage.setItem(VOTED_SUBJECTS_KEY, JSON.stringify(votedSubjects))
}

// Checks if a user has already voted for a specific subject.
export const hasVoted = (subjectId: string): boolean => {
  const votedSubjects = getVotedSubjects()
  return votedSubjects.hasOwnProperty(subjectId)
}

// Retrieves the vote value for a subject the user has voted on.
export const getVoteValue = (subjectId: string): number | null => {
  const votedSubjects = getVotedSubjects()
  return votedSubjects[subjectId] || null
}

// Helper function to get the voted subjects object from localStorage.
const getVotedSubjects = (): { [key: string]: number } => {
  try {
    const votedSubjects = localStorage.getItem(VOTED_SUBJECTS_KEY)
    return votedSubjects ? JSON.parse(votedSubjects) : {}
  } catch (error) {
    console.error('Error parsing Voted-Subjects from localStorage', error)
    return {}
  }
} 