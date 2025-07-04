export default abstract class BaseResponse {
    name: string = '';
    message: string = '';
    httpCode: number = 200;
    data: Record<string, unknown> = {};
    timestamp: string;

    constructor(
        name: string,
        message: string,
        httpCode: number,
        data: Record<string, unknown>
    ) {
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.message = message;
        this.httpCode = httpCode;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            success: true,
            name: this.name,
            message: this.message,
            httpCode: this.httpCode,
            data: this.data,
            timestamp: this.timestamp,
        };
    }
}
