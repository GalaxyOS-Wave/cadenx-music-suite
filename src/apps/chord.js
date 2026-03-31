export const CHORD_PROFILES = [
    { 
        id: 'p1', 
        name: 'Sonic - A Musician', 
        role: 'Vocalist , Producer , FOUNDER', 
        bio: 'Hello guys i am SONIC. I am a passionate musician and founder of CADENX MUSIC.', 
        description: 'Sonic is a passionate musician and founder of Cadenx. His mission is not just to make a music brand but to redefine music industry so that many passionate beginners can take up music as their career',
        location: 'India',
        experience: '05 Years',
        equipment: ['FL studio', 'Band lab', 'Casio ctx 700'],
        skills: ['Vocals', 'Piano', 'Songwriting', 'Arranging'], 
        projects: 12, 
        image: 'https://picsum.photos/seed/elara/400/400' 
    },
];

export const ChordApp = {
    state: {
        selectedProfile: null
    },

    render(os) {
        if (this.state.selectedProfile) {
            return this.renderProfileDetail();
        }

        return `
            <div class="space-y-10 md:space-y-12">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div class="space-y-2">
                        <h2 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900">CHORD DIRECTORY</h2>
                        <p class="text-slate-500 text-base md:text-lg">Connect with elite professionals.</p>
                    </div>

                    <div class="relative w-full md:w-96">
                        <input type="text" placeholder="Search talent..." 
                            class="w-full bg-white border border-slate-200 rounded-xl pl-5 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-800 shadow-sm">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    ${CHORD_PROFILES.map((p, idx) => `
                        <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group shadow-sm" style="animation-delay: ${idx * 0.1}s">
                            
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">
                                </div>
                                <div>
                                    <h4 class="text-lg font-bold text-slate-900">${p.name}</h4>
                                    <p class="text-xs text-indigo-500 uppercase tracking-widest font-semibold">${p.role}</p>
                                </div>
                            </div>

                            <p class="text-slate-500 text-sm leading-relaxed line-clamp-2">${p.bio}</p>

                            <div class="flex flex-wrap gap-2">
                                ${p.skills.map(s => `
                                    <span class="text-xs bg-white text-slate-600 px-3 py-1 rounded-lg border border-slate-200">
                                        ${s}
                                    </span>
                                `).join('')}
                            </div>

                            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
                                <div class="text-xs text-slate-500 uppercase tracking-wide">
                                    <span class="text-slate-900 font-bold">${p.projects}</span> Projects
                                </div>

                                <button onclick="window.os.appMethods.chord.viewProfile('${p.id}')" 
                                    class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition">
                                    View
                                </button>
                            </div>

                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderProfileDetail() {
        const p = this.state.selectedProfile;

        return `
            <div class="space-y-10">
                <button onclick="window.os.appMethods.chord.closeProfile()" 
                    class="flex items-center space-x-2 text-slate-500 hover:text-indigo-500 transition">
                    <span class="text-sm font-semibold">← Back</span>
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <!-- Left -->
                    <div class="space-y-6">
                        <div class="aspect-square rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                            <img src="${p.image}" class="w-full h-full object-cover">
                        </div>

                        <div>
                            <h2 class="text-3xl font-black text-slate-900">${p.name}</h2>
                            <p class="text-indigo-500 uppercase text-xs tracking-widest font-bold">${p.role}</p>
                        </div>

                        <div class="flex gap-6 text-sm">
                            <div>
                                <p class="text-slate-400">Location</p>
                                <p class="font-semibold text-slate-800">${p.location}</p>
                            </div>
                            <div>
                                <p class="text-slate-400">Experience</p>
                                <p class="font-semibold text-slate-800">${p.experience}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right -->
                    <div class="lg:col-span-2 space-y-8">
                        <div>
                            <h3 class="text-xl font-bold text-slate-900 mb-2">Biography</h3>
                            <p class="text-slate-600 leading-relaxed">${p.description}</p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 class="font-bold mb-3 text-slate-900">Skills</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${p.skills.map(s => `
                                        <span class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                                            ${s}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <h4 class="font-bold mb-3 text-slate-900">Equipment</h4>
                                <div class="space-y-2">
                                    ${p.equipment.map(e => `
                                        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                                            ${e}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center pt-6 border-t border-slate-200">
                            <div class="text-lg font-bold text-slate-900">
                                ${p.projects} Projects
                            </div>

                            <button class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold">
                                Request Collaboration
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    },

    viewProfile(profileId, os = window.os) {
        this.state.selectedProfile = CHORD_PROFILES.find(p => p.id === profileId);
        os.refreshApp();
    },

    closeProfile(os = window.os) {
        this.state.selectedProfile = null;
        os.refreshApp();
    }
};