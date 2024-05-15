

export class UploadFileResponseDto {
    url: string;

    constructor(partial: Partial<UploadFileResponseDto>) {
        Object.assign(this, partial);
    }
}
