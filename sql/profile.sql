-- DROP TABLE IF EXISTS "profile";
CREATE TABLE "profile" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    pid TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    avatar TEXT,
    bio TEXT,
    job TEXT,
    city TEXT,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT
);

CREATE VIEW "profile_view"
AS SELECT * FROM "profile" WHERE "deleted_at" IS NULL;

