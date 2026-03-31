import { auth, db } from '../firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const ProfileApp = {
    state: {
        loading: false,
        enrollments: []
    },

    render(os) {
        if (!os.user) {
            return `
                <div class="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center px-4">
                    
                    <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-indigo-500 border border-slate-200">
                        <i data-lucide="lock" class="w-8 h-8"></i>
                    </div>

                    <div class="space-y-3">
                        <h2 class="text-3xl font-black text-slate-900">
                            Access <span class="text-indigo-500">Denied</span>
                        </h2>
                        <p class="text-slate-500 max-w-md text-sm">
                            Please sign in to view your personalized dashboard.
                        </p>
                    </div>

                    <button onclick="os.handleLogin()" 
                        class="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold text-sm transition">
                        Sign In with Google
                    </button>

                </div>
            `;
        }

        const userData = os.userData || {};
        const purchasedBatches = userData.purchasedBatches || [];

        return `
            <div class="space-y-10 pb-20">

                <!-- Profile Header -->
                <div class="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">

                    <div class="flex flex-col md:flex-row items-center md:items-end gap-8">

                        <img src="${os.user.photoURL}" 
                            class="w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-slate-200 object-cover">

                        <div class="space-y-3 text-center md:text-left flex-1">

                            <p class="text-xs text-indigo-500 uppercase tracking-widest font-bold">
                                Verified Member
                            </p>

                            <h2 class="text-3xl md:text-5xl font-black text-slate-900">
                                ${os.user.displayName}
                            </h2>

                            <div class="flex flex-wrap justify-center md:justify-start gap-3">

                                <div class="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                                    ${purchasedBatches.length} Active Batches
                                </div>

                                <div class="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                                    ${userData.role || 'Pro Member'}
                                </div>

                                <button onclick="os.handleLogout()" 
                                    class="px-4 py-2 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-500 hover:bg-red-100 transition">
                                    Sign Out
                                </button>

                            </div>

                        </div>
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <!-- Batches -->
                    <div class="lg:col-span-8 space-y-8">

                        <div class="flex justify-between items-center">
                            <h2 class="text-2xl font-bold text-slate-900">
                                My <span class="text-indigo-500">Batches</span>
                            </h2>

                            <button onclick="os.openApp('academy')" 
                                class="text-sm font-semibold text-indigo-500 hover:underline">
                                Explore More
                            </button>
                        </div>

                        ${purchasedBatches.length > 0 ? `
                            <div class="grid md:grid-cols-2 gap-6">

                                ${purchasedBatches.map(batchId => {
                                    const batch = this.getBatchInfo(batchId);

                                    return `
                                        <div onclick="os.openApp('academy'); os.appMethods.academy.handleBatchClick('${batchId}', os)" 
                                            class="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5 hover:bg-white hover:shadow-md hover:-translate-y-1 transition cursor-pointer">

                                            <div class="flex justify-between items-start">

                                                <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-500">
                                                    <i data-lucide="play" class="w-5 h-5"></i>
                                                </div>

                                                <span class="text-xs font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
                                                    Unlocked
                                                </span>
                                            </div>

                                            <div>
                                                <h4 class="font-bold text-slate-900 text-lg">
                                                    ${batch.name}
                                                </h4>

                                                <p class="text-sm text-slate-500 mt-1">
                                                    ${batch.description}
                                                </p>
                                            </div>

                                            <div class="pt-4 border-t border-slate-200 flex justify-between text-sm text-slate-500">
                                                <span>Lifetime Access</span>
                                                <span class="text-indigo-500">→</span>
                                            </div>

                                        </div>
                                    `;
                                }).join('')}

                            </div>
                        ` : `
                            <div class="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-5">

                                <div class="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto">
                                    <i data-lucide="book-open" class="w-6 h-6 text-slate-400"></i>
                                </div>

                                <h3 class="text-xl font-bold text-slate-900">
                                    No Batches Found
                                </h3>

                                <p class="text-slate-500 text-sm">
                                    Start your learning journey today.
                                </p>

                                <button onclick="os.openApp('academy')" 
                                    class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition">
                                    Browse Courses
                                </button>

                            </div>
                        `}

                    </div>

                    <!-- Sidebar -->
                    <div class="lg:col-span-4 space-y-6">

                        <!-- Progress -->
                        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
                            <h4 class="text-sm font-semibold text-slate-700">Progress</h4>

                            ${this.renderProgressItem('Curriculum Progress', 0)}
                            ${this.renderProgressItem('Community Engagement', 0)}
                            ${this.renderProgressItem('Project Submissions', 0)}
                        </div>

                        <!-- Milestone -->
                        <div class="bg-indigo-500 rounded-2xl p-6 text-white space-y-4">
                            <h4 class="text-xs uppercase tracking-widest text-white/70">
                                SNEEEK PEAK
                            </h4>

                            <p class="font-bold text-lg">
                                Know more about future plans and news of Cadenx
                            </p>

                            <button class="w-full py-3 bg-white text-indigo-500 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                                Cadenx News (CadNews)
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        `;
    },

    renderProgressItem(label, progress) {
        return `
            <div class="space-y-2">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500">${label}</span>
                    <span class="font-semibold text-slate-800">${progress}%</span>
                </div>

                <div class="w-full h-2 bg-slate-200 rounded-full">
                    <div class="h-full bg-indigo-500 rounded-full" style="width:${progress}%"></div>
                </div>
            </div>
        `;
    },

    getBatchInfo(batchId) {
        const batches = {
            'b1': { name: 'Sur Sadhana - Batch for beginners', description: 'Best batch for beginner producers' },
        }
        return batches[batchId] || { name: 'Unknown Course', description: 'Course details unavailable.' };
    }
};
