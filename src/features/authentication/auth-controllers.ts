import { Request, Response, NextFunction } from 'express';
import { loginService, registerService } from './auth-services.js';

export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { username, email, password } = req.body;

        // Verify this is good practice or boilerplate knowing i'll use zod to validate them later ?
        const unknownUsername = username as unknown;
        const unknownEmail = email as unknown;
        const unknownPassword = password as unknown;

        // Don't forget to validate and sanitize user input.
        await registerService(unknownUsername, unknownEmail, unknownPassword);

        // const response = new CreatedResponse(
        //     'User has been created successfully.',
        //     null
        // );

        // // httpCode is not implemented, same as toJSON and "response" in general
        // res.status(response.httpCode).json(response.toJSON());
        res.status(201).json({
            status: 201,
            message: 'User has been created successfully.',
        });
    } catch (error) {
        // TODO: Implement error handler middleware
        // TODO: Implement mainstream http errors
        // TODO: Remove the console.error

        console.error(error);

        next(error);
    }
}

export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { email, password } = req.body;

        // Verify this is good practice or boilerplate knowing i'll use zod to validate them later ?
        const unknownEmail = email as unknown;
        const unknownPassword = password as unknown;

        // Don't forget to validate and sanitize user input.
        const result = await loginService(unknownEmail, unknownPassword);

        // const response = new OkResponse(
        //     'User has been authenticated successfully.',
        //     {
        //         accessToken: result.accessToken,
        //     }
        // );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        // // httpCode is not implemented, same as toJSON and "response" in general
        // res.status(response.httpCode).json(response.toJSON());
        res.status(201).json({
            status: 201,
            message: 'User has been logged successfully.',
            data: {
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        // TODO: Implement error handler middleware
        // TODO: Implement mainstream http errors
        // TODO: Remove the console.error

        console.error(error);

        next(error);
    }
}
