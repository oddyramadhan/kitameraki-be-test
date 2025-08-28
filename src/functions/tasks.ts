import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  deleteTask,
  getTaskById,
  getTasks,
  insertTask,
  updateTask,
} from "../repositories/taskRepository";
import { config } from "../config/config";
import { successResponse } from "../utils/responseHandler";
import { errorResponse } from "../utils/errorHandler";
import { Task } from "../types/task";
import { httpSwitchHandler } from "../utils/httpHandler";

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
    return { status: 400, body: "Bad request." };
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

app.http("Tasks", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "tasks",
  handler: httpSwitchHandler({
    GET: getAllTasksHandler,
    POST: createTaskHandler,
  }),
});
