import { ConfigService } from "@nestjs/config";
import { Table } from "dynamodb-toolbox";
export declare const DYNAMOCLIENT_ENDPOINT_OVERRIDE = "DYNAMOCLIENT_ENDPOINT_OVERRIDE";
export declare class SpaceDynamoDBTableFactory {
    private configService;
    constructor(configService: ConfigService);
    build(): Table<string, string, string>;
}
//# sourceMappingURL=space.dynamodb.d.ts.map