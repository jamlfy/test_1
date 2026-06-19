import { Router } from "express";
import { offersController } from "./offers.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import {
    createOfferSchema,
    counterOfferSchema,
    respondCounterSchema,
} from "./offers.schema.js";

const offerActionsRouter = Router();

offerActionsRouter.use(authenticate);

offerActionsRouter.post(
    "/:id",
    authorize("PROVIDER"),
    validate(createOfferSchema),
    offersController.create,
);
offerActionsRouter.get("/:id", offersController.listByRequest);

offerActionsRouter.patch(
    "/:id/accept",
    authorize("CLIENT"),
    offersController.accept,
);
offerActionsRouter.patch(
    "/:id/reject",
    authorize("CLIENT"),
    offersController.reject,
);
offerActionsRouter.post(
    "/:id/counter",
    authorize("CLIENT"),
    validate(counterOfferSchema),
    offersController.counter,
);
offerActionsRouter.patch(
    "/:id/respond-counter",
    authorize("PROVIDER"),
    validate(respondCounterSchema),
    offersController.respondToCounter,
);

export default offerActionsRouter;
