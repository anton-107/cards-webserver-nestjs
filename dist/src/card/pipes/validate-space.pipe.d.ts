import { PipeTransform } from "@nestjs/common";
export declare class ValidateSpacePipe implements PipeTransform<string> {
    private logger;
    protected parameterName: string;
    transform(value: string): string;
}
//# sourceMappingURL=validate-space.pipe.d.ts.map