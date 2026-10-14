-- ==============================================================================
-- TARA AI Platform — Class-Wise Adaptive Learning System Database Migration
-- Version: 20261014_create_class_curriculum_and_profiles.sql
-- Tables: student_profiles, curriculum_tiers, curriculum_missions, student_mission_progress
-- ==============================================================================

-- 1. Ensure uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Student Profiles Table with verified class_number (1 to 12)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT,
    class_number INTEGER NOT NULL CHECK (class_number >= 1 AND class_number <= 12),
    school TEXT,
    age INTEGER CHECK (age >= 4 AND age <= 25),
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 1,
    avatar TEXT DEFAULT '👦',
    bio TEXT DEFAULT 'AI Explorer & Future Technologist 🚀',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_class ON public.student_profiles(class_number);

-- 3. Curriculum Tiers Metadata
CREATE TABLE IF NOT EXISTS public.curriculum_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    min_class INTEGER NOT NULL CHECK (min_class >= 1),
    max_class INTEGER NOT NULL CHECK (max_class <= 12),
    age_range TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    focus_topics JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Seed Curriculum Tiers
INSERT INTO public.curriculum_tiers (id, name, min_class, max_class, age_range, description, icon, color, focus_topics)
VALUES 
    ('tier-1-3', 'Foundation Tier', 1, 3, 'Ages 6–8', 'Basic patterns, smart toys, simple instructions, and everyday AI examples.', '🌱', '#10B981', '["Repeating Patterns", "Smart Helpers", "Object Sorting", "Friendly AI"]'),
    ('tier-4-5', 'Explorers Tier', 4, 5, 'Ages 9–10', 'Algorithms, loops, classification, data patterns, and introductory AI concepts.', '🧭', '#3B82F6', '["Algorithms", "Sequence Loops", "Classification", "Smart Rules"]'),
    ('tier-6-8', 'Innovators Tier', 6, 8, 'Ages 11–13', 'Training data, machine learning basics, computer vision, NLP, and AI safety.', '🚀', '#6941F5', '["Machine Learning", "Training Data", "Computer Vision", "AI Safety"]'),
    ('tier-9-10', 'Builders Tier', 9, 10, 'Ages 14–15', 'Supervised learning, datasets, prediction, bias, evaluation, and decision trees.', '⚡', '#F59E0B', '["Supervised Learning", "Decision Trees", "Confusion Matrix", "AI Bias"]'),
    ('tier-11-12', 'Masters Tier', 11, 12, 'Ages 16–18', 'Deep learning, neural networks, computer vision CNNs, LLMs, and governance.', '🔬', '#EC4899', '["Neural Networks", "Gradient Descent", "Transformers & LLMs", "AI Governance"]')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    min_class = EXCLUDED.min_class,
    max_class = EXCLUDED.max_class,
    description = EXCLUDED.description;

-- 4. Update student_mission_progress to include class_number at completion
ALTER TABLE public.student_mission_progress 
    ADD COLUMN IF NOT EXISTS class_number INTEGER CHECK (class_number >= 1 AND class_number <= 12);

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_tiers ENABLE ROW LEVEL SECURITY;

-- Student Profiles RLS Policies
CREATE POLICY "Students can view their own profile"
    ON public.student_profiles
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Students can insert their own profile"
    ON public.student_profiles
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

CREATE POLICY "Students can update their own profile"
    ON public.student_profiles
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claim.sub', true));

-- Curriculum Tiers is readable by all authenticated students and public
CREATE POLICY "Curriculum tiers are readable by all"
    ON public.curriculum_tiers
    FOR SELECT
    USING (true);
