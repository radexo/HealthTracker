const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const Store = require('electron-store');

// Initialize secure store for app settings
const store = new Store();

class HealthTrackerApp {
    constructor() {
        this.mainWindow = null;
        this.db = null;
        this.isDev = process.env.NODE_ENV === 'development';
        this.dbPath = this.getDatabasePath();
    }

    getDatabasePath() {
        const userDataPath = app.getPath('userData');
        const dbDir = path.join(userDataPath, 'database');

        // Ensure database directory exists
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        return path.join(dbDir, 'healthtracker.db');
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Database connection failed:', err);
                    reject(err);
                    return;
                }

                console.log('✅ Connected to SQLite database');
                this.createTables().then(resolve).catch(reject);
            });
        });
    }

    async createTables() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                age INTEGER,
                height REAL,
                gender TEXT,
                activity_level TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            `CREATE TABLE IF NOT EXISTS body_measurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                date DATE NOT NULL,
                weight REAL,
                neck REAL,
                chest REAL,
                waist REAL,
                hips REAL,
                left_arm REAL,
                right_arm REAL,
                left_leg REAL,
                right_leg REAL,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS nutrition (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                date DATE NOT NULL,
                meal_type TEXT,
                food_name TEXT,
                calories REAL,
                protein REAL,
                carbs REAL,
                fat REAL,
                fiber REAL,
                sugar REAL,
                sodium REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                date DATE NOT NULL,
                workout_type TEXT,
                exercise_name TEXT,
                duration INTEGER,
                calories_burned REAL,
                sets INTEGER,
                reps INTEGER,
                weight_kg REAL,
                distance_km REAL,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS sleep (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                date DATE NOT NULL,
                bedtime TIME,
                wake_time TIME,
                duration REAL,
                quality_score INTEGER,
                sleep_efficiency REAL,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS water (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                date DATE NOT NULL,
                amount_ml INTEGER,
                time TIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                category TEXT NOT NULL,
                metric TEXT NOT NULL,
                target_value REAL,
                current_value REAL,
                deadline DATE,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`,

            `CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER DEFAULT 1,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`
        ];

        for (const table of tables) {
            await new Promise((resolve, reject) => {
                this.db.run(table, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        // Insert default user if not exists
        await this.insertDefaultUser();

        console.log('✅ Database tables created successfully');
    }

    async insertDefaultUser() {
        return new Promise((resolve) => {
            this.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                if (err || row.count > 0) {
                    resolve();
                    return;
                }

                const defaultUser = {
                    name: "Пользователь",
                    age: 32,
                    height: 178,
                    gender: "male",
                    activity_level: "moderate"
                };

                this.db.run(
                    `INSERT INTO users (name, age, height, gender, activity_level) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [defaultUser.name, defaultUser.age, defaultUser.height, defaultUser.gender, defaultUser.activity_level],
                    (err) => {
                        if (!err) console.log('✅ Default user created');
                        resolve();
                    }
                );
            });
        });
    }

    createWindow() {
        // Create the browser window
        this.mainWindow = new BrowserWindow({
            width: 1400,
            height: 900,
            minWidth: 1200,
            minHeight: 800,
            icon: path.join(__dirname, 'assets/icon.ico'),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                preload: path.join(__dirname, 'preload.js')
            },
            titleBarStyle: 'default',
            show: false,
            backgroundColor: '#fcfcf9',
            frame: true,
            autoHideMenuBar: true
        });

        // Load the app
        this.mainWindow.loadFile('index.html');

        // Show window when ready to prevent visual flash
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show();

            if (this.isDev) {
                this.mainWindow.webContents.openDevTools();
            }
        });

        // Window closed
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });

        // Handle external links
        this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: 'deny' };
        });
    }

    setupIPC() {
        // Database operations
        ipcMain.handle('db-query', async (event, sql, params = []) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        });

        ipcMain.handle('db-run', async (event, sql, params = []) => {
            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function(err) {
                    if (err) reject(err);
                    else resolve({ 
                        lastID: this.lastID, 
                        changes: this.changes 
                    });
                });
            });
        });

        // Export data
        ipcMain.handle('export-data', async (event, format = 'csv') => {
            try {
                const result = await dialog.showSaveDialog(this.mainWindow, {
                    defaultPath: `HealthTracker-Export-${new Date().toISOString().split('T')[0]}.${format}`,
                    filters: [
                        { name: 'CSV Files', extensions: ['csv'] },
                        { name: 'JSON Files', extensions: ['json'] }
                    ]
                });

                if (!result.canceled) {
                    // Export logic would go here
                    return { success: true, path: result.filePath };
                }

                return { success: false };
            } catch (error) {
                console.error('Export error:', error);
                return { success: false, error: error.message };
            }
        });

        // Backup database
        ipcMain.handle('backup-database', async () => {
            try {
                const result = await dialog.showSaveDialog(this.mainWindow, {
                    defaultPath: `HealthTracker-Backup-${new Date().toISOString().split('T')[0]}.db`,
                    filters: [{ name: 'Database Files', extensions: ['db'] }]
                });

                if (!result.canceled) {
                    fs.copyFileSync(this.dbPath, result.filePath);
                    return { success: true, path: result.filePath };
                }

                return { success: false };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // App info
        ipcMain.handle('get-app-info', () => {
            return {
                version: app.getVersion(),
                name: app.getName(),
                platform: process.platform,
                arch: process.arch
            };
        });
    }

    async initialize() {
        try {
            await this.initDatabase();
            this.setupIPC();
            this.createWindow();

            console.log('✅ HealthTracker 2025 initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            app.quit();
        }
    }

    cleanup() {
        if (this.db) {
            this.db.close((err) => {
                if (err) console.error('Database close error:', err);
                else console.log('✅ Database connection closed');
            });
        }
    }
}

// App instance
const healthTracker = new HealthTrackerApp();

// App event handlers
app.whenReady().then(() => {
    healthTracker.initialize();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        healthTracker.cleanup();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        healthTracker.createWindow();
    }
});

app.on('before-quit', () => {
    healthTracker.cleanup();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});
