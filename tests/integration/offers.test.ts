import request from "supertest";
import app from "../../src/main.js";

describe("Offers API", () => {
    it.todo("POST /api/requests/:id - PROVIDER creates offer");
    it.todo("POST /api/requests/:id - rejects when CLIENT");
    it.todo("POST /api/requests/:id - rejects on non-existent request");
    it.todo("POST /api/requests/:id - rejects on closed request");
    it.todo("POST /api/requests/:id - validates price > 0");
    it.todo("GET /api/requests/:id - lists offers for request");
    it.todo("GET /api/requests/:id - rejects non-existent request");
});
