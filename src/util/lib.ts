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