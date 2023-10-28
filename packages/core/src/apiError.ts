export class ApiError extends Error {
    private statusCode;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    public getMessage(): string {

        switch (this.statusCode) {
            case 400:
                return `BAD REQUEST: ${this.message}`;
            case 403:
                return `FORBIDDEN: ${this.message}`;
            case 404:
                return `NOT FOUND: ${this.message}`;
            case 500:
                return `INTERNAL SERVER ERROR: ${this.message}`;
            default:
                return this.message;
        }
    }
}