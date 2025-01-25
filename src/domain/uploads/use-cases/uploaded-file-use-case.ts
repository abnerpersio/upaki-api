import { Env } from "@/config/env";
import { dynamoClient } from "@/lib/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

type Data = {
  fileKeys: string[];
};

export class UploadedFileUseCase {
  async execute({ fileKeys }: Data) {
    const commands = fileKeys.map((fileKey) => {
      return new UpdateCommand({
        TableName: Env.tableName,
        Key: { fileKey: decodeURIComponent(fileKey) },
        UpdateExpression: "SET #status = :status, REMOVE #expiresAt",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "UPLOADED" },
      });
    });

    await Promise.all(
      commands.map(async (command) => {
        await dynamoClient.send(command);
      })
    );
  }
}
