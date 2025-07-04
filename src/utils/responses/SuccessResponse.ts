import BaseResponse from './BaseResponse.js';
import HTTP_SUCCESS from './http-success-constants.js';

class SuccessResponse extends BaseResponse {
    constructor(
        name: string,
        message: string,
        httpCode: number,
        data: Record<string, unknown> = {}
    ) {
        super(name, message, httpCode, data);

        // Are these validations necessary ?
        if (typeof name !== 'string') {
            this.name = 'success';
        }

        if (typeof message !== 'string') {
            this.message = 'Operation completed successfully';
        }

        if (!(Object.values(HTTP_SUCCESS) as number[]).includes(httpCode)) {
            this.httpCode = HTTP_SUCCESS.OK;
        }

        // Should this.data = ???
    }
}

export class OkResponse extends SuccessResponse {
    constructor(
        message: string = 'Request completed successfully',
        data: Record<string, unknown> = {}
    ) {
        super('SUCCESS', message, HTTP_SUCCESS.OK, data);
    }
}

export class CreatedResponse extends SuccessResponse {
    constructor(
        message: string = 'Resource created successfully',
        data: Record<string, unknown> = {}
    ) {
        super('CREATED', message, HTTP_SUCCESS.CREATED, data);
    }
}

export class NoContentResponse extends SuccessResponse {
    constructor(message: string = 'Operation completed successfully') {
        super('NO CONTENT', message, HTTP_SUCCESS.NO_CONTENT, {});
    }
}
