// HealthTracker 2025 - Fixed Desktop Application Logic
class HealthTracker2025 {
    constructor() {
        this.version = '1.0.0';
        this.currentSection = 'dashboard';
        this.currentTheme = this.getStoredTheme();
        this.charts = new Map();
        
        // Application data structure (simulating SQLite database)
        this.data = {
            profile: {
                name: "Пользователь",
                age: 32,
                height: 178,
                weight: 72.5,
                gender: "male",
                activityLevel: "moderate",
                createdAt: new Date().toISOString()
            },
            goals: {
                weight: 70.0,
                waist: 80.0,
                chest: 100.0,
                thigh: 55.0,
                calories: 2200,
                protein: 140,
                fat: 70,
                carbs: 220,
                water: 2500,
                sleep: 8.0,
                workouts: 5,
                steps: 10000
            },
            measurements: {
                current: {
                    weight: 72.5,
                    neck: 35,
                    chest: 100,
                    waist: 82,
                    hips: 95,
                    leftArm: 30,
                    rightArm: 30,
                    leftLeg: 55,
                    rightLeg: 55,
                    date: new Date().toISOString()
                },
                history: [
                    { date: '2025-01-15', weight: 72.5, neck: 35, chest: 100, waist: 82, hips: 95, leftArm: 30, rightArm: 30, leftLeg: 55, rightLeg: 55 },
                    { date: '2025-01-10', weight: 73.2, neck: 35.5, chest: 102, waist: 84, hips: 96, leftArm: 29.5, rightArm: 29.5, leftLeg: 56, rightLeg: 56 },
                    { date: '2025-01-05', weight: 74.1, neck: 36, chest: 103, waist: 86, hips: 97, leftArm: 29, rightArm: 29, leftLeg: 57, rightLeg: 57 }
                ]
            },
            nutrition: {
                daily: {
                    date: new Date().toISOString().split('T')[0],
                    calories: 1847,
                    protein: 108,
                    carbs: 132,
                    fat: 42,
                    meals: {
                        breakfast: [
                            { name: "Овсянка на молоке", amount: "200г", calories: 280, protein: 12, carbs: 42, fat: 8 },
                            { name: "Банан средний", amount: "1 шт (118г)", calories: 105, protein: 1, carbs: 27, fat: 0 },
                            { name: "Мед натуральный", amount: "1 ч.л. (7г)", calories: 35, protein: 0, carbs: 8, fat: 0 }
                        ],
                        lunch: [
                            { name: "Куриная грудка запеченная", amount: "150г", calories: 248, protein: 46, carbs: 0, fat: 5 },
                            { name: "Рис отварной", amount: "100г", calories: 130, protein: 3, carbs: 28, fat: 0 },
                            { name: "Салат овощной с маслом", amount: "200г", calories: 185, protein: 2, carbs: 12, fat: 15 }
                        ],
                        dinner: [
                            { name: "Лосось запеченный", amount: "120г", calories: 250, protein: 25, carbs: 0, fat: 16 },
                            { name: "Брокколи на пару", amount: "150г", calories: 51, protein: 5, carbs: 7, fat: 1 },
                            { name: "Киноа отварная", amount: "80г", calories: 112, protein: 4, carbs: 20, fat: 2 }
                        ],
                        snacks: [
                            { name: "Йогурт греческий 2%", amount: "150г", calories: 97, protein: 15, carbs: 6, fat: 3 },
                            { name: "Миндаль сырой", amount: "20г", calories: 130, protein: 5, carbs: 2, fat: 11 }
                        ]
                    }
                }
            },
            water: {
                daily: {
                    date: new Date().toISOString().split('T')[0],
                    current: 1750,
                    goal: 2500,
                    intake: [
                        { time: '08:30', amount: 250, type: 'Утренний стакан' },
                        { time: '11:15', amount: 500, type: 'Во время работы' },
                        { time: '14:45', amount: 250, type: 'С обедом' },
                        { time: '16:30', amount: 500, type: 'После тренировки' },
                        { time: '18:00', amount: 250, type: 'Перед ужином' }
                    ]
                }
            },
            achievements: [
                { id: 1, title: 'Серия 7 дней', description: 'Достигал цели по воде', date: 'Вчера', earned: true },
                { id: 2, title: 'Снижение веса', description: '-2.5 кг за месяц', date: '3 дня назад', earned: true },
                { id: 3, title: 'Постоянство тренировок', description: '15 тренировок завершено', date: 'Неделю назад', earned: true }
            ]
        };

        console.log('🚀 HealthTracker 2025 starting initialization...');
    }

