import { Injectable } from "@nestjs/common";

import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { Space, SpaceEntity } from "./entities/space.entity";

@Injectable()
export class SpaceService {
  constructor(private spaceDynamoDBTableFactory: SpaceDynamoDBTableFactory) {}
  async create(createSpaceDto: CreateSpaceDto, owner: string): Promise<Space> {
    const record = {
      spaceID: createSpaceDto.spaceID,
      sortKey: "SPACE",
      owner,
    };
    await SpaceEntity.setTable(this.spaceDynamoDBTableFactory.build()).put(
      record,
    );
    return record;
  }

  async findAllOwnedBy(owner: string) {
    const response = await SpaceEntity.setTable(
      this.spaceDynamoDBTableFactory.build(),
    ).scan({
      filters: [{ attr: "owner", eq: owner }],
    });
    return response.Items;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space ${updateSpaceDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
