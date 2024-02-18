import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ValidateTypePipe implements PipeTransform<string> {
  transform(value: string): string {
    const isValid =
      /^[a-zA-Z-]+$/.test(value) &&
      !value.startsWith("-") &&
      !value.endsWith("-");
    if (!isValid) {
      throw new BadRequestException(
        "Type parameter must include only letters and dashes and must not start/end with a dash",
      );
    }
    return value;
  }
}
