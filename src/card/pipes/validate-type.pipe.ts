import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidateTypePipe implements PipeTransform<string> {
  protected parameterName = "Type";

  transform(value: string): string {
    const isValid =
      /^[a-zA-Z-]+$/.test(value) &&
      !value.startsWith("-") &&
      !value.endsWith("-");
    if (!isValid) {
      throw new BadRequestException(
        `${this.parameterName} parameter must include only letters and dashes and must not start/end with a dash`,
      );
    }
    return value;
  }
}
