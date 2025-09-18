export interface res<T> {
    success: boolean;
    message: string;
    user: T
}

export interface response<T> {
    success: boolean;
    message: string;
    model: T
}

export interface apiError {
    errors: [];
    message: string;
    stack: string;
    status: number;
    success: false;
}