    async init() {
        try {
            console.log('📋 Loading stored data...');
            this.loadStoredData();
            
            console.log('🎨 Applying theme...');
            this.applyTheme();
            
            console.log('🎯 Setting up event listeners...');
            this.setupEventListeners();
            
            console.log('🖥️ Updating user interface...');
            this.updateUserInterface();
            this.calculateAndDisplayBMI();
            
            // Initialize charts after DOM is ready
            setTimeout(() => {
                console.log('📈 Initializing charts...');
                this.initializeCharts();
                this.updateAllDisplays();
            }, 500);
            
            // Set current date in date inputs
            this.setCurrentDates();
            
            console.log('✅ HealthTracker 2025 initialized successfully!');
            this.showNotification('HealthTracker 2025 готов к работе!', 'success');
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            this.showNotification('Ошибка инициализации приложения', 'error');
        }
    }

    // Data Management
    loadStoredData() {
        try {
            const storedData = localStorage.getItem('healthtracker-2025-data');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                this.data = { ...this.data, ...parsed };
                console.log('📊 Data loaded from localStorage');
            }
        } catch (error) {
            console.error('❌ Error loading stored data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('healthtracker-2025-data', JSON.stringify(this.data));
            console.log('💾 Data saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving data:', error);
        }
    }

    // Theme Management
    getStoredTheme() {
        return localStorage.getItem('healthtracker-theme') || 'light';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
        localStorage.setItem('healthtracker-theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.showNotification(`Переключено на ${this.currentTheme === 'light' ? 'светлую' : 'темную'} тему`);
    }

    // Event Listeners Setup - FIXED VERSION
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');

        // Navigation - FIXED
        this.setupNavigation();
        
        // Header controls - FIXED
        this.setupHeaderControls();
        
        // Quick actions - FIXED
        this.setupQuickActions();
        
        // Body measurements - FIXED
        this.setupBodyMeasurements();
        
        // Water tracking - FIXED
        this.setupWaterControls();
        
        // Settings - FIXED
        this.setupSettingsControls();
        
        // Modals - FIXED
        this.setupModals();

        console.log('✅ Event listeners setup complete');
    }

