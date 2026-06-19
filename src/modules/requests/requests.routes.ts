import { Router } from "express";
import { requestsController } from "./requests.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { createRequestSchema } from "./requests.schema.js";

const router = Router();

router.use(authenticate);

router.post(
    "/",
    authorize("CLIENT"),
    validate(createRequestSchema),
    requestsController.create,
);
router.get("/", requestsController.list);
router.get("/:id", requestsController.getById);
router.delete("/:id", authorize("CLIENT"), requestsController.cancel);

export default router;
