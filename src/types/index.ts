export interface User {
    id: string;
    username: string;
    email: string;
    isAuthenticated: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
}

export interface Meeting {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    participants: string[];
}