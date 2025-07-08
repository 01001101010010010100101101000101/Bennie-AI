export enum Sender {
  User = 'user',
  Bennie = 'bennie',
}

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  sources?: Source[];
}

export enum View {
    Chat = 'Chat',
    FAQ = 'FAQ',
    Forms = 'Forms'
}