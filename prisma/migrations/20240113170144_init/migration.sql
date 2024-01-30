/*
  Warnings:

  - A unique constraint covering the columns `[team_member_id]` on the table `reset_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reset_tokens_team_member_id_key" ON "reset_tokens"("team_member_id");
