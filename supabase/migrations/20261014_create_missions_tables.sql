-- ==============================================================================
-- TARA AI Platform — Mission & Challenge Progress Database Migration
-- Tables: student_mission_progress, student_challenges_progress
-- Row Level Security (RLS) enabled with strict user isolation policies
-- ==============================================================================

-- 1. Student Mission Progress Table
CREATE TABLE IF NOT EXISTS public.student_mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    mission_id TEXT NOT NULL,
    world_id TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    stars INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    attempts_count INTEGER NOT NULL DEFAULT 1,
    first_completed_at TIMESTAMPTZ,
    last_attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_mission UNIQUE (user_id, mission_id)
);

CREATE INDEX IF NOT EXISTS idx_mission_progress_user ON public.student_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_progress_world ON public.student_mission_progress(user_id, world_id);

-- 2. Student Challenges Progress Table
CREATE TABLE IF NOT EXISTS public.student_challenges_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT true,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_challenge UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON public.student_challenges_progress(user_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.student_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_challenges_progress ENABLE ROW LEVEL SECURITY;

-- Mission Progress Policies
CREATE POLICY "Students can view their own mission progress"
    ON public.student_mission_progress
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Students can insert their own mission progress"
    ON public.student_mission_progress
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Students can update their own mission progress"
    ON public.student_mission_progress
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Challenge Progress Policies
CREATE POLICY "Students can view their own challenge progress"
    ON public.student_challenges_progress
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Students can insert their own challenge progress"
    ON public.student_challenges_progress
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));
