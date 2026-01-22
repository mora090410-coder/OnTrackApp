-- OnTrack MVP Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- TRIGGER FUNCTION: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TABLE: athletes
-- Stores athlete profile information (one per user)
-- ============================================

CREATE TABLE athletes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    name TEXT NOT NULL,
    grad_year INTEGER NOT NULL,
    sport TEXT NOT NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_athletes_user_id ON athletes(user_id);

CREATE TRIGGER update_athletes_updated_at
    BEFORE UPDATE ON athletes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for athletes
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own athlete"
    ON athletes FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own athlete"
    ON athletes FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own athlete"
    ON athletes FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own athlete"
    ON athletes FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================
-- TABLE: target_strategies
-- Stores targeting preferences (one per athlete)
-- ============================================

CREATE TABLE target_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    levels TEXT[] NOT NULL, -- Array of: 'D1', 'D2', 'D3', 'NAIA', 'JUCO'
    regions TEXT[], -- Array of: 'Midwest', 'Northeast', 'Southeast', 'Southwest', 'West Coast', 'National'
    in_state_only BOOLEAN DEFAULT FALSE,
    target_count INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_target_strategies_athlete_id ON target_strategies(athlete_id);

CREATE TRIGGER update_target_strategies_updated_at
    BEFORE UPDATE ON target_strategies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for target_strategies
ALTER TABLE target_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own strategies"
    ON target_strategies FOR SELECT
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can insert own strategies"
    ON target_strategies FOR INSERT
    WITH CHECK (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can update own strategies"
    ON target_strategies FOR UPDATE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can delete own strategies"
    ON target_strategies FOR DELETE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- ============================================
-- TABLE: schools
-- Stores target schools
-- ============================================

CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    division TEXT, -- D1, D2, D3, NAIA, JUCO
    state TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium', -- High, Medium, Low
    status TEXT NOT NULL DEFAULT 'Researching', -- Researching, Contacted, Engaged, Active, Closed
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_athlete_id ON schools(athlete_id);
CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_schools_priority ON schools(priority);

CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for schools
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own schools"
    ON schools FOR SELECT
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can insert own schools"
    ON schools FOR INSERT
    WITH CHECK (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can update own schools"
    ON schools FOR UPDATE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can delete own schools"
    ON schools FOR DELETE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- ============================================
-- TABLE: coaches
-- Stores coach contacts associated with schools
-- ============================================

CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT, -- Head Coach, Assistant Coach, Recruiting Coordinator, Other
    email TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coaches_school_id ON coaches(school_id);

CREATE TRIGGER update_coaches_updated_at
    BEFORE UPDATE ON coaches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for coaches
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own coaches"
    ON coaches FOR SELECT
    USING (
        school_id IN (
            SELECT s.id FROM schools s
            JOIN athletes a ON s.athlete_id = a.id
            WHERE a.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can insert own coaches"
    ON coaches FOR INSERT
    WITH CHECK (
        school_id IN (
            SELECT s.id FROM schools s
            JOIN athletes a ON s.athlete_id = a.id
            WHERE a.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can update own coaches"
    ON coaches FOR UPDATE
    USING (
        school_id IN (
            SELECT s.id FROM schools s
            JOIN athletes a ON s.athlete_id = a.id
            WHERE a.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can delete own coaches"
    ON coaches FOR DELETE
    USING (
        school_id IN (
            SELECT s.id FROM schools s
            JOIN athletes a ON s.athlete_id = a.id
            WHERE a.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- ============================================
-- TABLE: interactions
-- Stores all recruiting interactions/touchpoints
-- ============================================

CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- Email Sent, Camp Attended, Phone Call, Campus Visit, Coach Conversation, Note/Update
    date DATE NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interactions_athlete_id ON interactions(athlete_id);
CREATE INDEX idx_interactions_school_id ON interactions(school_id);
CREATE INDEX idx_interactions_date ON interactions(date DESC);

CREATE TRIGGER update_interactions_updated_at
    BEFORE UPDATE ON interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for interactions
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own interactions"
    ON interactions FOR SELECT
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can insert own interactions"
    ON interactions FOR INSERT
    WITH CHECK (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can update own interactions"
    ON interactions FOR UPDATE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can delete own interactions"
    ON interactions FOR DELETE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- ============================================
-- TABLE: follow_ups
-- Stores follow-up reminders (auto-generated and manual)
-- ============================================

CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    interaction_id UUID REFERENCES interactions(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    snoozed_until DATE, -- If user snoozes the follow-up
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_follow_ups_athlete_id ON follow_ups(athlete_id);
CREATE INDEX idx_follow_ups_due_date ON follow_ups(due_date);
CREATE INDEX idx_follow_ups_completed ON follow_ups(completed);

CREATE TRIGGER update_follow_ups_updated_at
    BEFORE UPDATE ON follow_ups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS for follow_ups
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own follow_ups"
    ON follow_ups FOR SELECT
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can insert own follow_ups"
    ON follow_ups FOR INSERT
    WITH CHECK (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can update own follow_ups"
    ON follow_ups FOR UPDATE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

CREATE POLICY "Users can delete own follow_ups"
    ON follow_ups FOR DELETE
    USING (
        athlete_id IN (
            SELECT id FROM athletes 
            WHERE user_id = current_setting('request.jwt.claims', true)::json->>'sub'
        )
    );

-- ============================================
-- GRANT PERMISSIONS (for Supabase anon/authenticated roles)
-- ============================================

-- These grants allow the authenticated users to access the tables
-- Supabase automatically handles this for most cases, but we include them for completeness

GRANT ALL ON athletes TO authenticated;
GRANT ALL ON target_strategies TO authenticated;
GRANT ALL ON schools TO authenticated;
GRANT ALL ON coaches TO authenticated;
GRANT ALL ON interactions TO authenticated;
GRANT ALL ON follow_ups TO authenticated;

-- ============================================
-- DONE! Copy and run this entire script in Supabase SQL Editor
-- ============================================
