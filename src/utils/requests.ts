export type Responselike = Omit<Response, "clone" | "body" | "bodyUsed">;

export const corsFetch = (
  url: string,
  options?: Partial<GM.Request<any>>
): Promise<Responselike> =>
  new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      ...options,
      method: options?.method ?? "GET",
      url,
      onload: (response) => {
        resolve({
          headers: new Headers(),
          ok: response.status >= 200 && response.status < 300,
          redirected: url !== response.finalUrl,
          status: response.status,
          statusText: response.statusText,
          type: "default",
          url: response.finalUrl,
          text: () => Promise.resolve(response.responseText),
          json: () => Promise.resolve(JSON.parse(response.responseText)),
          formData: () => Promise.resolve(new FormData()),
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob([response.responseText])),
        });
      },
      onerror: reject,
      onabort: reject,
      ontimeout: reject,
    });
  });

export const getDocument = async (
  response: Responselike
): Promise<Document> => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const htmlString = await response.text();
  return new DOMParser().parseFromString(htmlString, "text/html");
};
