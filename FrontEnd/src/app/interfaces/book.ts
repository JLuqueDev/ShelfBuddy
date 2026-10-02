export interface Book {
    _id?: string;
    title: string;
    author: string;
    status: 'To read' | 'Reading' | 'Finished' | string;
}