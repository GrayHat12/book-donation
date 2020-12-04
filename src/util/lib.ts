export interface Book {
    title: string;
    author: string;
    subTitle?: string;
    language: string;
    image?: string;
};

export interface Post {
    author: string;
    title: string;
    phone: string;
    body: string;
    book: Book;
};

export interface Chat {
    user1: string;
    user2: string;
    conversations: {
        [timestamp: string]: Conversation;
    };
}

export interface Conversation {
    message: Message;
    timestamp: string;
    from: string;
    to: string;
}

export interface Message {
    text?: string;
    image?: string;
}