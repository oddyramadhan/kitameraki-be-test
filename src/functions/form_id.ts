import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getFormsById, updateForm } from "../repositories/formRepository";
import { config } from "../config/config";
import { successResponse } from "../utils/responseHandler";
import { Messages } from "../constants/messages";
import { httpSwitchHandler } from "../utils/httpHandler";

export async function getFormsByIdHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const formId = request.params.id;
  const tenantId = config.tenantId;

  if (!formId) {
    return { status: 400, body: "Form ID is required." };
  }

  try {
    const form = await getFormsById(tenantId, formId);
    const apiResponse = successResponse(form);
    if (!form) {
      return { status: 404, body: Messages.notFound };
    }
    return { status: 200, jsonBody: apiResponse };
  } catch (error) {
    context.error("Error fetching form:", error);
    return { status: 500, body: "Internal Server Error" };
  }
}

export async function updateFormHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const formId = request.params.id;
  const tenantId = config.tenantId;
  const formData = await request.json();

  if (!formId) {
    return { status: 400, body: "Form ID is required." };
  }
  try {
    const updatedForm = await updateForm(tenantId, formId, formData);
    const apiResponse = successResponse(updatedForm);
    return { jsonBody: apiResponse, status: 200 };
  } catch (error) {
    if (
      error.code === 404 ||
      error.name === "NotFoundError" ||
      error.body?.code === "NotFound"
    ) {
      context.error(`Task with id '${formId}' not found.`);
      return { status: 404, body: Messages.notFound };
    }
    context.error(`Failed to update task: ${error}`);
    return { status: 500, body: Messages.failedUpdate };
  }
}

app.http("FormsById", {
  methods: ["GET", "PUT"],
  authLevel: "anonymous",
  route: "form/{id}",
  handler: httpSwitchHandler({
    GET: getFormsByIdHandler,
    PUT: updateFormHandler,
  }),
});
