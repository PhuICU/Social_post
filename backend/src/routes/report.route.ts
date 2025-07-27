import { Router } from "express";
import reportsInteractionControllers from "~/controllers/report.controller";
import commonMiddlewares from "~/middlewares/common.middleware";
import reportsInteractionMiddlewares from "~/middlewares/report.middleware";
import { wrapRequestHandler } from "~/utils/requestHandler";

const reportsRoutes = Router();

/**
 * description: Create a new report
 * method: POST
 * path: /reports-interaction/create
 * body: REPORTS_INTERACTION_REQUEST_BODY
 */
reportsRoutes.post(
  "/create",
  commonMiddlewares.accessTokenValidator,
  reportsInteractionMiddlewares.reportsValidator,
  wrapRequestHandler(reportsInteractionControllers.creatReport)
);

/**
 * description: Update report status
 * method: PUT
 * path: /reports-interaction/update-status
 * body: REPORTS_INTERACTION_UPDATE_STATUS_REQUEST_BODY
 */
reportsRoutes.put(
  "/update-status",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(reportsInteractionControllers.updateReportStatus)
);
/**
 *description: Get report by type
 *method: GET
 *path: /reports-interaction
 *query: type
 */
reportsRoutes.get(
  "/",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(reportsInteractionControllers.getReportsByType)
);
/**
 * description: Get report by id
 * method: GET
 * path: /reports-interaction/get-report/:id
 * params: id
 */
reportsRoutes.get(
  "/get-report/:id",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(reportsInteractionControllers.getReportById)
);
/**
 * description: Get all reports
 * method: GET
 * path: /reports-interaction/get-all-reports
 */
reportsRoutes.get(
  "/get-all",
  commonMiddlewares.accessTokenValidator,
  commonMiddlewares.isAdmin,
  wrapRequestHandler(reportsInteractionControllers.getReports)
);
/**
 * description: Get all reports by user
 * method: GET
 * path: /reports-interaction/get-all-reports-by-user
 * query: user_id
 *
 */
reportsRoutes.get(
  "/get-all-by-user",
  commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(reportsInteractionControllers.getReportsByReporterId)
);

reportsRoutes.get(
  "/get-all-by-status/:status/:reported_id",
  // commonMiddlewares.accessTokenValidator,
  wrapRequestHandler(
    reportsInteractionControllers.getReportsByStatusAndReportedId
  )
);

export default reportsRoutes;
