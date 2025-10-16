CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS event (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_seats INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_booking_event_user 
ON booking(event_id, user_id);

CREATE INDEX IF NOT EXISTS idx_booking_user_id 
ON booking(user_id);

CREATE INDEX IF NOT EXISTS idx_booking_event_id 
ON booking(event_id);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM event WHERE name = 'Концерт рок-группы') THEN
        INSERT INTO event (name, total_seats) VALUES ('Концерт рок-группы', 100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM event WHERE name = 'Театральная премьера') THEN
        INSERT INTO event (name, total_seats) VALUES ('Театральная премьера', 50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM event WHERE name = 'Спортивное мероприятие') THEN
        INSERT INTO event (name, total_seats) VALUES ('Спортивное мероприятие', 200);
    END IF;
END $$;