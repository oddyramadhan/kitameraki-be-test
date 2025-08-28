import { CosmosClient } from "@azure/cosmos";
import { config } from "../config/config";

export const client = new CosmosClient(config.cosmosConnectionString);
export const container = client.database(config.dataBaseId).container(config.containerId);