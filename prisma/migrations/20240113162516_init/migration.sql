-- DropForeignKey
ALTER TABLE "reset_tokens" DROP CONSTRAINT "reset_tokens_team_member_id_fkey";

-- AddForeignKey
ALTER TABLE "reset_tokens" ADD CONSTRAINT "reset_tokens_team_member_id_fkey" FOREIGN KEY ("team_member_id") REFERENCES "team_member"("team_member_id") ON DELETE CASCADE ON UPDATE CASCADE;
