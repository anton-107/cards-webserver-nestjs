import { PipeTransform } from "@nestjs/common";
export declare class ValidateTypePipe implements PipeTransform<string> {
    protected parameterName: string;
    transform(value: string): string;
}
//# sourceMappingURL=validate-type.pipe.d.ts.map