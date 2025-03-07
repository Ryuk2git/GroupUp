import { Request, Response, NextFunction } from "express";

export const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();
    const originalSend = res.send;

    res.send = function (body?: any): Response<any, Record<string, any>> {
        const responseTime = Date.now() - startTime;

        console.log(`📡 REQUEST: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
        console.log(`   - Body: ${JSON.stringify(req.body)}`);

        // Log the response body if it exists, otherwise print "No response body"
        if (body) {
            console.log(`✅ RESPONSE: ${res.statusCode} ${res.statusMessage || ""} - ${responseTime}ms`);
            console.log(`   - Response Body: ${typeof body === 'string' ? body : JSON.stringify(body)}\n`);
        } else {
            console.log(`✅ RESPONSE: ${res.statusCode} ${res.statusMessage || ""} - ${responseTime}ms`);
            console.log(`   - No response body\n`);
        }

        return originalSend.call(this, body);
    };

    next();
};
