import BaseError from './BaseError.js';
import HTTP_CLIENT from './http-client-constants.js';

export class ClientError extends BaseError {
    constructor(name: string, cause: string, hint: string, httpCode: number) {
        super(name, cause, hint, httpCode);

        // Are these validations necessary ?
        if (typeof name !== 'string') {
            this.name = 'Client error';
        }

        if (typeof cause !== 'string') {
            this.cause = 'Client error with no cause defined.';
        }

        if (typeof cause !== 'string') {
            this.cause = 'Client error with no hint defined.';
        }

        if (!(Object.values(HTTP_CLIENT) as number[]).includes(httpCode)) {
            this.httpCode = HTTP_CLIENT.BAD_REQUEST;
        }
    }
}

export class UnauthorizedError extends ClientError {
    constructor(
        cause: string = 'Invalids Credentials',
        hint: string = 'Try providing others credentials.'
    ) {
        super('UNAUTHORIZED', cause, hint, HTTP_CLIENT.UNAUTHORIZED);
    }
}

export class ForbiddenError extends ClientError {
    constructor(
        cause: string = 'Access denied.',
        hint: string = 'Try accessing resources you are allowed to.'
    ) {
        super('FORBIDDEN', cause, hint, HTTP_CLIENT.FORBIDDEN);
    }
}

export class NotFoundError extends ClientError {
    constructor(
        cause: string = 'The requested resource could not be found.',
        hint: string = 'Try navigating the website only through link and button.'
    ) {
        super('NOT FOUND', cause, hint, HTTP_CLIENT.NOT_FOUND);
    }
}

export class ConflictError extends ClientError {
    constructor(
        cause: string = 'Request conflicts with the current state of the resource.',
        hint: string = 'Try providing different values.'
    ) {
        super('CONFLICT', cause, hint, HTTP_CLIENT.CONFLICT);
    }
}

export class TooManyRequestsError extends ClientError {
    constructor(
        cause: string = 'Server has temporarily blocked your IP due too many request',
        hint: string = 'Please try again after waiting a few minutes.'
    ) {
        super('TOO MANY REQUEST', cause, hint, HTTP_CLIENT.TOO_MANY_REQUEST);
    }
}
