export const CommunityApp = {
    render(os) {
        return `
            <div class="space-y-12">

                <!-- Header -->
                <div class="max-w-2xl space-y-3">
                    <h2 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                        Community <span class="text-indigo-500">Hub</span>
                    </h2>
                    <p class="text-slate-500 text-base md:text-lg">
                        Connect, collaborate, and grow with creators across the Cadenx ecosystem.
                    </p>
                </div>

                <!-- Platform Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    ${[
                        { 
                            name: 'Discord', 
                            icon: 'message-circle', 
                            count: '12.4k Artists',
                            desc: 'Join real-time discussions, feedback rooms, and collab sessions.',
                            link: '#'
                        },
                        { 
                            name: 'Instagram', 
                            icon: 'instagram', 
                            count: '45k Followers',
                            desc: 'Explore artist highlights, reels, and ecosystem updates.',
                            link: '#'
                        },
                        { 
                            name: 'Twitter', 
                            icon: 'twitter', 
                            count: '22k Followers',
                            desc: 'Stay updated with announcements, drops, and industry insights.',
                            link: '#'
                        }
                    ].map((c, idx) => `
                        <div onclick="window.open('${c.link}', '_blank')" 
                            class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm"
                            style="animation-delay:${idx * 0.1}s">

                            <!-- Icon -->
                            <div class="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-500">
                                <i data-lucide="${c.icon}" class="w-5 h-5"></i>
                            </div>

                            <!-- Content -->
                            <div class="space-y-2">
                                <h4 class="text-lg font-bold text-slate-900">${c.name}</h4>
                                <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                                    ${c.count}
                                </p>
                                <p class="text-sm text-slate-500 leading-relaxed">
                                    ${c.desc}
                                </p>
                            </div>

                            <!-- CTA -->
                            <div class="pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
                                <span class="text-slate-500 font-medium">Join Platform</span>
                                <span class="text-indigo-500 font-semibold">→</span>
                            </div>

                        </div>
                    `).join('')}

                </div>

                <!-- Community Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">

                    ${[
                        { label: 'Total Artists', value: '80K+' },
                        { label: 'Active Collaborations', value: '3.2K+' },
                        { label: 'Projects Completed', value: '12K+' },
                        { label: 'Global Reach', value: '50+ Countries' }
                    ].map(stat => `
                        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
                            <p class="text-2xl font-black text-slate-900">${stat.value}</p>
                            <p class="text-sm text-slate-500">${stat.label}</p>
                        </div>
                    `).join('')}

                </div>

                <!-- Bottom CTA -->
                <div class="bg-indigo-500 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">

                    <div class="space-y-2 text-center md:text-left">
                        <h3 class="text-xl md:text-2xl font-bold">
                            Start collaborating with creators worldwide
                        </h3>
                        <p class="text-white/80 text-sm">
                            Join the network and unlock new opportunities.
                        </p>
                    </div>

                    <button onclick="os.openApp('chord')" 
                        class="px-6 py-3 bg-white text-indigo-500 rounded-xl font-semibold text-sm hover:bg-slate-100 transition">
                        Explore CHORD
                    </button>

                </div>

            </div>
        `;
    }
};
