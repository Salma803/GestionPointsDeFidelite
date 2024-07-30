import config from "../config/config.json";

export function getBackendURL(path) {
	const server = config.backendServer;
	return `http${server.https ? "s" : ""}://${
		server.host ? server.host : "localhost"
	}${server.port ? ":" + server.port : ""}${
		server.base ? "/" + server.base : ""
	}${path ? (path.startsWith("/") ? path : "/" + path) : "/"}`;
}
