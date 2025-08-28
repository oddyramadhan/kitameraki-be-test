import { container } from "../lib/cosmosClient";
import { Task } from "../types/task";

export async function getTasks(tenantId: string) {
    const { resources } = await container.items
      .query(`SELECT * FROM c`, {
        partitionKey: tenantId,
      })
      .fetchAll();
  return resources;
}

export async function getTaskById(tenantId: string, taskId: string) {
  const { resource } = await container.item(taskId, tenantId).read();
  return resource;
}

export async function insertTask(task: Task) {
  const { resource } = await container.items.create(task);
  return resource;
}

export async function updateTask(tenantId: string, taskId: string, task: Partial<Task>) {
  const patchOperations = Object.entries(task).map(([key, value]) => ({
    op: "replace" as const,
    path: `/${key}`,
    value: value,
  }));
  const { resource } = await container.item(taskId, tenantId).patch(patchOperations);
  return resource;
}

export async function deleteTask(tenantId: string, taskId: string) {
  await container.item(taskId, tenantId).delete();
}