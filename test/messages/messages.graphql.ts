export const SEND_MESSAGE_WITH_PARTICIPANT_IDS_MUTATION = `
  mutation(
    $senderId: ID!
    $text: String!
    $participantIds: [ID!]
  ) {
    sendMessage(senderId: $senderId, text: $text, participantIds: $participantIds) {
      success
      message
      data {
        id
        conversation {
          id
          participants {
            id
            name
          }
        }
        sender {
          id
        }
        text
      }
    }
  }
`;

export const SEND_MESSAGE_WITH_CONVERSATION_ID_MUTATION = `
  mutation(
    $senderId: ID!
    $text: String!
    $conversationId: String
  ) {
    sendMessage(senderId: $senderId, text: $text, conversationId: $conversationId) {
      success
      message
      data {
        id
        conversation {
          id
          participants {
            id
            name
          }
        }
        sender {
          id
        }
        text
      }
    }
  }
`;
