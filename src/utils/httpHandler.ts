import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

type HandlerFn = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>;

export function httpSwitchHandler(handlers: { [method: string]: HandlerFn }) {
  return async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      switch (request.method.toUpperCase()) {
        case "GET":
          if (handlers.GET) return await handlers.GET(request, context);
          break;
        case "POST":
          if (handlers.POST) return await handlers.POST(request, context);
          break;
        case "PUT":
          if (handlers.PUT) return await handlers.PUT(request, context);
          break;
        case "DELETE":
          if (handlers.DELETE) return await handlers.DELETE(request, context);
          break;
      }

      return {
        status: 405,
        jsonBody: { error: `Method ${request.method} not allowed` },
      };
    } catch (err: any) {
      return {
        status: 500,
        jsonBody: { error: "Internal Server Error" },
      };
    }
  };
}
