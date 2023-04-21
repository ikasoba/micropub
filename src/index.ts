import { Result } from "@ikasoba000/result-ts";
import { MicropubModel } from "./model.js";
import { is } from "./util.js";

export type Awaitable<T> = T | PromiseLike<T>;

type SearchParamsJson = {
  [k: string]: string | string[] | undefined;
};

export function searchParamsParser(params: URLSearchParams): SearchParamsJson {
  const res: SearchParamsJson = {};
  for (let [k, v] of params.entries()) {
    if (k.endsWith("[]")) {
      k = k.slice(0, -2);
      const arr = res[k] ?? [];
      if (!(arr instanceof Array)) {
        continue;
      }
      arr.push(v);
    } else {
      res[k] = v;
    }
  }
  return res;
}

type formDataValue = File | string;
type formDataJson = {
  [k: string]: formDataValue | formDataValue[] | undefined;
};

export function formDataParser(params: FormData): formDataJson {
  const res: formDataJson = {};
  for (let [k, v] of params.entries()) {
    if (k.endsWith("[]")) {
      k = k.slice(0, -2);
      const arr = res[k] ?? [];
      if (!(arr instanceof Array)) {
        continue;
      }
      arr.push(v);
    } else {
      res[k] = v;
    }
  }
  return res;
}

export class Micropub {
  constructor(private model: MicropubModel) {}

  async endpoint(request: Request): Promise<Response> {
    if (request.method == "POST") {
      const body = await request
        .formData()
        .then((x) => formDataParser(x))
        .catch(async () =>
          searchParamsParser(new URLSearchParams(await request.text()))
        );

      if (
        !is(
          body,
          (body): body is { h: string; action: "delete" | "undelete" } =>
            typeof body["h"] == "string" &&
            (body["action"] == "delete" || body["action"] == "undelete")
        )
      ) {
        return new Response("Invalid microformats object type", {
          status: 400,
        });
      }

      const type = body["h"];
    }
  }
}
