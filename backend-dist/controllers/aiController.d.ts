import { Request, Response } from "express";
export declare const analyzeSentiment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const generatePoll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const moderateComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=aiController.d.ts.map