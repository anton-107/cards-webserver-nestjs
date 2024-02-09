import { Body, Controller, Get, Post } from "@nestjs/common";

import { AppService } from "./app.service";

interface CreateNameDto {
  name: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/name")
  getName(): string {
    return "My name is Nest";
  }

  @Post("/name")
  postName(@Body() requestBody: CreateNameDto): string {
    return `You just posted: ${requestBody.name}`;
  }
}
