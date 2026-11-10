import { env } from "../config/env";

export function createPipedriveUrl(path: string,): URL {
    const url = new URL(
        path,
        env.pipedriveBaseUrl,
    );
    url.searchParams.set(
        "api_token",
        env.pipedriveApiToken,
    );
    return url;
}
