import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from "@nestjs/common";

import { ValidateTypePipe } from "./validate-type.pipe";

@Injectable()
export class ValidateSpacePipe implements PipeTransform<string> {
  private logger = new Logger(ValidateTypePipe.name);
  protected parameterName = "Space";

  transform(value: string): string {
    const isValid =
      /^[a-zA-Z0-9-]+$/.test(value) &&
      !value.startsWith("-") &&
      !value.endsWith("-");
    if (!isValid) {
      this.logger.warn(
        `Bad request: ${this.parameterName}=${value} (value length: ${value.length})`,
      );
      throw new BadRequestException(
        `${this.parameterName} parameter must include only letters and dashes and must not start/end with a dash`,
      );
    }
    return value;
  }
}
