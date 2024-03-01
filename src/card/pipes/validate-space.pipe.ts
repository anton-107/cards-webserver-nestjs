import { Injectable, PipeTransform } from "@nestjs/common";

import { ValidateTypePipe } from "./validate-type.pipe";

@Injectable()
export class ValidateSpacePipe
  extends ValidateTypePipe
  implements PipeTransform<string>
{
  protected parameterName = "Space";
}
