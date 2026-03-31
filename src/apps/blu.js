export const BluApp = {
    render(os) {
        return `
            <div class="relative bg-slate-50 border border-slate-200 rounded-3xl md:rounded-[48px] p-8 md:p-16 overflow-hidden shadow-sm">

                <!-- Background Accent -->
                <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>

                <div class="relative z-10 grid md:grid-cols-2 gap-10 items-center">

                    <!-- Left Content -->
                    <div class="space-y-6 md:space-y-8">

                        <!-- Badge -->
                        <div class="inline-flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-full text-xs font-semibold text-indigo-500">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                            <span>AI Engine Active</span>
                        </div>

                        <!-- Heading -->
                        <h3 class="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                            Your AI <br class="hidden md:block">
                            <span class="text-indigo-500">Co-Pilot</span>
                        </h3>

                        <!-- Description -->
                        <p class="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl">
                            Cadenx BLU is a next-generation generative assistant that understands your sound, enhances your workflow, and helps you create faster — from idea to final master.
                        </p>

                        <!-- CTAs -->
                        <div class="flex flex-col sm:flex-row gap-4">

                            <button class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold text-sm transition shadow-sm">
                                Get Early Access
                            </button>

                            <button class="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition">
                                Learn More
                            </button>

                        </div>

                    </div>

                    <!-- Right Features -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        ${[
                            { title: 'Smart Sound Analysis', desc: 'Understands your sonic identity and style.' },
                            { title: 'Instant Suggestions', desc: 'Get melodies, chords, and mix ideas instantly.' },
                            { title: 'Workflow Acceleration', desc: 'Reduce production time with AI assistance.' },
                            { title: 'Creative Expansion', desc: 'Discover new directions and unique sounds.' }
                        ].map(f => `
                            <div class="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-sm">

                                <p class="font-semibold text-slate-900 text-sm">
                                    ${f.title}
                                </p>

                                <p class="text-slate-500 text-xs leading-relaxed">
                                    ${f.desc}
                                </p>

                            </div>
                        `).join('')}

                    </div>

                </div>

            </div>
        `;
    }
};
