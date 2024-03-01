import { PipeTransform } from "@nestjs/common";
import { ValidateTypePipe } from "./validate-type.pipe";
export declare class ValidateSpacePipe extends ValidateTypePipe implements PipeTransform<string> {
    protected parameterName: string;
}
//# sourceMappingURL=validate-space.pipe.d.ts.map