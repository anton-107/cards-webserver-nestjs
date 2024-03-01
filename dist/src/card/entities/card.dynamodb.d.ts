import { ConfigService } from "@nestjs/config";
import { Table } from "dynamodb-toolbox";
export declare const DYNAMOCLIENT_ENDPOINT_OVERRIDE = "DYNAMOCLIENT_ENDPOINT_OVERRIDE";
export declare class CardDynamoDBTableFactory {
    private configService;
    constructor(configService: ConfigService);
    build(): Table<string, string, string>;
}
//# sourceMappingURL=card.dynamodb.d.ts.map