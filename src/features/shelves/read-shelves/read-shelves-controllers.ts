import { Request, Response, NextFunction } from 'express';
import { OkResponse } from '../../../utils/responses/SuccessResponse.js';
import { readShelvesService } from './read-shelves-services.js';
import { TokenSchema } from '../../../utils/schemas/global-schemas.js';

// Are every response returning value like this: {data: something} ?
// => If not, need to make update the relevant codebase part to be more consistent
export async function readShelvesController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokenId = TokenSchema.parse(req.id);

        // Don't forget to sanitize user input.
        const result = await readShelvesService(tokenId);

        const response = new OkResponse(
            'Shelves have been fetched successfully.',
            { data: result }
        );

        res.status(response.httpCode).json(response.toJSON());
    } catch (error) {
        next(error);
    }
}
