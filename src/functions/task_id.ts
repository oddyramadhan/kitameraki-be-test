import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  deleteTask,
  getTaskById,
  updateTask,
} from "../repositories/taskRepository";
import { config } from "../config/config";
import { successResponse } from "../utils/responseHandler";
import { errorResponse } from "../utils/errorHandler";
import { httpSwitchHandler } from "../utils/httpHandler";
import { Messages } from "../constants/messages";

export async function getTaskByIdHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const taskId = request.params.id;
  if (!taskId) {
    return { status: 400, body: Messages.badRequest };
  }
  try {
    const task = await getTaskById(config.tenantId, taskId);
    const apiResponse = successResponse(task);
    if (!task) {
      return { status: 404, body: Messages.notFound };
    }
    return { jsonBody: apiResponse, status: 200 };
  } catch (error) {
    context.error("Error fetching task:", error);
    return errorResponse(context, error);
  }
}

export async function updateTaskHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const taskId = request.params.id;
  if (!taskId) {
    return { status: 400, body: Messages.badRequest };
  }
  const body = await request.json();
  try {
    const updatedTask = await updateTask(config.tenantId, taskId, body);
    const apiResponse = successResponse(updatedTask);
    return { jsonBody: apiResponse, status: 200 };
  } catch (error) {
    if (
      error.code === 404 ||
      error.name === "NotFoundError" ||
      error.body?.code === "NotFound"
    ) {
      context.error(`Task with id '${taskId}' not found.`);
      return { status: 404, body: Messages.notFound };
    }
    context.error(`Failed to update task: ${error}`);
    return { status: 500, body: Messages.failedUpdate };
  }
}

export async function deleteTaskHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const taskId = request.params.id;
  if (!taskId) {
    return { status: 400, body: Messages.badRequest };
  }
  try {
    await deleteTask(config.tenantId, taskId);
    return { status: 204, jsonBody: Messages.successDelete };
  } catch (error) {
    if (
      error.code === 404 ||
      error.name === "NotFoundError" ||
      error.body?.code === "NotFound"
    ) {
      context.error(`Task with id '${taskId}' not found.`);
      return { status: 404, body: Messages.notFound };
    }
    context.error(`Failed to delete task: ${error}`);
    return { status: 500, body: Messages.failedDelete };
  }
}

app.http("TaskById", {
  methods: ["GET", "PUT", "DELETE"],
  authLevel: "anonymous",
  route: "task/{id}",
  handler: httpSwitchHandler({
    GET: getTaskByIdHandler,
    PUT: updateTaskHandler,
    DELETE: deleteTaskHandler,
  }),
});
