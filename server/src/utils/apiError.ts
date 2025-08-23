class apiError extends Error {
    public status: number;
    public success: boolean;
    public errors: unknown[];

    constructor(
        status: number,
        message: string = "Something went wrong",
        errors: unknown[] = [],
        stack?: string
    ) {
        super(message);
        this.status = status;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { apiError };