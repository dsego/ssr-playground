CREATE TABLE "user" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT,
    name TEXT,
    avatar TEXT,
    created_at TEXT,
    updated_at TEXT NOT NULL,
    email_verified INTEGER DEFAULT 0 NOT NULL,
    is_active INTEGER DEFAULT 0 NOT NULL
);
