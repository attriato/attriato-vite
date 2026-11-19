import { handleContact } from "./contact.js";
import { handleJobs } from "./jobs.js";
import { handleGa4 } from "./ga4.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    if (url.pathname === "/api/jobs") {
      return handleJobs(request, env);
    }

    if (url.pathname.startsWith("/api/ga4/")) {
      return handleGa4(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
