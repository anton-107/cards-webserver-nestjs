import { Injectable } from "@nestjs/common";

import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceDynamoDBTableFactory } from "./entities/space.dynamodb";
import { Space, SpaceEntity } from "./entities/space.entity";

@Injectable()
export class SpaceService {
  private table;
  constructor(spaceDynamoDBTableFactory: SpaceDynamoDBTableFactory) {
    this.table = spaceDynamoDBTableFactory.build();
  }
  async create(createSpaceDto: CreateSpaceDto, owner: string): Promise<Space> {
    const record = {
      spaceID: createSpaceDto.spaceID,
      sortKey: "SPACE",
      owner,
    };
    await SpaceEntity.setTable(this.table).put(record);
    return record;
  }

  async findAllOwnedBy(owner: string) {
    const response = await SpaceEntity.setTable(this.table).scan({
      filters: [{ attr: "owner", eq: owner }],
    });
    return response.Items;
  }

  async findOne(spaceID: string): Promise<Space | null> {
    const response = await SpaceEntity.setTable(this.table).get({
      spaceID,
      sortKey: "SPACE",
    });

    return response.Item
      ? {
          spaceID: response.Item.spaceID,
          owner: String(response.Item.owner),
        }
      : null;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space ${updateSpaceDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
