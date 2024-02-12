import { AppService } from "./app.service";
interface CreateNameDto {
  name: string;
}
export declare class AppController {
  private readonly appService;
  constructor(appService: AppService);
  getHello(): string;
  getName(): string;
  postName(requestBody: CreateNameDto): string;
}
export {};
//# sourceMappingURL=app.controller.d.ts.map
