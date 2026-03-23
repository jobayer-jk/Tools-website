import type { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(signInDto: Record<string, any>, res: Response): Promise<{
        message: string;
        user: {
            id: any;
            email: any;
            role: any;
        };
        token: string;
    }>;
}
