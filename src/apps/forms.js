export const FormsApp = {
    render(os) {
        return `
            <div class="space-y-12">

                <!-- Header -->
                <div class="max-w-2xl space-y-3">
                    <h2 class="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                        Ecosystem <span class="text-indigo-500">Portals</span>
                    </h2>
                    <p class="text-slate-500 text-base md:text-lg">
                        Official entry points for registration, listings, and feedback.
                    </p>
                </div>

                <!-- Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                    ${[
                        { 
                            title: 'Profile Registration', 
                            icon: 'user-plus', 
                            desc: 'Submit your professional details for the CHORD directory.', 
                            tag: 'Talent',
                            link: 'https://forms.gle/7FML4dnruF7KsPEBA'
                        },
                        { 
                            title: 'Service Listing', 
                            icon: 'briefcase', 
                            desc: 'Apply to list your professional services on our marketplace.', 
                            tag: 'Business',
                            link: 'https://forms.gle/FORM_LINK_2'
                        },
                        { 
                            title: 'Feedback Portal', 
                            icon: 'message-square', 
                            desc: 'Help us refine the ecosystem with your insights.', 
                            tag: 'System',
                            link: 'https://forms.gle/FORM_LINK_3'
                        }
                    ].map((f, idx) => `
                        <div onclick="window.open('${f.link}', '_blank')" 
                            class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 flex flex-col space-y-6 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm"
                            style="animation-delay: ${idx * 0.1}s">

                            <!-- Top -->
                            <div class="flex justify-between items-start">

                                <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-500">
                                    <i data-lucide="${f.icon}" class="w-5 h-5"></i>
                                </div>

                                <span class="text-xs font-semibold bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full">
                                    ${f.tag}
                                </span>

                            </div>

                            <!-- Content -->
                            <div class="space-y-2">
                                <h4 class="text-xl font-bold text-slate-900">
                                    ${f.title}
                                </h4>

                                <p class="text-slate-500 text-sm leading-relaxed">
                                    ${f.desc}
                                </p>
                            </div>

                            <!-- Footer CTA -->
                            <div class="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">

                                <span class="text-slate-500 font-medium">
                                    Open Portal
                                </span>

                                <span class="text-indigo-500 font-semibold">
                                    →
                                </span>

                            </div>

                        </div>
                    `).join('')}

                </div>

            </div>
        `;
    }
};
