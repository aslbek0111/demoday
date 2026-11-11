-- ==============================================================================
-- BookSpace (JoyBand) — Supabase PostgreSQL Database Schema
-- Promo Code System & Advanced Gallery & Core Platform Tables
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- USERS / PROFILES (Supabase Auth bilan integratsiya)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone VARCHAR(30),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'partner')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLACES (Joylar jadvali)
CREATE TABLE IF NOT EXISTS public.places (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_ru VARCHAR(100) NOT NULL,
    category_key VARCHAR(50) NOT NULL CHECK (category_key IN ('restaurant', 'sport', 'resort', 'coworking', 'cafe')),
    city VARCHAR(100) NOT NULL,
    city_ru VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    address_ru TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    price NUMERIC(12, 2) NOT NULL,
    price_unit VARCHAR(50) NOT NULL,
    price_unit_ru VARCHAR(50) NOT NULL,
    badge VARCHAR(50),
    badge_ru VARCHAR(50),
    badge_color VARCHAR(50) DEFAULT 'bg-indigo-600',
    image TEXT NOT NULL,
    description TEXT,
    description_ru TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    amenities_ru JSONB DEFAULT '[]'::jsonb,
    open_hours VARCHAR(100),
    open_hours_ru VARCHAR(100),
    capacity VARCHAR(100),
    capacity_ru VARCHAR(100),
    show_on_home BOOLEAN DEFAULT TRUE,
    coords JSONB DEFAULT '[41.2995, 69.2401]'::jsonb,
    has_exact_coords BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS (Band qilishlar jadvali)
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(50) PRIMARY KEY, -- 'JB-123456' formatida
    place_id BIGINT NOT NULL REFERENCES public.places(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    duration_hours INT NOT NULL DEFAULT 1,
    duration_unit VARCHAR(20) DEFAULT 'soat',
    guest_count INT NOT NULL DEFAULT 1,
    notes TEXT,
    original_price NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    final_price NUMERIC(12, 2) NOT NULL,
    promo_code VARCHAR(50),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. PROMO CODE SYSTEM TABLES
-- ==============================================================================

-- PROMO CODES (Chegirma promokodlari)
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    description_ru TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC(12, 2) NOT NULL,
    min_booking_amount NUMERIC(12, 2) DEFAULT 0,
    max_discount_amount NUMERIC(12, 2), -- Foizli chegirmada maksimal chegirma limiti
    usage_limit INT DEFAULT NULL, -- null = cheksiz
    used_count INT DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_categories TEXT[] DEFAULT NULL, -- null = barcha toifalar
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMO CODE USAGES (Takroriy suiiste'molni oldini olish)
CREATE TABLE IF NOT EXISTS public.promo_code_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
    booking_id VARCHAR(50) NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_identifier VARCHAR(100) NOT NULL, -- Telefon raqam yoki User ID
    discount_applied NUMERIC(12, 2) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. ADVANCED GALLERY TABLES
-- ==============================================================================

-- PLACE IMAGES (Joylar uchun ko'p sonli galereya rasmlari)
CREATE TABLE IF NOT EXISTS public.place_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id BIGINT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    caption_ru TEXT,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'interior', 'exterior', 'amenity', 'food')),
    display_order INT DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. DEMO DATA FOR PROMO CODES
-- ==============================================================================

INSERT INTO public.promo_codes (code, description, description_ru, discount_type, discount_value, min_booking_amount, max_discount_amount, valid_until, is_active)
VALUES
    ('JOYBAND20', 'Barcha joylar uchun 20% maxsus chegirma', 'Специальная скидка 20% на все бронирования', 'percent', 20, 100000, 200000, NOW() + INTERVAL '180 days', true),
    ('WELCOME10', 'Yangi foydalanuvchilar uchun 10% qutlov chegirmasi', 'Приветственная скидка 10% для новых пользователей', 'percent', 10, 50000, 100000, NOW() + INTERVAL '365 days', true),
    ('BAHOR50', '50 000 so''m qat''iy chegirma', 'Фиксированная скидка 50 000 сум', 'fixed', 50000, 250000, NULL, NOW() + INTERVAL '90 days', true),
    ('DACHA100', 'Dachalar va dam olish maskanlari uchun 100 000 so''m chegirma', 'Скидка 100 000 сум на дачи и зоны отдыха', 'fixed', 100000, 1000000, NULL, NOW() + INTERVAL '120 days', true)
ON CONFLICT (code) DO NOTHING;

-- Indekslar tezkor qidiruv uchun
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category_key);
CREATE INDEX IF NOT EXISTS idx_places_city ON public.places(city);
CREATE INDEX IF NOT EXISTS idx_place_images_place_id ON public.place_images(place_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_bookings_place_id ON public.bookings(place_id);
