-- ==============================================================================
-- TARA AI Platform — Aira Learning Buddy Database Migration
-- Tables: aira_conversations, aira_messages, aira_quiz_attempts
-- Row Level Security (RLS) enabled with strict user isolation policies
-- ==============================================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Conversations table
CREATE TABLE IF NOT EXISTS public.aira_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'Learning with Aira',
    current_world_id TEXT,
    current_mission_id TEXT,
    student_age INTEGER,
    student_grade TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user query
CREATE INDEX IF NOT EXISTS idx_aira_conversations_user ON public.aira_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_aira_conversations_updated ON public.aira_conversations(updated_at DESC);

-- 3. Messages table
CREATE TABLE IF NOT EXISTS public.aira_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.aira_conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    mission_context JSONB,
    quiz_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for message retrieval by conversation
CREATE INDEX IF NOT EXISTS idx_aira_messages_conversation ON public.aira_messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_aira_messages_user ON public.aira_messages(user_id);

-- 4. Quiz attempts table
CREATE TABLE IF NOT EXISTS public.aira_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    conversation_id UUID REFERENCES public.aira_conversations(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 1,
    percentage INTEGER NOT NULL DEFAULT 0,
    answers_summary JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aira_quiz_attempts_user ON public.aira_quiz_attempts(user_id, created_at DESC);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- Ensure students can only read, insert, and update their own records.
-- Never expose one student's conversation, scores, or profile to another.
-- ==============================================================================

ALTER TABLE public.aira_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aira_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aira_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Conversations RLS
CREATE POLICY "Users can view their own conversations"
    ON public.aira_conversations
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert their own conversations"
    ON public.aira_conversations
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can update their own conversations"
    ON public.aira_conversations
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can delete their own conversations"
    ON public.aira_conversations
    FOR DELETE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Messages RLS
CREATE POLICY "Users can view their own messages"
    ON public.aira_messages
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert their own messages"
    ON public.aira_messages
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Quiz Attempts RLS
CREATE POLICY "Users can view their own quiz attempts"
    ON public.aira_quiz_attempts
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Users can insert their own quiz attempts"
    ON public.aira_quiz_attempts
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));