    setupNavigation() {
        console.log('🧭 Setting up navigation...');
        const navItems = document.querySelectorAll('.nav-item');
        console.log(`Found ${navItems.length} navigation items`);
        
        navItems.forEach((item, index) => {
            const section = item.getAttribute('data-section');
            console.log(`Setting up nav item ${index}: ${section}`);
            
            // Remove any existing listeners
            item.removeEventListener('click', this.handleNavClick);
            
            // Add new listener with proper binding
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Navigation clicked: ${section}`);
                
                if (section && section !== this.currentSection) {
                    this.showSection(section);
                    this.setActiveNavItem(item);
                }
            });
        });
    }

    setupHeaderControls() {
        console.log('🎛️ Setting up header controls...');
        
        const themeToggle = document.getElementById('theme-toggle');
        const quickAddBtn = document.getElementById('quick-add-btn');

        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
            console.log('✅ Theme toggle listener added');
        } else {
            console.warn('⚠️ Theme toggle button not found');
        }

        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Quick add button clicked');
                this.showModal('quick-add-modal');
            });
            console.log('✅ Quick add button listener added');
        } else {
            console.warn('⚠️ Quick add button not found');
        }
    }

    setupQuickActions() {
        console.log('⚡ Setting up quick actions...');
        const actionBtns = document.querySelectorAll('.action-btn');
        console.log(`Found ${actionBtns.length} action buttons`);
        
        actionBtns.forEach((btn, index) => {
            const action = btn.getAttribute('data-action');
            console.log(`Setting up action button ${index}: ${action}`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Quick action clicked: ${action}`);
                this.handleQuickAction(action);
            });
        });
    }

    setupBodyMeasurements() {
        console.log('📏 Setting up body measurements...');
        
        // Interactive body parts
        const bodyParts = document.querySelectorAll('.body-part');
        console.log(`Found ${bodyParts.length} body parts`);
        
        bodyParts.forEach((part, index) => {
            const partName = part.getAttribute('data-part');
            console.log(`Setting up body part ${index}: ${partName}`);
            
            part.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Body part clicked: ${partName}`);
                if (partName) {
                    this.showBodyPartDetails(partName);
                }
            });
        });

        const addMeasurementBtn = document.getElementById('add-measurement-btn');
        if (addMeasurementBtn) {
            addMeasurementBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Add measurement button clicked');
                this.showModal('add-measurement-modal');
            });
            console.log('✅ Add measurement button listener added');
        }

        const closeChart = document.getElementById('close-chart');
        if (closeChart) {
            closeChart.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideBodyMeasurementChart();
            });
        }
    }

    setupWaterControls() {
        console.log('💧 Setting up water controls...');
        const waterBtns = document.querySelectorAll('.water-btn');
        console.log(`Found ${waterBtns.length} water buttons`);
        
        waterBtns.forEach((btn, index) => {
            const amount = btn.getAttribute('data-amount');
            console.log(`Setting up water button ${index}: ${amount}ml`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Water button clicked: ${amount}ml`);
                
                if (btn.classList.contains('custom-water')) {
                    this.showCustomWaterInput();
                } else if (amount) {
                    this.addWaterIntake(parseInt(amount));
                }
            });
        });
    }

    setupSettingsControls() {
        console.log('⚙️ Setting up settings controls...');
        
        // Settings navigation
        const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
        console.log(`Found ${settingsNavBtns.length} settings nav buttons`);
        
        settingsNavBtns.forEach((btn, index) => {
            const settings = btn.getAttribute('data-settings');
            console.log(`Setting up settings nav ${index}: ${settings}`);
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Settings nav clicked: ${settings}`);
                this.showSettingsPanel(settings);
                this.setActiveSettingsNav(btn);
            });
        });

        // Export buttons
        const exportBtns = document.querySelectorAll('[id^="export-"]');
        console.log(`Found ${exportBtns.length} export buttons`);
        
        exportBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const format = btn.id.replace('export-', '');
                console.log(`Export button clicked: ${format}`);
                this.exportData(format);
            });
        });
    }

    setupModals() {
        console.log('🪟 Setting up modals...');
        
        // Quick add modal
        this.setupModalHandlers('quick-add-modal', 'close-quick-add');
        
        // Add measurement modal  
        this.setupModalHandlers('add-measurement-modal', 'close-measurement');

        // Quick add options
        const quickAddCards = document.querySelectorAll('.quick-add-card');
        console.log(`Found ${quickAddCards.length} quick add cards`);
        
        quickAddCards.forEach((card, index) => {
            const type = card.getAttribute('data-type');
            console.log(`Setting up quick add card ${index}: ${type}`);
            
            card.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Quick add card clicked: ${type}`);
                this.handleQuickAddType(type);
            });
        });
    }

    setupModalHandlers(modalId, closeId) {
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeId);

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Close button clicked for modal: ${modalId}`);
                this.hideModal(modalId);
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    console.log(`Modal overlay clicked for: ${modalId}`);
                    this.hideModal(modalId);
                }
            });
        }
    }

    // Navigation Methods - FIXED
    showSection(sectionName) {
        console.log(`🔄 Switching to section: ${sectionName}`);
        
        try {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
                console.log(`Hiding section: ${section.id}`);
            });

            // Show target section
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionName;
                console.log(`✅ Switched to section: ${sectionName}`);

                // Update section-specific content
                setTimeout(() => {
                    this.updateSectionContent(sectionName);
                }, 100);
            } else {
                console.error(`❌ Section not found: ${sectionName}`);
            }
        } catch (error) {
            console.error(`❌ Error switching to section ${sectionName}:`, error);
        }
    }

    setActiveNavItem(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        if (activeItem) {
            activeItem.classList.add('active');
            console.log('✅ Active nav item set');
        }
    }

    updateSectionContent(sectionName) {
        console.log(`📋 Updating content for section: ${sectionName}`);
        
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'body':
                this.updateBodySection();
                break;
            case 'nutrition':
                this.updateNutritionSection();
                break;
            case 'water':
                this.updateWaterSection();
                break;
            case 'settings':
                this.updateSettingsSection();
                break;
            default:
                console.log(`No specific update needed for section: ${sectionName}`);
        }
    }

    // Modal Management - FIXED
    showModal(modalId) {
        console.log(`🪟 Showing modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log(`✅ Modal shown: ${modalId}`);
        } else {
            console.error(`❌ Modal not found: ${modalId}`);
        }
    }

    hideModal(modalId) {
        console.log(`🪟 Hiding modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            console.log(`✅ Modal hidden: ${modalId}`);
        }
    }

    // Quick Actions - FIXED
    handleQuickAction(action) {
        console.log(`⚡ Handling quick action: ${action}`);
        
        switch (action) {
            case 'add-weight':
                this.showModal('add-measurement-modal');
                break;
            case 'add-meal':
                this.showSection('nutrition');
                this.setActiveNavItem(document.querySelector('[data-section="nutrition"]'));
                this.showNotification('Переход к разделу питания');
                break;
            case 'add-water':
                this.addWaterIntake(250);
                break;
            case 'add-workout':
                this.showSection('workouts');
                this.setActiveNavItem(document.querySelector('[data-section="workouts"]'));
                this.showNotification('Переход к разделу тренировок');
                break;
            case 'add-measurement':
                this.showModal('add-measurement-modal');
                break;
            case 'add-sleep':
                this.showSection('sleep');
                this.setActiveNavItem(document.querySelector('[data-section="sleep"]'));
                this.showNotification('Переход к разделу сна');
                break;
            default:
                console.warn(`⚠️ Unknown action: ${action}`);
        }
    }

    handleQuickAddType(type) {
        console.log(`⚡ Handling quick add type: ${type}`);
        this.hideModal('quick-add-modal');
        this.handleQuickAction(`add-${type}`);
    }

    // UI Update Methods
    updateUserInterface() {
        this.updateUserName();
        this.updateAllDisplays();
    }

    updateUserName() {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = this.data.profile.name;
        }
    }

    updateAllDisplays() {
        this.updateDashboard();
        this.updateBodySection();
        this.updateNutritionSection();
        this.updateWaterSection();
    }

    setCurrentDates() {
        const today = new Date().toISOString().split('T')[0];
        const nutritionDate = document.getElementById('nutrition-date');
        const waterDate = document.getElementById('water-date');

        if (nutritionDate) nutritionDate.value = today;
        if (waterDate) waterDate.value = today;
    }

    // BMI Calculation
    calculateAndDisplayBMI() {
        const height = this.data.profile.height / 100; // Convert to meters
        const weight = this.data.measurements.current.weight;
        const bmi = weight / (height * height);
        
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        
        if (bmiValue) {
            bmiValue.textContent = bmi.toFixed(1);
        }
        
        if (bmiCategory) {
            let category = '';
            if (bmi < 18.5) category = 'Недостаточный вес';
            else if (bmi < 25) category = 'Нормальный вес';
            else if (bmi < 30) category = 'Избыточный вес';
            else category = 'Ожирение';
            
            bmiCategory.textContent = category;
        }
        
        // Update BMI scale indicator
        const scaleIndicator = document.querySelector('.scale-indicator');
        if (scaleIndicator) {
            let percentage = 0;
            if (bmi < 18.5) percentage = (bmi / 18.5) * 25;
            else if (bmi < 25) percentage = 25 + ((bmi - 18.5) / (25 - 18.5)) * 50;
            else if (bmi < 30) percentage = 75 + ((bmi - 25) / (30 - 25)) * 25;
            else percentage = 100;
            
            scaleIndicator.style.left = `${Math.min(percentage, 100)}%`;
        }
    }

    // Dashboard Methods
    updateDashboard() {
        this.updateDashboardStats();
        this.updateAchievements();
    }

    updateDashboardStats() {
        // Update current weight
        const currentWeight = document.getElementById('current-weight');
        if (currentWeight) {
            currentWeight.textContent = `${this.data.measurements.current.weight} кг`;
        }

        // Update weight goal
        const weightGoal = document.getElementById('weight-goal');
        const weightDiff = document.getElementById('weight-diff');
        if (weightGoal) {
            weightGoal.textContent = `${this.data.goals.weight} кг`;
        }
        if (weightDiff) {
            const diff = this.data.measurements.current.weight - this.data.goals.weight;
            weightDiff.textContent = `${diff > 0 ? '-' : '+'}${Math.abs(diff).toFixed(1)} кг до цели`;
            weightDiff.className = `progress-diff ${diff <= 0 ? 'success' : 'warning'}`;
        }

        // Update calories
        const caloriesToday = document.getElementById('calories-today');
        if (caloriesToday) {
            caloriesToday.textContent = `${this.data.nutrition.daily.calories} / ${this.data.goals.calories} ккал`;
        }

        // Update water
        const waterToday = document.getElementById('water-today');
        if (waterToday) {
            waterToday.textContent = `${this.data.water.daily.current} / ${this.data.water.daily.goal} мл`;
        }

        // Update water glasses
        this.updateWaterGlasses();
    }

    updateWaterGlasses() {
        const glasses = document.querySelectorAll('.glass');
        const percentage = this.data.water.daily.current / this.data.water.daily.goal;
        const filledGlasses = Math.floor(percentage * glasses.length);

        glasses.forEach((glass, index) => {
            if (index < filledGlasses) {
                glass.classList.add('filled');
                glass.classList.remove('empty');
            } else {
                glass.classList.remove('filled');
                glass.classList.add('empty');
            }
        });
    }

    updateAchievements() {
        const achievementList = document.getElementById('achievement-list');
        if (achievementList) {
            achievementList.innerHTML = this.data.achievements.slice(0, 2).map(achievement => `
                <div class="achievement-item">
                    <span class="badge">${achievement.id === 1 ? '🔥' : achievement.id === 2 ? '📉' : '💪'}</span>
                    <div class="achievement-text">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                    </div>
                    <span class="achievement-date">${achievement.date}</span>
                </div>
            `).join('');
        }
    }

    // Body Measurements Methods
    updateBodySection() {
        this.updateMeasurementsList();
    }

    updateMeasurementsList() {
        const measurementsList = document.getElementById('measurements-list');
        if (measurementsList) {
            const measurements = this.data.measurements.current;
            const goals = this.data.goals;
            
            const measurementMap = [
                { name: 'Шея', key: 'neck', unit: 'см' },
                { name: 'Грудь', key: 'chest', unit: 'см' },
                { name: 'Талия', key: 'waist', unit: 'см' },
                { name: 'Бедра', key: 'hips', unit: 'см' },
                { name: 'Левая рука', key: 'leftArm', unit: 'см' },
                { name: 'Правая рука', key: 'rightArm', unit: 'см' },
                { name: 'Левое бедро', key: 'leftLeg', unit: 'см' },
                { name: 'Правое бедро', key: 'rightLeg', unit: 'см' }
            ];

            measurementsList.innerHTML = measurementMap.map(item => {
                const current = measurements[item.key];
                const goal = goals[item.key] || current;
                const diff = current - goal;
                const status = Math.abs(diff) <= 0.5 ? 'success' : 'warning';
                const statusText = Math.abs(diff) <= 0.5 ? '✓' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)}`;
                
                return `
                    <div class="measurement-row">
                        <span class="measurement-name">${item.name}</span>
                        <span class="measurement-value">${current} ${item.unit}</span>
                        <span class="measurement-status ${status}">${statusText}</span>
                    </div>
                `;
            }).join('');
        }
    }

    showBodyPartDetails(partName) {
        console.log(`📏 Showing body part details: ${partName}`);
        
        const detailElement = document.getElementById('measurement-detail');
        const chartElement = document.getElementById('measurement-chart');

        if (detailElement) detailElement.style.display = 'none';
        if (chartElement) {
            chartElement.style.display = 'block';
            
            const titleEl = document.getElementById('chart-title');
            if (titleEl) {
                titleEl.textContent = `${this.getPartDisplayName(partName)} - График изменений`;
            }

            this.showBodyPartChart(partName);
            this.updateMeasurementStats(partName);
        }
    }

    hideBodyMeasurementChart() {
        const detailElement = document.getElementById('measurement-detail');
        const chartElement = document.getElementById('measurement-chart');

        if (detailElement) detailElement.style.display = 'block';
        if (chartElement) chartElement.style.display = 'none';
    }

    showBodyPartChart(partName) {
        const ctx = document.getElementById('body-measurement-chart');
        if (!ctx) return;

        const chartId = `body-${partName}`;
        
        if (this.charts.has(chartId)) {
            this.charts.get(chartId).destroy();
        }

        const history = this.data.measurements.history;
        const current = this.data.measurements.current;
        
        const labels = [...history.map(h => new Date(h.date).toLocaleDateString('ru')), 'Сегодня'];
        const data = [...history.map(h => h[partName] || 0), current[partName] || 0];

        try {
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: this.getPartDisplayName(partName),
                        data: data,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#1FB8CD',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return value + ' см';
                                }
                            }
                        }
                    }
                }
            });

            this.charts.set(chartId, chart);
        } catch (error) {
            console.error(`Error creating body measurement chart for ${partName}:`, error);
        }
    }

    updateMeasurementStats(partName) {
        const current = this.data.measurements.current[partName];
        const goal = this.data.goals[partName] || current;
        const lastMeasurement = this.data.measurements.history[0]?.[partName];
        
        const currentEl = document.getElementById('current-measurement');
        const targetEl = document.getElementById('target-measurement');
        const monthChangeEl = document.getElementById('month-change');
        const toGoalEl = document.getElementById('to-goal');
        
        if (currentEl) currentEl.textContent = `${current} см`;
        if (targetEl) targetEl.textContent = `${goal} см`;
        if (monthChangeEl && lastMeasurement) {
            const change = current - lastMeasurement;
            monthChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)} см`;
            monthChangeEl.className = change <= 0 ? 'success' : 'warning';
        }
        if (toGoalEl) {
            const toGoal = goal - current;
            toGoalEl.textContent = `${toGoal >= 0 ? '' : '+'}${Math.abs(toGoal).toFixed(1)} см`;
        }
    }

    getPartDisplayName(partName) {
        const names = {
            neck: 'Шея',
            chest: 'Грудь',
            waist: 'Талия',
            hips: 'Бедра',
            leftArm: 'Левая рука',
            rightArm: 'Правая рука',
            leftLeg: 'Левое бедро',
            rightLeg: 'Правое бедро'
        };
        return names[partName] || partName;
    }

    // Nutrition Methods
    updateNutritionSection() {
        this.updateNutritionMacros();
        this.updateCaloriesRemaining();
    }

    updateNutritionMacros() {
        const nutrition = this.data.nutrition.daily;
        const goals = this.data.goals;

        // Update macro circles
        const macros = [
            { current: nutrition.calories, goal: goals.calories, color: '#1FB8CD' },
            { current: nutrition.protein, goal: goals.protein, color: '#FFC185' },
            { current: nutrition.carbs, goal: goals.carbs, color: '#B4413C' },
            { current: nutrition.fat, goal: goals.fat, color: '#5D878F' }
        ];

        macros.forEach((macro, index) => {
            const circle = document.querySelectorAll('.macro-chart circle:last-child')[index];
            if (circle) {
                const percentage = Math.min((macro.current / macro.goal) * 100, 100);
                const circumference = 2 * Math.PI * 45;
                const offset = circumference - (percentage / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }

            const percentEl = document.querySelectorAll('.macro-percent')[index];
            if (percentEl) {
                percentEl.textContent = `${Math.round((macro.current / macro.goal) * 100)}%`;
            }
        });
    }

    updateCaloriesRemaining() {
        const remaining = this.data.goals.calories - this.data.nutrition.daily.calories;
        const remainingEl = document.getElementById('calories-remaining');
        if (remainingEl) {
            remainingEl.textContent = remaining;
            remainingEl.className = `remaining-value ${remaining > 0 ? 'success' : 'warning'}`;
        }
    }

    // Water Methods - FIXED
    updateWaterSection() {
        this.updateWaterDisplay();
        this.updateWaterIntakeTimeline();
    }

    updateWaterDisplay() {
        const current = this.data.water.daily.current;
        const goal = this.data.water.daily.goal;
        const percentage = (current / goal) * 100;

        // Update water fill
        const waterFill = document.getElementById('water-fill');
        if (waterFill) {
            waterFill.style.height = `${Math.min(percentage, 100)}%`;
        }

        // Update current amount
        const waterCurrent = document.getElementById('water-current');
        if (waterCurrent) {
            waterCurrent.textContent = current;
        }

        // Update goal display
        const waterGoalDisplay = document.getElementById('water-goal-display');
        if (waterGoalDisplay) {
            waterGoalDisplay.textContent = goal;
        }

        // Update remaining
        const waterRemaining = document.getElementById('water-remaining');
        if (waterRemaining) {
            const remaining = Math.max(0, goal - current);
            waterRemaining.textContent = `${remaining} мл`;
        }

        // Update percentage
        const waterPercentage = document.querySelector('.water-percentage');
        if (waterPercentage) {
            waterPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }

    updateWaterIntakeTimeline() {
        const timeline = document.getElementById('water-timeline');
        if (timeline) {
            timeline.innerHTML = this.data.water.daily.intake.map(intake => `
                <div class="intake-entry">
                    <span class="intake-time">${intake.time}</span>
                    <span class="intake-amount">${intake.amount} мл</span>
                    <span class="intake-type">${intake.type}</span>
                </div>
            `).join('');
        }
    }

    addWaterIntake(amount, type = 'Обычная вода') {
        console.log(`💧 Adding water intake: ${amount}ml`);
        
        this.data.water.daily.current += amount;
        
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        this.data.water.daily.intake.unshift({
            time: timeString,
            amount: amount,
            type: type
        });

        // Keep only last 10 entries
        if (this.data.water.daily.intake.length > 10) {
            this.data.water.daily.intake = this.data.water.daily.intake.slice(0, 10);
        }

        this.updateWaterSection();
        this.updateWaterGlasses();
        this.saveData();
        
        const percentage = (this.data.water.daily.current / this.data.water.daily.goal) * 100;
        if (percentage >= 100 && percentage < 110) {
            this.showNotification('🎉 Поздравляем! Дневная цель по воде достигнута!', 'success');
        } else {
            this.showNotification(`Добавлено ${amount} мл воды`);
        }
    }

    showCustomWaterInput() {
        const amount = prompt('Введите количество воды в мл:', '250');
        if (amount && !isNaN(amount) && parseInt(amount) > 0) {
            this.addWaterIntake(parseInt(amount));
        }
    }

    // Settings Methods
    updateSettingsSection() {
        console.log('⚙️ Updating settings section...');
    }

    showSettingsPanel(panelName) {
        console.log(`⚙️ Showing settings panel: ${panelName}`);
        
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        const targetPanel = document.getElementById(`${panelName}-settings`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            console.log(`✅ Settings panel shown: ${panelName}`);
        }
    }

    setActiveSettingsNav(activeBtn) {
        document.querySelectorAll('.settings-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Data Export
    exportData(format) {
        console.log(`📤 Exporting data in format: ${format}`);
        
        let data, blob, filename;

        switch (format) {
            case 'csv':
                data = this.convertToCSV();
                blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
                filename = `HealthTracker_${new Date().toISOString().split('T')[0]}.csv`;
                break;
            case 'json':
                data = JSON.stringify(this.data, null, 2);
                blob = new Blob([data], { type: 'application/json' });
                filename = `HealthTracker_${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'pdf':
                this.generateTextReport();
                return;
            default:
                data = JSON.stringify(this.data, null, 2);
                blob = new Blob([data], { type: 'application/json' });
                filename = `HealthTracker_export_${new Date().toISOString().split('T')[0]}.json`;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification(`Данные экспортированы в формате ${format.toUpperCase()}`);
    }

    convertToCSV() {
        const headers = ['Дата', 'Вес', 'Шея', 'Грудь', 'Талия', 'Бедра', 'Калории', 'Вода'];
        const rows = [headers.join(',')];
        
        // Add current measurement
        const current = this.data.measurements.current;
        const nutrition = this.data.nutrition.daily;
        const water = this.data.water.daily;
        
        rows.push([
            new Date().toLocaleDateString('ru'),
            current.weight,
            current.neck,
            current.chest,
            current.waist,
            current.hips,
            nutrition.calories,
            water.current
        ].join(','));
        
        return rows.join('\n');
    }

    generateTextReport() {
        const report = `
HEALTHTRACKER 2025 - ОТЧЕТ

Дата: ${new Date().toLocaleDateString('ru')}

ПРОФИЛЬ:
Имя: ${this.data.profile.name}
Вес: ${this.data.measurements.current.weight} кг
ИМТ: ${(this.data.measurements.current.weight / Math.pow(this.data.profile.height / 100, 2)).toFixed(1)}

ИЗМЕРЕНИЯ:
Талия: ${this.data.measurements.current.waist} см
Грудь: ${this.data.measurements.current.chest} см

ПИТАНИЕ:
Калории: ${this.data.nutrition.daily.calories} / ${this.data.goals.calories}

ВОДА:
Потреблено: ${this.data.water.daily.current} / ${this.data.water.daily.goal} мл
        `;
        
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HealthTracker_Отчет_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Отчет сгенерирован');
    }

    // Charts Initialization
    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js не загружен');
            return;
        }

        console.log('📈 Initializing charts...');
        this.createWaterHourlyChart();
    }

    createWaterHourlyChart() {
        const ctx = document.getElementById('water-hourly-chart');
        if (!ctx) return;

        const hours = ['00', '06', '12', '18'];
        const intake = [0, 250, 750, 500];

        try {
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Потребление воды (мл)',
                        data: intake,
                        backgroundColor: '#1FB8CD',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            this.charts.set('water-hourly', chart);
        } catch (error) {
            console.error('Error creating water hourly chart:', error);
        }
    }

    // Notification System
    showNotification(message, type = 'success', duration = 4000) {
        console.log(`🔔 Notification: ${message} (${type})`);
        
        const container = document.getElementById('notifications');
        if (!container) {
            console.warn('⚠️ Notification container not found');
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting HealthTracker 2025...');
    
    try {
        // Create global app instance
        window.healthTracker = new HealthTracker2025();
        window.healthTracker.init();
    } catch (error) {
        console.error('❌ Failed to initialize HealthTracker 2025:', error);
    }
});

// Handle window resize for charts
window.addEventListener('resize', () => {
    if (window.healthTracker && window.healthTracker.charts) {
        window.healthTracker.charts.forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }
});

// Handle window beforeunload for data safety
window.addEventListener('beforeunload', () => {
    if (window.healthTracker) {
        window.healthTracker.saveData();
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (window.healthTracker) {
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
});

console.log('🎯 HealthTracker 2025 Desktop Application script loaded!');