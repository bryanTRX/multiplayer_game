import { ChatMessage } from '@common/interfaces';
export declare class ChatHistoryService {
    private messages;
    getMessages(roomCode: string): ChatMessage[];
    addMessage(roomCode: string, message: ChatMessage): void;
}
