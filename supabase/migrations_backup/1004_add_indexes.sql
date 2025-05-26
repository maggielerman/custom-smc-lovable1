-- Add indexes for user_id foreign keys to improve query performance

CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_drafts_user_id ON saved_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_carts_user_id ON saved_carts(user_id); 