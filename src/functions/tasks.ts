import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  bulkDeleteTasks,
  getTasks,
  insertTask,
} from "../repositories/taskRepository";
import { config } from "../config/config";
import { successResponse } from "../utils/responseHandler";
import { errorResponse } from "../utils/errorHandler";
import { Task } from "../types/task";
import { httpSwitchHandler } from "../utils/httpHandler";
import { Messages } from "../constants/messages";

export async function getAllTasksHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  request.method;
  try {
    const tasks = await getTasks(config.tenantId);
    const apiResponse = successResponse(tasks);
    return { jsonBody: apiResponse, status: 200 };
  } catch (error) {
    context.error("Error fetching tasks:", error);
    return errorResponse(context, error);
  }
}

export async function createTaskHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const taskData = await request.json();
  if (!taskData) {
    return { status: 400, body: Messages.badRequest };
  }
  try {
    const newTask = await insertTask(taskData as Task);
    const apiResponse = successResponse(newTask);
    return { jsonBody: apiResponse, status: 201 };
  } catch (error) {
    context.error("Error creating task:", error);
    return errorResponse(context, error);
  }
}

export async function bulkDeleteTasksHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = await request.json() as { taskIds: string[] };
  const taskIds = body.taskIds;
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return { status: 400, body: Messages.badRequest };
  }
  try {
    await bulkDeleteTasks(config.tenantId, taskIds);
    return { status: 200, body: Messages.successDelete };
  } catch (error) {
    context.error("Error deleting tasks:", error);
    return errorResponse(context, error);
  }
}

app.http("Tasks", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "tasks",
  handler: httpSwitchHandler({
    GET: getAllTasksHandler,
    POST: createTaskHandler,
  }),
});

app.http("BulkDeleteTasks", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "tasks/bulk-delete",
  handler: bulkDeleteTasksHandler,
});
