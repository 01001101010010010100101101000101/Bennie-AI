export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  attachment?: {
    name: string;
    dataUrl: string;
  };
}
