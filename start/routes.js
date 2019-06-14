"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

// Auth
Route.post("/v1/auth/login", "/v1/AuthController.login");
Route.get("/v1/auth/me", "/v1/AuthController.me").middleware("auth");

// Admin Conversations
Route.get(
  "/v1/admin/conversations",
  "/v1/Admin/ConversationController.index"
).middleware("auth");
Route.get(
  "/v1/admin/conversations/:id/messages",
  "/v1/Admin/ConversationMessageController.index"
).middleware("auth");
Route.post(
  "/v1/admin/conversations/:id/messages",
  "/v1/Admin/ConversationMessageController.store"
).middleware("auth");
// .middleware(['auth', 'throttle:10,10'])

// Conversations
Route.post("/v1/conversations", "/v1/ConversationController.store");
// .middleware(['throttle:10,10'])
Route.get(
  "/v1/conversations/:id/messages",
  "/v1/ConversationMessageController.index"
);
Route.post(
  "/v1/conversations/:id/messages",
  "/v1/ConversationMessageController.store"
);
// .middleware(['throttle:10,10'])
Route.get("/v1/matches", "/v1/MatchController.index").middleware("authCheck");
Route.get("/v1/my-matches", "/v1/MyMatchesController.index").middleware("auth");
Route.get("/v1/matches/:matchId", "/v1/MatchController.show").middleware(
  "auth"
);
Route.post("/v1/matches", "/v1/MatchController.store").middleware("auth");
Route.patch(
  "/v1/matches/:matchId/move-piece",
  "/v1/MatchMovePieceController.update"
).middleware("auth");
Route.patch(
  "/v1/matches/:matchId/join-match",
  "/v1/MatchJoinController.update"
).middleware("auth");
Route.patch(
  "/v1/matches/:matchId/submit-pieces",
  "/v1/MatchSubmitPiecesController.update"
).middleware("auth");
