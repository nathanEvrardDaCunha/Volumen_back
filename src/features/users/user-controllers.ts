import { Request, Response, NextFunction } from 'express';
import { fetchUserService } from './user-services.js';

export async function fetchUserController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = req.id;

        // Don't forget to validate and sanitize user input.
        const result = await fetchUserService(tokenId);

        // const response = new CreatedResponse(
        //     'User has been created successfully.',
        //     null
        // );
        // res.status(response.httpCode).json(response.toJSON());

        // res.status(response.httpCode).json(response.toJSON());

        res.status(200).json({
            status: 200,
            message: 'User has been fetched successfully.',
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
