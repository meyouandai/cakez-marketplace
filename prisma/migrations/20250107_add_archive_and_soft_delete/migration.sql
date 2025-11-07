-- AlterTable: Add archive fields to ConversationParticipant
ALTER TABLE "ConversationParticipant" ADD COLUMN "archived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ConversationParticipant" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- AlterTable: Add soft delete fields to Conversation
ALTER TABLE "Conversation" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Conversation" ADD COLUMN "deletedBy" TEXT;

-- AlterTable: Add soft delete fields to Message
ALTER TABLE "Message" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Message" ADD COLUMN "deletedBy" TEXT;
