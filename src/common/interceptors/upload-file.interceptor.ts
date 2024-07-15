import { CallHandler, ExecutionContext, Inject, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { UploadService } from "src/upload/upload.service";
export class UploadSingleFileInterceptor implements NestInterceptor {
    constructor( 
        @Inject("field") private field:string ,
        private uploadService:UploadService
    ){};
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const req=context.switchToHttp().getRequest<Request>();
        const { file }=req;
        if( !file ){
            return next.handle();
        };
        req.body[this.field]=this.uploadService.uploadFile(file);
        return next.handle();
    }
};