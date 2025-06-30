import { UUID, createHash } from 'crypto';

const generateConversationId = (participantIds: UUID[]) => {
  const sortedIds = participantIds.sort().join('|');
  return createHash('sha256').update(sortedIds).digest('hex');
};

export { generateConversationId };
