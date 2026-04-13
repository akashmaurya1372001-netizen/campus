import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
export declare const getPosts: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createPost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const votePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deletePost: (req: AuthRequest, res: Response) => Promise<void>;
export declare const commentPost: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=postController.d.ts.map