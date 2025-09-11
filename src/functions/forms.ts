import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { getAllForms, insertForm } from "../repositories/formRepository";
import { config } from "../config/config";
import { successResponse } from "../utils/responseHandler";
import { httpSwitchHandler } from "../utils/httpHandler";

export async function getAllFormsHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    request.method;
    try {
        const forms = await getAllForms(config.tenantId);
        const apiResponse = successResponse(forms);
        return { jsonBody: apiResponse, status: 200 };
    } catch (error) {
        context.error("Error fetching forms:", error);
        return { status: 500, body: "Internal Server Error" };
    }
};

export async function createFormHandler(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    const formData = await request.json();
    if (!formData) {
        return { status: 400, body: "Form data is required." };
    }
    try {
        const newForm = await insertForm(formData);
        const apiResponse = successResponse(newForm);
        return { jsonBody: apiResponse, status: 201 };
    } catch (error) {
        context.error("Error creating form:", error);
        return { status: 500, body: "Internal Server Error" };
    }
};


app.http("Forms", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    route: "forms",
    handler: httpSwitchHandler({
        GET: getAllFormsHandler,
        POST: createFormHandler,
    }),
});