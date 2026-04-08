
import { db, handleFirestoreError, OperationType } from '../firebase.js';
fetch("sendemail.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  });
export const ACADEMY_DATA = [
    {
        id: 'b1',
        title: 'Sur Sadhana - Batch for beginners',
        description: 'The best basic production course for beginners',
        level: 'Beginner',
        duration: '0:00',
        price: '₹0',
        purchaseUrl: 'https://forms.google.com/purchase-batch-1',
        videos: [
            { 
                id: 'v1', 
                title: 'Welcome to the batch!', 
                duration: '0:00', 
                thumbnail: '/graphics/sursadhana.png', 
                url: '/graphics/sursadhana.png',
                quizUrl: 'https://forms.google.com/your-quiz-link-1',
                notes: '/notes/welcome1.txt'
            },
        ]
    },
];

export const AcademyApp = {
    state: {
        selectedBatch: null,
        activeVideo: null,
        quizState: { active: false, index: 0, score: 0, finished: false },
        showPurchaseScreen: null,
        showEnrollmentForm: null
    },

    render(os) {
        if (!os.user) {
            return `
                <div class="max-w-2xl mx-auto text-center space-y-8 py-20">
                    <div class="w-24 h-24 bg-accent-soft rounded-full flex items-center justify-center mx-auto text-academy shadow-xl border border-accent-soft">
                        <i data-lucide="lock" class="w-10 h-10"></i>
                    </div>
                    <div class="space-y-4">
                        <h2 class="display text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Authentication Required</h2>
                        <p class="text-[var(--text-muted)] text-lg">Please sign in with Google to access the Academy curriculum and track your progress.</p>
                    </div>
                    <button onclick="os.handleLogin()" class="px-12 py-5 bg-academy text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-xs shadow-2xl hover:opacity-90 transition-all">Sign In with Google</button>
                </div>
            `;
        }

        if (this.state.showEnrollmentForm) {
            return this.renderEnrollmentForm(this.state.showEnrollmentForm, os);
        }
        if (this.state.showPurchaseScreen) {
            return this.renderPurchaseScreen(this.state.showPurchaseScreen, os);
        }
        if (!this.state.selectedBatch) {
            return this.renderBatchList(os);
        }
        return this.renderCourseView(os);
    },

    renderEnrollmentForm(batch, os) {
        return `
            <div class="max-w-2xl mx-auto space-y-12 animate-scale-in">
                <button onclick="window.os.appMethods.academy.closeEnrollmentForm()" class="flex items-center space-x-2 text-[var(--text-muted)] hover:text-academy transition-colors group">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    <span class="text-[10px] mono uppercase tracking-widest">Back to Batch Details</span>
                </button>

                <div class="space-y-4">
                    <h2 class="display text-4xl md:text-6xl font-black tracking-tighter text-[var(--text)]">Batch <span class="text-academy">Enrollment</span></h2>
                    <p class="text-[var(--text-muted)] text-lg">Complete your registration for <span class="text-academy font-bold">${batch.title}</span>.</p>
                </div>

                <form onsubmit="event.preventDefault(); window.os.appMethods.academy.submitEnrollment('${batch.id}')" class="space-y-8 bg-white border border-accent-soft p-8 md:p-12 rounded-[40px] glass shadow-2xl">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Full Name</label>
                            <input id="enroll-name" type="text" required value="${os.user.displayName}" class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all" placeholder="Enter your name">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Email Address</label>
                            <input id="enroll-email" type="email" required value="${os.user.email}" readonly class="w-full bg-accent-soft/50 border border-accent-soft rounded-2xl p-4 text-sm text-[var(--text-muted)] cursor-not-allowed outline-none" placeholder="Enter your email">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Phone Number</label>
                            <input id="enroll-phone" type="tel" required class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all" placeholder="+91 00000 00000">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Experience Level</label>
                            <select id="enroll-experience" class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all appearance-none">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Professional</option>
                            </select>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Country</label>
                            <input id="enroll-country" type="text" required class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all" placeholder="Enter your country">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">City</label>
                            <input id="enroll-city" type="text" required class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all" placeholder="Enter your city">
                        </div>
                        <div class="space-y-3">
                            <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Social Handle</label>
                            <input id="enroll-social" type="text" required class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all" placeholder="@username">
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] mono uppercase tracking-widest text-[var(--text-muted)] font-bold">Why do you want to join this batch?</label>
                        <textarea id="enroll-message" class="w-full bg-accent-soft border border-accent-soft rounded-2xl p-4 text-sm focus:border-academy outline-none transition-all min-h-[120px]" placeholder="Tell us about your goals..."></textarea>
                    </div>

                    <div class="pt-6">
                        <button type="submit" class="w-full py-6 bg-academy text-white rounded-3xl font-bold uppercase tracking-[0.4em] text-xs hover:opacity-90 transition-all shadow-xl hover:shadow-academy/20 hover:scale-[1.02] active:scale-95">
                            Confirm Enrollment • ${batch.price}
                        </button>
                        <p class="text-center text-[9px] text-[var(--text-muted)] mt-6 uppercase tracking-widest">By enrolling, you agree to our terms of service and curriculum guidelines.</p>
                    </div>
                </form>
            </div>
        `;
    },

    renderBatchList(os) {
        const purchasedBatches = os.userData?.purchasedBatches || [];
        return `
            <div class="space-y-8 md:space-y-12">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
                    <div class="space-y-3 md:space-y-4">
                        <h2 class="display text-3xl md:text-5xl font-black tracking-tighter leading-tight text-[var(--text)]">Academy <br class="md:hidden"/><span class="text-academy">Portal</span></h2>
                        <p class="text-[var(--text-muted)] text-sm md:text-lg font-light max-w-md">Master the art of sound with our elite curriculum.</p>
                    </div>
                    <div class="flex items-center space-x-4 bg-accent-soft border border-accent-soft p-3 md:p-4 rounded-2xl glass w-full md:w-auto">
                        <div class="w-10 h-10 rounded-xl bg-academy text-white flex items-center justify-center shadow-lg">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="text-[8px] mono text-[var(--text-muted)] uppercase tracking-widest">Curriculum</p>
                            <p class="text-xs md:text-sm font-bold text-[var(--text)]">${ACADEMY_DATA.length} Modules Available</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    ${ACADEMY_DATA.map((batch, idx) => {
                        const isPurchased = purchasedBatches.includes(batch.id);
                        return `
                        <div onclick="window.os.appMethods.academy.handleBatchClick('${batch.id}')" 
                             class="batch-card group bg-white border border-accent-soft rounded-[32px] p-6 space-y-5 cursor-pointer animate-fade-in shadow-sm hover:shadow-xl hover:border-academy hover:bg-accent-soft transition-all"
                             style="animation-delay: ${idx * 0.1}s">
                            <div class="aspect-video bg-white rounded-[20px] overflow-hidden relative shadow-lg">
                                <img src="https://picsum.photos/seed/${batch.id}/600/400" alt="Batch" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700">
                                <div class="absolute inset-0 bg-gradient-to-t from-academy/40 to-transparent opacity-60"></div>
                                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div class="w-12 h-12 bg-academy text-white rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                                        <i data-lucide="${isPurchased ? 'play' : 'lock'}" class="w-5 h-5 ${isPurchased ? 'fill-current' : ''}"></i>
                                    </div>
                                </div>
                                <div class="absolute top-3 left-3">
                                    <span class="text-[8px] mono bg-white/90 backdrop-blur-md text-academy px-3 py-1.5 rounded-lg uppercase tracking-widest border border-academy/20 font-bold">${batch.level}</span>
                                </div>
                                ${!isPurchased ? `
                                <div class="absolute top-3 right-3">
                                    <span class="text-[8px] mono bg-academy text-white px-3 py-1.5 rounded-lg uppercase tracking-widest font-bold shadow-lg">${batch.price}</span>
                                </div>
                                ` : ''}
                            </div>
                            <div class="space-y-2">
                                <h3 class="display text-xl font-bold tracking-tight text-[var(--text)] group-hover:text-academy transition-colors">${batch.title}</h3>
                                <p class="text-[var(--text-muted)] text-[12px] font-light leading-relaxed line-clamp-2">${batch.description}</p>
                            </div>
                            <div class="pt-4 border-t border-white/40 flex items-center justify-between">
                                <div class="flex items-center space-x-2 text-[9px] mono text-academy uppercase tracking-widest font-bold">
                                    <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                                    <span>${batch.duration}</span>
                                </div>
                                <div class="flex items-center space-x-2 text-[9px] mono text-academy uppercase tracking-widest font-bold">
                                    <span class="px-2 py-1 bg-white rounded-md border border-academy/10">${isPurchased ? 'Unlocked' : 'Locked'}</span>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    },

    renderPurchaseScreen(batch, os) {
        return `
            <div class="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-scale-in px-2">
                <button onclick="window.os.appMethods.academy.closePurchaseScreen()" class="flex items-center space-x-2 text-[var(--text-muted)] hover:text-sky-500 transition-colors group">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
                    <span class="text-[9px] md:text-[10px] mono uppercase tracking-widest">Back to Curriculum</span>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div class="space-y-6 md:space-y-8 order-2 md:order-1">
                        <div class="space-y-3 md:space-y-4">
                            <h2 class="display text-3xl md:text-6xl font-black tracking-tighter text-[var(--text)] leading-[0.9]">Unlock <br><span class="text-academy">${batch.title}</span></h2>
                            <p class="text-[var(--text-muted)] text-base md:text-lg font-light leading-relaxed">Join the elite circle. This premium batch offers full access to the curriculum, project files, and direct feedback.</p>
                        </div>
                        
                        <div class="space-y-4 md:space-y-6">
                            <div class="flex items-center space-x-4 p-4 bg-accent-soft rounded-2xl border border-accent-soft glass">
                                <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-academy shadow-sm">
                                    <i data-lucide="check-circle" class="w-5 h-5 md:w-6 md:h-6"></i>
                                </div>
                                <div>
                                    <p class="text-xs md:text-sm font-bold text-[var(--text)]">Lifetime Access</p>
                                    <p class="text-[8px] md:text-[10px] mono text-[var(--text-muted)] uppercase tracking-widest">No recurring fees</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 p-4 bg-accent-soft rounded-2xl border border-accent-soft glass">
                                <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-academy shadow-sm">
                                    <i data-lucide="download" class="w-5 h-5 md:w-6 md:h-6"></i>
                                </div>
                                <div>
                                    <p class="text-xs md:text-sm font-bold text-[var(--text)]">Project Resources</p>
                                    <p class="text-[8px] md:text-[10px] mono text-[var(--text-muted)] uppercase tracking-widest">Stems & MIDI included</p>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 md:pt-6">
                            <button onclick="window.os.appMethods.academy.openEnrollmentForm()" class="w-full py-5 md:py-6 bg-academy text-white rounded-2xl md:rounded-3xl font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs hover:opacity-90 transition-all shadow-xl hover:shadow-academy/20 hover:scale-[1.02] active:scale-95">
                                Enroll Now • ${batch.price}
                            </button>
                        </div>
                    </div>

                    <div class="relative order-1 md:order-2">
                        <div class="aspect-square bg-accent-soft rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl border border-accent-soft relative group">
                            <img src="https://picsum.photos/seed/${batch.id}/800/800" class="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000">
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-20 h-20 md:w-24 md:h-24 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white dark:border-slate-700">
                                    <i data-lucide="lock" class="w-8 h-8 md:w-10 md:h-10 text-academy"></i>
                                </div>
                            </div>
                            <div class="absolute bottom-6 left-6 right-6">
                                <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-lg">
                                    <p class="text-[8px] mono text-academy uppercase tracking-widest font-bold mb-1">Curriculum Preview</p>
                                    <p class="text-[10px] font-bold text-[var(--text)]">${batch.videos.length} Modules • ${batch.duration}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCourseView() {
    const currentIdx = this.state.selectedBatch.videos.indexOf(this.state.activeVideo);
    const progress = Math.round(((currentIdx + 1) / this.state.selectedBatch.videos.length) * 100);

    return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <!-- Video Player Area -->
            <div class="lg:col-span-8 space-y-6 md:space-y-10">
                <div class="space-y-3 md:space-y-4">
                    <div class="flex items-center justify-between text-[8px] md:text-[10px] mono text-[var(--text-muted)] uppercase tracking-[0.3em]">
                        <span>Course Progress</span>
                        <span>${progress}% Complete</span>
                    </div>
                    <div class="progress-bar bg-accent-soft">
                        <div class="progress-fill bg-academy" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="aspect-video bg-slate-900 rounded-[24px] md:rounded-[48px] overflow-hidden border border-accent-soft shadow-2xl relative group">
                    <video src="${this.state.activeVideo.url}" class="w-full h-full" controls autoplay></video>
                </div>
                
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 p-2">
                    <div class="space-y-2 md:space-y-3">
                        <h2 class="display text-2xl md:text-4xl font-bold tracking-tight text-[var(--text)] leading-tight">${this.state.activeVideo.title}</h2>
                        <div class="flex items-center space-x-4">
                            <span class="text-[8px] md:text-[10px] mono bg-accent-soft text-academy px-3 py-1 rounded-full border border-accent-soft uppercase tracking-widest">Module ${currentIdx + 1}</span>
                            <span class="text-[8px] md:text-[10px] mono text-[var(--text-muted)] uppercase tracking-widest">${this.state.activeVideo.duration}</span>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3 md:space-x-4 w-full md:w-auto">
                        <button onclick="window.os.appMethods.academy.downloadNotes()" class="flex-1 md:flex-none flex items-center justify-center space-x-2 md:space-x-3 bg-white border border-accent-soft px-4 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-academy hover:bg-accent-soft transition-all glass">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span class="hidden sm:inline">Resources</span>
                            <span class="sm:hidden">Files</span>
                        </button>
                        <button onclick="window.open('${this.state.activeVideo.quizUrl}', '_blank')" class="flex-1 md:flex-none flex items-center justify-center space-x-2 md:space-x-3 bg-academy text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all shadow-xl">
                            <i data-lucide="help-circle" class="w-4 h-4"></i>
                            <span>Quiz</span>
                        </button>
                    </div>
                </div>

                <!-- ✅ FIXED: Notes card (NO dark mode) -->
                <div class="bg-white border border-accent-soft rounded-[32px] md:rounded-[48px] p-6 md:p-12 glass shadow-lg">
                    <h4 class="display text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center text-[var(--text)]">
                        <i data-lucide="file-text" class="w-5 h-5 mr-3 text-academy"></i>
                        Module Overview
                    </h4>
                    <div class="text-[var(--text-muted)] font-light leading-relaxed text-sm md:text-lg whitespace-pre-wrap">
                        ${this.state.activeVideo.fetchedNotes || 'Loading module overview...'}
                    </div>
                </div>
            </div>

            <!-- Curriculum Sidebar -->
            <div class="lg:col-span-4 space-y-6 md:space-y-8">
                <div class="bg-white border border-accent-soft rounded-3xl md:rounded-[40px] p-5 md:p-8 glass shadow-lg">
                    <h4 class="display text-base md:text-xl font-bold mb-4 md:mb-8 px-2 text-[var(--text)]">Curriculum</h4>
                    <div class="space-y-2 md:space-y-3 max-h-[300px] md:max-h-none overflow-y-auto custom-scrollbar">
                        ${this.state.selectedBatch.videos.map((v, idx) => `
                            <div onclick="window.os.appMethods.academy.playVideo('${v.id}')" class="flex items-center space-x-3 md:space-x-5 p-3 md:p-5 rounded-2xl md:rounded-[28px] border ${v.id === this.state.activeVideo.id ? 'bg-academy text-white shadow-xl border-academy' : 'bg-accent-soft border-accent-soft hover:bg-academy/5'} cursor-pointer transition-all group">
                                <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl ${v.id === this.state.activeVideo.id ? 'bg-white text-academy' : 'bg-accent-soft text-academy/60'} flex items-center justify-center text-[9px] md:text-xs font-bold transition-all">
                                    ${idx + 1}
                                </div>
                                <div class="flex-1">
                                    <p class="text-[10px] md:text-sm font-bold ${v.id === this.state.activeVideo.id ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-academy'}">${v.title}</p>
                                    <p class="text-[7px] md:text-[9px] mono ${v.id === this.state.activeVideo.id ? 'text-sky-100' : 'text-[var(--text-muted)]'} uppercase mt-0.5">${v.duration}</p>
                                </div>
                                ${v.id === this.state.activeVideo.id ? '<div class="w-1 h-1 bg-white rounded-full animate-pulse"></div>' : '<i data-lucide="play" class="w-3 h-3 text-academy/40 group-hover:text-academy"></i>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- ✅ FIXED: Instructor card (NO dark mode) -->
                <div class="bg-white border border-accent-soft rounded-3xl md:rounded-[40px] p-5 md:p-8 glass shadow-lg space-y-4 md:space-y-6">
                    <h5 class="display text-[10px] md:text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">Instructor</h5>
                    <div class="flex items-center space-x-3 md:space-x-4">
                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent-soft overflow-hidden border border-accent-soft">
                            <img src="https://picsum.photos/seed/instructor/100/100" alt="Instructor" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <p class="text-xs md:text-sm font-bold text-[var(--text)]">Alex Rivers</p>
                            <p class="text-[7px] md:text-[9px] mono text-[var(--text-muted)] uppercase tracking-widest">Master Producer</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
},
    renderQuiz() {
        if (this.state.quizState.finished) {
            const percentage = Math.round((this.state.quizState.score / this.state.activeVideo.quiz.length) * 100);
            return `
                <div class="flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 py-10 md:py-20 animate-fade-in">
                    <div class="relative">
                        <div class="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[40px] flex items-center justify-center border border-accent-soft shadow-2xl animate-float">
                            <i data-lucide="trophy" class="w-16 h-16 md:w-24 md:h-24 text-academy"></i>
                        </div>
                        <div class="absolute -top-4 -right-4 w-12 h-12 md:w-16 md:h-16 bg-academy text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-xl">
                            ${percentage}%
                        </div>
                    </div>
                    <div class="space-y-4">
                        <h3 class="display text-4xl md:text-6xl font-black tracking-tighter leading-none text-[var(--text)]">Assessment Complete</h3>
                        <p class="text-[var(--text-muted)] text-lg md:text-xl font-light">You correctly identified ${this.state.quizState.score} out of ${this.state.activeVideo.quiz.length} key concepts.</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-lg pt-4">
                        <button onclick="window.os.appMethods.academy.closeQuiz()" class="flex-1 px-8 md:px-12 py-5 md:py-6 bg-academy text-white rounded-[20px] md:rounded-[24px] text-[10px] md:text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl">Return to Course</button>
                        <button onclick="window.os.appMethods.academy.resetQuiz()" class="flex-1 px-8 md:px-12 py-5 md:py-6 bg-white border border-accent-soft text-academy rounded-[20px] md:rounded-[24px] text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-accent-soft transition-all">Try Again</button>
                    </div>
                </div>
            `;
        }

        const question = this.state.activeVideo.quiz[this.state.quizState.index];
        const progress = ((this.state.quizState.index + 1) / this.state.activeVideo.quiz.length) * 100;

        return `
            <div class="space-y-8 md:space-y-16 animate-fade-in">
                <!-- Quiz Header -->
                <div class="flex justify-between items-start gap-4">
                    <div class="space-y-6 md:space-y-8 flex-1">
                        <div class="space-y-3 md:space-y-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-8 md:w-12 h-1 bg-academy"></div>
                                <p class="text-[10px] md:text-xs mono text-academy uppercase tracking-[0.5em] font-bold">Module Assessment // ${this.state.quizState.index + 1} of ${this.state.activeVideo.quiz.length}</p>
                            </div>
                            <div class="w-full max-w-xs h-1 bg-accent-soft rounded-full overflow-hidden">
                                <div class="h-full bg-academy transition-all duration-500" style="width: ${progress}%"></div>
                            </div>
                        </div>
                        <h3 class="display text-2xl md:text-6xl font-black leading-[1.1] tracking-tight max-w-3xl text-[var(--text)]">${question.q}</h3>
                    </div>
                    <button onclick="window.os.appMethods.academy.closeQuiz()" class="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-accent-soft border border-accent-soft flex items-center justify-center text-academy/60 hover:text-academy hover:bg-accent-soft transition-all group glass">
                        <i data-lucide="x" class="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300"></i>
                    </button>
                </div>

                <!-- Options Grid -->
                <div class="grid grid-cols-1 gap-4 md:gap-5">
                    ${question.o.map((opt, idx) => `
                        <button onclick="window.os.appMethods.academy.answerQuiz(${idx})" class="quiz-option w-full p-6 md:p-10 bg-white border border-accent-soft rounded-[24px] md:rounded-[32px] text-left hover:border-academy/50 hover:bg-accent-soft transition-all group flex justify-between items-center glass">
                            <div class="flex items-center space-x-4 md:space-x-8">
                                <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent-soft border border-accent-soft flex items-center justify-center text-academy group-hover:bg-academy group-hover:text-white group-hover:border-academy transition-all font-bold mono text-sm md:text-base">
                                    ${String.fromCharCode(65 + idx)}
                                </div>
                                <span class="font-bold text-[var(--text-muted)] group-hover:text-[var(--text)] text-lg md:text-2xl tracking-tight">${opt}</span>
                            </div>
                            <div class="w-10 h-10 md:w-12 md:h-12 rounded-full border border-accent-soft flex items-center justify-center group-hover:border-academy group-hover:bg-academy/10 transition-all">
                                <i data-lucide="arrow-right" class="w-4 h-4 md:w-5 md:h-5 text-academy/20 group-hover:text-academy"></i>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Methods
    handleBatchClick(batchId, os = window.os) {
        const batch = ACADEMY_DATA.find(b => b.id === batchId);
        const purchasedBatches = os.userData?.purchasedBatches || [];
        
        if (purchasedBatches.includes(batchId)) {
            this.selectBatch(batchId, os);
        } else {
            this.state.showPurchaseScreen = batch;
            os.refreshApp();
        }
    },

    redirectToPurchase(url) {
        window.open(url, '_blank');
    },

    selectBatch(batchId, os = window.os) {
        this.state.selectedBatch = ACADEMY_DATA.find(b => b.id === batchId);
        this.state.showPurchaseScreen = null;
        this.playVideo(this.state.selectedBatch.videos[0].id, os);
    },

    closePurchaseScreen(os = window.os) {
        this.state.showPurchaseScreen = null;
        os.refreshApp();
    },

    openEnrollmentForm(os = window.os) {
        this.state.showEnrollmentForm = this.state.showPurchaseScreen;
        this.state.showPurchaseScreen = null;
        os.refreshApp();
    },

    closeEnrollmentForm(os = window.os) {
        this.state.showPurchaseScreen = this.state.showEnrollmentForm;
        this.state.showEnrollmentForm = null;
        os.refreshApp();
    },

    async submitEnrollment(batchId, os = window.os) {
        try {
            const { doc, updateDoc, addDoc, collection, arrayUnion, serverTimestamp } = await import('firebase/firestore');
            
            // Collect form data
            const enrollmentData = {
                uid: os.user.uid,
                name: document.getElementById('enroll-name').value,
                email: document.getElementById('enroll-email').value,
                phone: document.getElementById('enroll-phone').value,
                experience: document.getElementById('enroll-experience').value,
                country: document.getElementById('enroll-country').value,
                city: document.getElementById('enroll-city').value,
                socialHandle: document.getElementById('enroll-social').value,
                message: document.getElementById('enroll-message').value,
                course: batchId,
                status: 'pending',
                createdAt: serverTimestamp()
            };

            // 1. Create enrollment record
            try {
                await addDoc(collection(db, 'enrollments'), enrollmentData);
            } catch (error) {
                handleFirestoreError(error, OperationType.CREATE, 'enrollments');
            }

            // 2. Unlock batch for user (as per current behavior)
            const userRef = doc(db, 'users', os.user.uid);
            try {
                await updateDoc(userRef, {
                    purchasedBatches: arrayUnion(batchId)
                });
            } catch (error) {
                handleFirestoreError(error, OperationType.UPDATE, `users/${os.user.uid}`);
            }

            // 3. Send email notification via server
            try {
                const batch = ACADEMY_DATA.find(b => b.id === batchId);
                await fetch('/api/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        enrollmentData, 
                        batchName: batch ? batch.title : batchId 
                    })
                });
            } catch (emailError) {
                console.error('Email Notification Error:', emailError);
                // We don't show an error to the user since the enrollment itself succeeded
            }
            
            os.showNotification('Enrollment successful! Welcome to the batch.', 'success');
            this.state.showEnrollmentForm = null;
            this.state.showPurchaseScreen = null;
            this.selectBatch(batchId, os);
        } catch (error) {
            console.error('Enrollment Error:', error);
            os.showNotification('Failed to complete enrollment. Please try again.', 'error');
        }
    },

    async playVideo(videoId, os = window.os) {
        const video = this.state.selectedBatch.videos.find(v => v.id === videoId);
        this.state.activeVideo = video;
        this.state.quizState = { active: false, index: 0, score: 0, finished: false };
        
        // Fetch notes if it's a URL or .txt file
        if (video.notes && (video.notes.startsWith('http') || video.notes.startsWith('/') || video.notes.endsWith('.txt'))) {
            try {
                const response = await fetch(video.notes);
                if (response.ok) {
                    this.state.activeVideo.fetchedNotes = await response.text();
                } else {
                    this.state.activeVideo.fetchedNotes = "Failed to load module overview from file.";
                }
            } catch (e) {
                this.state.activeVideo.fetchedNotes = "Error loading module overview file.";
            }
        } else {
            this.state.activeVideo.fetchedNotes = video.notes;
        }
        
        os.refreshApp();
    },

    startQuiz(os = window.os) {
        this.state.quizState.active = true;
        const video = document.querySelector('video');
        if (video) video.pause();
        os.showPortal(this.renderQuiz());
    },

    closeQuiz(os = window.os) {
        this.state.quizState.active = false;
        this.state.quizState.index = 0;
        this.state.quizState.score = 0;
        this.state.quizState.finished = false;
        os.hidePortal();
        const video = document.querySelector('video');
        if (video) video.play();
        os.refreshApp();
    },

    answerQuiz(optionIdx, os = window.os) {
        const question = this.state.activeVideo.quiz[this.state.quizState.index];
        if (optionIdx === question.a) this.state.quizState.score++;
        
        if (this.state.quizState.index < this.state.activeVideo.quiz.length - 1) {
            this.state.quizState.index++;
        } else {
            this.state.quizState.finished = true;
        }
        os.showPortal(this.renderQuiz());
    },

    resetQuiz(os = window.os) {
        this.state.quizState = { active: true, index: 0, score: 0, finished: false };
        os.showPortal(this.renderQuiz());
    },

    downloadNotes() {
        const content = this.state.activeVideo.fetchedNotes || this.state.activeVideo.notes;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.state.activeVideo.title}_Notes.txt`;
        a.click();
    }
};
