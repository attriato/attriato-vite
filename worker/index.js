import { handleContact } from "./contact.js";
import { handleJobs } from "./jobs.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    if (url.pathname === "/api/jobs") {
      return handleJobs(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
