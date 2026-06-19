import request from "supertest";
import app from "../../src/main.js";

describe("Requests API", () => {
    it.todo("POST /api/requests - creates request when CLIENT");
    it.todo("POST /api/requests - rejects when PROVIDER");
    it.todo("POST /api/requests - rejects when no auth token");
    it.todo("POST /api/requests - validates productName required");
    it.todo("GET /api/requests - CLIENT sees own requests only");
    it.todo("GET /api/requests - PROVIDER sees PENDING/OFFERED requests");
    it.todo("GET /api/requests/:id - returns request with offers");
    it.todo("GET /api/requests/:id - rejects non-existent request");
    it.todo("DELETE /api/requests/:id - CLIENT cancels own request");
    it.todo("DELETE /api/requests/:id - rejects non-owner");
    it.todo("DELETE /api/requests/:id - rejects already ACCEPTED");
});
