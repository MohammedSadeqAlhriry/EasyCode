import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
  @IsNotEmpty()
  pagePath: string;

  @IsNotEmpty()
  pageSection: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  entityId: number;
}
