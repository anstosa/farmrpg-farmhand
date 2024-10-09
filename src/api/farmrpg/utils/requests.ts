import { CachedState, QueryInterceptor } from "../../../utils/state";
import { getDocument } from "../../../utils/requests";
import { Page } from "../../../utils/page";

export const getHTML = async (
  page: Page,
  query?: URLSearchParams
): Promise<Document> => {
  const response = await fetch(toUrl(page, query), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  return getDocument(response);
};

export const postData = async (
  page: Page,
  data: Record<string, string>,
  query?: URLSearchParams
): Promise<Document> => {
  const body = new URLSearchParams(data).toString();
  const response = await fetch(toUrl(page, query), {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  });
  return getDocument(response);
};

export const getJSON = async <T extends object>(
  page: Page,
  query?: URLSearchParams
): Promise<T> => {
  const response = await fetch(toUrl(page, query), {
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  onFetchResponse(response);
  return await response.json();
};

export const parseUrl = (url: string): [Page, URLSearchParams] => {
  // https://farmrpg.com/worker.php?cachebuster=271544&go=getchat&room=giveaways
  const truncatedUrl = url.replace("https://farmrpg.com/", "");
  // worker.php?cachebuster=271544&go=getchat&room=giveaways
  const [pageRaw, queryRaw] = truncatedUrl.split("?");
  const page = pageRaw.replace(".php", "") as Page;
  // worker
  const query = new URLSearchParams(queryRaw);
  // cachebuster=271544&go=getchat&room=giveaways
  return [page, query];
};

export const urlMatches = (
  url: string,
  targetPage: Page,
  targetQuery: URLSearchParams
): boolean => {
  const [page, query] = parseUrl(url);
  if (page !== targetPage) {
    return false;
  }
  for (const key of targetQuery.keys()) {
    if (query.get(key) !== targetQuery.get(key)) {
      return false;
    }
  }
  return true;
};

export const toUrl = (page: Page, query?: URLSearchParams): string => {
  query = query ?? new URLSearchParams();
  query.set("cachebuster", Date.now().toString());
  // don't actually use URLSearchParams.toString() because FarmRPG expects non-encoded "+" chars
  const queryStringSegments: string[] = [];
  for (const [key, value] of query.entries()) {
    queryStringSegments.push(`${key}=${value}`);
  }
  return `https://farmrpg.com/${page}.php?${queryStringSegments.join("&")}`;
};

type InterceptableResponse = Response & { hasBeenIntercepted?: boolean };

declare let fetchWorker: (
  action: string,
  parameters: Record<string, string | number | boolean>
) => Promise<InterceptableResponse>;

export type QueryInterceptorDefinition = [
  CachedState<any, any>,
  QueryInterceptor<any, any>
];

export const queryInterceptors: QueryInterceptorDefinition[] = [];

export const registerQueryInterceptor = (
  interceptor: QueryInterceptorDefinition
): void => {
  queryInterceptors.push(interceptor);
};

export const onFetchResponse = async (response: Response): Promise<void> => {
  // only check farmrpg URLs
  if (!response.url.startsWith("https://farmrpg.com")) {
    return;
  }

  for (const [state, interceptor] of queryInterceptors) {
    if (urlMatches(response.url, ...interceptor.match)) {
      console.debug(`[STATE] fetch intercepted ${response.url}`, interceptor);
      const previous = await state.get({ doNotFetch: true });
      interceptor.callback(state, previous, response);
    }
  }
};

export const watchQueries = (): void => {
  (function (open) {
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener(
        "readystatechange",
        async function () {
          if (this.readyState !== 4) {
            return;
          }
          // only check farmrpg URLs
          if (!this.responseURL.startsWith("https://farmrpg.com")) {
            return;
          }
          for (const [state, interceptor] of queryInterceptors) {
            if (urlMatches(this.responseURL, ...interceptor.match)) {
              console.debug(
                `[STATE] XMLHttpRequest intercepted ${this.responseURL}`,
                interceptor
              );
              const previous = await state.get({ doNotFetch: true });
              interceptor.callback(state, previous, {
                headers: new Headers(),
                ok: this.status >= 200 && this.status < 300,
                redirected: false,
                status: this.status,
                statusText: this.statusText,
                type: "default",
                url: this.responseURL,
                text: () => Promise.resolve(this.responseText),
                json: () => Promise.resolve(JSON.parse(this.responseText)),
                formData: () => Promise.resolve(new FormData()),
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                blob: () => Promise.resolve(new Blob([this.responseText])),
              });
            }
          }
        },
        false
      );
      // eslint-disable-next-line prefer-rest-params
      Reflect.apply(open, this, arguments);
    };
  })(XMLHttpRequest.prototype.open);

  const originalFetch = window.fetch as (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<InterceptableResponse>;
  window.fetch = async (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => {
    const response = await originalFetch(input, init);
    if (!response.hasBeenIntercepted) {
      response.hasBeenIntercepted = true;
      onFetchResponse(response.clone());
    }
    return response;
  };

  const originalFetchWorker = fetchWorker;
  fetchWorker = async (action, parameters) => {
    const response = await originalFetchWorker(action, parameters);
    if (!response.hasBeenIntercepted) {
      response.hasBeenIntercepted = true;
      onFetchResponse(response.clone());
    }
    return response;
  };
};
