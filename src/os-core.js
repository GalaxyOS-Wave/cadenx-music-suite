
import { AcademyApp } from './apps/academy.js';
import { ChordApp } from './apps/chord.js';
import { FormsApp } from './apps/forms.js';
import { AboutApp } from './apps/about.js';
import { CommunityApp } from './apps/community.js';
import { BluApp } from './apps/blu.js';
import { SupportApp } from './apps/support.js';
import { ProfileApp } from './apps/profile.js';
import { auth, signInWithGoogle, logout, db, handleFirestoreError, OperationType } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const APPS = [
    { id: 'academy', title: 'Academy', description: 'Master-level music production courses curated by industry legends.', icon: 'graduation-cap', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-2 md:row-span-2', module: AcademyApp },
    { id: 'chord', title: 'CHORD', description: 'The global directory of elite musical talent and professionals.', icon: 'user-circle', color: 'bg-white', accent: 'text-chord', span: 'md:col-span-1 md:row-span-1', module: ChordApp },
    { id: 'blu', title: 'Cadenx BLU', description: 'The future of AI-assisted production. Your creative co-pilot.', icon: 'sparkles', color: 'bg-white', accent: 'text-blu', span: 'md:col-span-1 md:row-span-2', module: BluApp },
    { id: 'support', title: 'Support', description: '24/7 technical assistance and ecosystem documentation.', icon: 'life-buoy', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-1 md:row-span-1', module: SupportApp },
    { id: 'forms', title: 'Forms', description: 'Official registration, listing, and feedback portals.', icon: 'clipboard-list', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-2 md:row-span-1', module: FormsApp },
    { id: 'community', title: 'Community', description: 'Join the collective worldwide.', icon: 'users', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-1 md:row-span-1', module: CommunityApp },
    { id: 'about', title: 'About', description: 'Our mission to redefine the creative economy.', icon: 'info', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-1 md:row-span-1', module: AboutApp },
    { id: 'profile', title: 'Dashboard', description: 'Your personalized producer profile and course progress.', icon: 'user', color: 'bg-white', accent: 'text-academy', span: 'md:col-span-1 md:row-span-1', module: ProfileApp },
];

class CadenxMusic {
    constructor() {
        this.currentAppId = null;
        this.theme = localStorage.getItem('cadenx-theme') || 'light';
        this.user = null;
        this.userData = null;
        this.isAuthReady = false;
        this.appMethods = {
            academy: AcademyApp,
            chord: ChordApp,
            forms: FormsApp,
            about: AboutApp,
            community: CommunityApp,
            blu: BluApp,
            support: SupportApp,
            profile: ProfileApp
        };
        
        // Bind methods to this instance for use in HTML onclick handlers
        window.os = this;
        
        this.bootSequence();
    }

    async bootSequence() {
        const bootScreen = document.getElementById('boot-screen');
        const landingPage = document.getElementById('landing-page');
        const howToUse = document.getElementById('how-to-use-container');
        const bootProgress = document.getElementById('boot-progress');
        const bootPercent = document.getElementById('boot-percent');
        const bootStatus = document.getElementById('boot-status');
        const bootLog = document.getElementById('boot-log');

        if (!bootScreen) {
            this.init();
            return;
        }

        bootScreen.classList.remove('hidden');
        landingPage.style.display = 'none';
        if (howToUse) howToUse.style.display = 'none';
        if (bootLog) bootLog.innerHTML = '';

        const logs = [
            "Initializing Cadenx Neural Core V2.4.0...",
            "Loading modular ecosystem assets...",
            "Establishing encrypted connection to nodes...",
            "Verifying producer credentials...",
            "Optimizing audio latency buffers...",
            "Syncing global talent directory...",
            "Booting AI co-pilot 'BLU'...",
            "System check: OPTIMAL",
            "Welcome to Cadenx Music."
        ];

        const statuses = [
            "Initializing Core...",
            "Loading Assets...",
            "Connecting Nodes...",
            "Verifying Auth...",
            "Optimizing Audio...",
            "Syncing Talents...",
            "Booting BLU...",
            "Finalizing...",
            "System Ready"
        ];

        for (let i = 0; i <= 100; i += Math.floor(Math.random() * 10) + 5) {
            const percent = Math.min(i, 100);
            bootProgress.style.width = `${percent}%`;
            bootPercent.innerText = `${percent}%`;
            
            const statusIdx = Math.floor(percent / 12);
            if (bootStatus) bootStatus.innerText = statuses[statusIdx] || statuses[statuses.length - 1];
            
            if (percent % 20 === 0 || percent === 100) {
                const logEntry = document.createElement('div');
                logEntry.innerText = `> ${logs[statusIdx] || logs[logs.length-1]}`;
                bootLog.appendChild(logEntry);
                bootLog.scrollTop = bootLog.scrollHeight;
            }
            
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        }

        setTimeout(() => {
            bootScreen.classList.add('animate-fade-out');
            setTimeout(() => {
                bootScreen.style.display = 'none';
                landingPage.style.display = 'flex';
                if (howToUse) howToUse.style.display = 'block';
                landingPage.classList.add('animate-fade-in');
                if (howToUse) howToUse.classList.add('animate-fade-in');
                this.init();
            }, 500);
        }, 800);
    }

    init() {
        this.applyTheme();
        this.setupAuth();
        this.renderAppGrid();
        this.renderDock();
        lucide.createIcons();
        setInterval(() => this.updateClock(), 1000);
        this.updateClock();
        
        this.setupEventListeners();
    }

    setupAuth() {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
            this.authUnsubscribe = null;
        }

        onAuthStateChanged(auth, async (user) => {
            this.user = user;
            this.isAuthReady = true;
            
            if (user) {
                // Ensure user document exists
                const { doc, getDoc, setDoc } = await import('firebase/firestore');
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        role: 'Producer',
                        purchasedBatches: [],
                        createdAt: new Date().toISOString()
                    });
                }

                // Listen to user data in Firestore
                this.authUnsubscribe = onSnapshot(userRef, (doc) => {
                    this.userData = doc.data();
                    this.updateHeader();
                    this.renderDock();
                    if (this.currentAppId) this.refreshApp();
                }, (error) => {
                    console.error('Firestore Snapshot Error:', error);
                    if (error.code === 'permission-denied') {
                        // Silent fail for permission denied on logout race condition
                        return;
                    }
                    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
                });
            } else {
                if (this.authUnsubscribe) {
                    this.authUnsubscribe();
                    this.authUnsubscribe = null;
                }
                this.userData = null;
                this.updateHeader();
                this.renderDock();
                if (this.currentAppId) this.refreshApp();

                // If we were in the OS, go back to login overlay
                const root = document.getElementById('os-root');
                const loginOverlay = document.getElementById('login-overlay');
                if (root && !root.classList.contains('hidden')) {
                    root.classList.add('animate-fade-out');
                    setTimeout(() => {
                        root.classList.add('hidden');
                        root.classList.remove('animate-fade-out');
                        if (loginOverlay) {
                            loginOverlay.classList.remove('hidden');
                            loginOverlay.classList.add('flex', 'animate-fade-in');
                        }
                    }, 500);
                }
            }
        });
    }

    updateHeader() {
        const avatarPlaceholder = document.getElementById('user-avatar-placeholder');
        const avatarImg = document.getElementById('user-avatar-img');
        const displayName = document.getElementById('user-display-name');
        const statusText = document.getElementById('user-status-text');

        if (this.user) {
            if (avatarPlaceholder) avatarPlaceholder.classList.add('hidden');
            if (avatarImg) {
                avatarImg.src = this.user.photoURL;
                avatarImg.classList.remove('hidden');
            }
            if (displayName) displayName.innerText = this.user.displayName;
            if (statusText) statusText.innerText = `${this.userData?.role || 'Producer'} Mode // Online`;
            if (statusText) statusText.classList.add('text-[var(--text-muted)]');
        } else {
            if (avatarPlaceholder) avatarPlaceholder.classList.remove('hidden');
            if (avatarImg) avatarImg.classList.add('hidden');
            if (displayName) displayName.innerText = 'ELITE EBOOKS';
            if (statusText) statusText.innerText = 'Producer Mode // Offline';
        }
    }

    async handleLogin() {
        try {
            const user = await signInWithGoogle();
            this.user = user; // Update immediately to avoid race condition
            this.showNotification('Successfully signed in!', 'success');
            
            // If we are on the login overlay, transition to OS
            const loginOverlay = document.getElementById('login-overlay');
            if (loginOverlay && !loginOverlay.classList.contains('hidden')) {
                loginOverlay.classList.add('animate-fade-out');
                setTimeout(() => {
                    loginOverlay.classList.add('hidden');
                    loginOverlay.classList.remove('flex', 'animate-fade-out');
                    this.enterMusic(); // Re-run enterMusic now that we are logged in
                }, 500);
            }
        } catch (error) {
            console.error('Login Error:', error);
            let message = 'Failed to sign in. Please try again.';
            if (error.code === 'auth/unauthorized-domain') {
                message = 'This domain is not authorized for Google Sign-In. Please add it in the Firebase Console.';
            } else if (error.code === 'auth/popup-blocked') {
                message = 'Sign-in popup was blocked. Please allow popups for this site.';
            }
            this.showNotification(message, 'error');
        }
    }

    async handleLogout() {
        try {
            await logout();
            this.showNotification('Successfully signed out.', 'success');
        } catch (error) {
            this.showNotification('Failed to sign out.', 'error');
        }
    }

    setupEventListeners() {
        // Mouse move effect for cards
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.app-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
                const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });

        // Keyboard listener for landing page
        document.addEventListener('keydown', (e) => {
            const landing = document.getElementById('landing-page');
            if (landing && landing.style.display !== 'none') {
                this.enterMusic();
            }
        });

        // Expose global functions for HTML handlers
        window.enterMusic = () => this.enterMusic();
        window.showGuide = () => this.showGuide();
        window.openApp = (id) => this.openApp(id);
        window.closeApp = () => this.closeApp();
        window.closeQuiz = () => this.appMethods.academy.closeQuiz(this);
    }

    updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const clock = document.getElementById('os-clock');
        if (clock) clock.innerText = time;
    }

    enterMusic() {
        const landing = document.getElementById('landing-page');
        const howToUse = document.getElementById('how-to-use-container');
        const root = document.getElementById('os-root');
        const dock = document.getElementById('os-dock');
        const loginOverlay = document.getElementById('login-overlay');

        if (!landing) return;

        // If not logged in, show login overlay instead of desktop
        if (!this.user) {
            landing.classList.add('animate-fade-out');
            if (howToUse) howToUse.classList.add('animate-fade-out');
            
            setTimeout(() => {
                landing.style.display = 'none';
                if (howToUse) howToUse.style.display = 'none';
                loginOverlay.classList.remove('hidden');
                loginOverlay.classList.add('flex', 'animate-fade-in');
                lucide.createIcons();
            }, 500);
            return;
        }

        landing.classList.add('animate-fade-out');
        if (howToUse) howToUse.classList.add('animate-fade-out');

        setTimeout(() => {
            landing.style.display = 'none';
            if (howToUse) howToUse.style.display = 'none';
            root.classList.remove('hidden');
            root.classList.add('animate-fade-in');
            dock.classList.add('visible');
            lucide.createIcons();
        }, 500);
    }

    showGuide() {
        const portal = document.getElementById('quiz-portal');
        const content = document.getElementById('quiz-content');
        
        portal.classList.remove('hidden');
        portal.classList.add('flex');
        
        content.innerHTML = `
            <div class="space-y-12 animate-modal-in">
                <div class="flex justify-between items-start">
                    <div class="space-y-4">
                        <h2 class="display text-4xl md:text-6xl font-black tracking-tighter text-[var(--text)]">System <span class="text-academy">Guide</span></h2>
                        <p class="text-[var(--text-muted)] text-lg">Master the Cadenx Music interface.</p>
                    </div>
                    <button onclick="os.hidePortal()" class="w-12 h-12 rounded-2xl bg-academy border border-academy flex items-center justify-center text-white hover:opacity-90 transition-all shadow-lg hover:scale-105 active:scale-95">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="space-y-8">
                        <div class="space-y-4">
                            <h4 class="display text-xl font-bold flex items-center text-[var(--text)]">
                                <i data-lucide="mouse-pointer-2" class="w-5 h-5 mr-3 text-academy"></i>
                                Navigation
                            </h4>
                            <p class="text-[var(--text-muted)] font-light leading-relaxed">Use the dynamic Dock at the bottom of the screen to switch between applications instantly. Click the Home icon to return to the main grid.</p>
                        </div>
                        <div class="space-y-4">
                            <h4 class="display text-xl font-bold flex items-center text-[var(--text)]">
                                <i data-lucide="layout-grid" class="w-5 h-5 mr-3 text-emerald-500"></i>
                                App Grid
                            </h4>
                            <p class="text-[var(--text-muted)] font-light leading-relaxed">The main dashboard features high-fidelity app cards. Hover over them to see the neural mesh reaction and click to initialize the module.</p>
                        </div>
                    </div>
                    <div class="space-y-8">
                        <div class="space-y-4">
                            <h4 class="display text-xl font-bold flex items-center text-[var(--text)]">
                                <i data-lucide="sparkles" class="w-5 h-5 mr-3 text-blu"></i>
                                Creative Co-Pilot
                            </h4>
                            <p class="text-[var(--text-muted)] font-light leading-relaxed">Access BLU for AI-assisted production insights, or use the Academy to master new skills with interactive assessments.</p>
                        </div>
                        <div class="space-y-4">
                            <h4 class="display text-xl font-bold flex items-center text-[var(--text)]">
                                <i data-lucide="life-buoy" class="w-5 h-5 mr-3 text-rose-500"></i>
                                Support System
                            </h4>
                            <p class="text-[var(--text-muted)] font-light leading-relaxed">If you encounter any issues, the Support portal provides 24/7 access to live chat and technical documentation.</p>
                        </div>
                    </div>
                </div>

                <div class="pt-8 border-t border-accent-soft">
                    <button onclick="os.hidePortal()" class="w-full py-6 bg-academy text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-xl hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all">Got it, let's go</button>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    renderDock() {
        const dock = document.getElementById('os-dock');
        const authButton = this.user 
            ? `<div onclick="os.handleLogout()" class="dock-item" id="dock-logout">
                <img src="${this.user.photoURL}" class="w-6 h-6 rounded-full border border-sky-200" />
                <span class="dock-tooltip">Sign Out</span>
               </div>`
            : `<div onclick="os.handleLogin()" class="dock-item" id="dock-login">
                <i data-lucide="log-in" class="w-5 h-5"></i>
                <span class="dock-tooltip">Sign In</span>
               </div>`;

        dock.innerHTML = `
            <div onclick="closeApp()" class="dock-item active" id="dock-home">
                <i data-lucide="home" class="w-5 h-5"></i>
                <span class="dock-tooltip">Home</span>
            </div>
            <div class="w-px h-6 bg-accent-soft mx-1"></div>
            ${APPS.map(app => `
                <div onclick="openApp('${app.id}')" class="dock-item" id="dock-${app.id}">
                    <i data-lucide="${app.icon}" class="w-5 h-5"></i>
                    <span class="dock-tooltip">${app.title}</span>
                </div>
            `).join('')}
            <div class="w-px h-6 bg-accent-soft mx-1"></div>
            ${authButton}
        `;
        lucide.createIcons();
    }

    updateDockActive(appId) {
        const items = document.querySelectorAll('.dock-item');
        items.forEach(item => item.classList.remove('active'));
        
        if (!appId) {
            document.getElementById('dock-home').classList.add('active');
        } else {
            const activeItem = document.getElementById(`dock-${appId}`);
            if (activeItem) activeItem.classList.add('active');
        }
    }

    renderAppGrid() {
        const grid = document.getElementById('app-grid');
        grid.innerHTML = APPS.map((app, idx) => `
            <div onclick="window.os.openApp('${app.id}')" 
                 class="app-card ${app.color} ${app.span || ''} border border-accent-soft rounded-[24px] md:rounded-[40px] p-5 md:p-10 flex flex-col justify-between cursor-pointer group min-h-[180px] md:min-h-[300px] relative overflow-hidden shadow-lg animate-fade-in"
                 style="animation-delay: ${0.1 + (idx * 0.05)}s">
                
                <div class="absolute top-0 right-0 p-4 md:p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <i data-lucide="${app.icon}" class="w-24 h-24 md:w-48 md:h-48"></i>
                </div>

                <div class="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-academy flex items-center justify-center text-white shadow-xl relative z-10 group-hover:animate-float border border-white/20">
                    <i data-lucide="${app.icon}" class="w-4 h-4 md:w-7 md:h-7"></i>
                </div>

                <div class="space-y-1 md:space-y-3 relative z-10 mt-4 md:mt-8">
                    <h3 class="display text-base md:text-3xl font-bold tracking-tight text-[var(--text)]">${app.title}</h3>
                    <p class="text-[var(--text-muted)] text-[8px] md:text-sm font-light leading-relaxed max-w-[240px]">${app.description}</p>
                </div>

                <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-soft to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    openApp(appId) {
        this.currentAppId = appId;
        
        const grid = document.getElementById('app-grid');
        const header = document.getElementById('os-header');
        const view = document.getElementById('view-container');
        
        grid.classList.add('hidden');
        header.classList.add('hidden');
        view.classList.remove('view-hidden');
        view.classList.add('animate-scale-in');
        
        this.updateDockActive(appId);
        this.refreshApp();
        window.scrollTo(0, 0);
    }

    closeApp() {
        this.currentAppId = null;
        this.hidePortal();

        const grid = document.getElementById('app-grid');
        const header = document.getElementById('os-header');
        const view = document.getElementById('view-container');
        
        grid.classList.remove('hidden');
        header.classList.remove('hidden');
        view.classList.add('view-hidden');
        view.classList.remove('animate-scale-in');
        grid.classList.add('animate-fade-in');
        
        this.updateDockActive(null);
        this.renderAppGrid();
        window.scrollTo(0, 0);
    }

    refreshApp() {
        if (!this.currentAppId) return;
        
        const container = document.getElementById('view-container');
        const app = APPS.find(a => a.id === this.currentAppId);
        const appModule = this.appMethods[this.currentAppId];
        
        const content = appModule.render(this);

        container.innerHTML = `
            <div class="animate-scale-in">
                <div class="mb-16 flex items-center justify-between">
                    <button onclick="os.handleBack()" class="group flex items-center space-x-4 text-academy hover:opacity-80 transition-all">
                        <div class="w-12 h-12 rounded-2xl bg-academy border border-academy flex items-center justify-center text-white group-hover:opacity-90 transition-colors shadow-lg group-hover:scale-105 active:scale-95">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold uppercase tracking-[0.3em] mono">${this.getBackLabel()}</span>
                    </button>
                    
                    <div class="flex items-center space-x-6">
                        <div class="w-12 h-12 rounded-2xl bg-white border border-accent-soft flex items-center justify-center ${app.accent} shadow-sm">
                            <i data-lucide="${app.icon}" class="w-5 h-5"></i>
                        </div>
                    </div>
                </div>

                <div class="min-h-[60vh]">
                    ${content}
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    getBackLabel() {
        if (this.currentAppId === 'academy' && this.appMethods.academy.state.selectedBatch) return 'Back to Academy';
        if (this.currentAppId === 'chord' && this.appMethods.chord.state.selectedProfile) return 'Back to Directory';
        return 'Return to Music';
    }

    handleBack() {
        if (this.currentAppId === 'academy' && this.appMethods.academy.state.selectedBatch) {
            this.appMethods.academy.state.selectedBatch = null;
            this.appMethods.academy.state.activeVideo = null;
            this.refreshApp();
        } else if (this.currentAppId === 'chord' && this.appMethods.chord.state.selectedProfile) {
            this.appMethods.chord.state.selectedProfile = null;
            this.refreshApp();
        } else {
            this.closeApp();
        }
    }

    showPortal(contentHtml) {
        const portal = document.getElementById('quiz-portal');
        const content = document.getElementById('quiz-content');
        portal.classList.remove('hidden');
        portal.classList.add('flex');
        content.innerHTML = contentHtml;
        lucide.createIcons();
    }

    hidePortal() {
        const portal = document.getElementById('quiz-portal');
        if (portal) {
            portal.classList.add('hidden');
            portal.classList.remove('flex');
        }
    }

    applyTheme() {
        const html = document.documentElement;
        html.classList.remove('dark');
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    showNotification(message, type = 'success') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `
            p-5 rounded-2xl border glass shadow-2xl animate-scale-in pointer-events-auto
            flex items-center space-x-4 min-w-[300px]
            ${type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50 text-rose-700 dark:text-rose-400'}
        `;
        
        const icon = type === 'success' ? 'check-circle' : 'alert-circle';
        
        notification.innerHTML = `
            <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <i data-lucide="${icon}" class="w-5 h-5"></i>
            </div>
            <div class="flex-1">
                <p class="text-[9px] mono uppercase tracking-widest opacity-60">${type}</p>
                <p class="text-sm font-bold tracking-tight">${message}</p>
            </div>
        `;

        container.appendChild(notification);
        lucide.createIcons();

        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// Initialize Music when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CadenxMusic();
});

