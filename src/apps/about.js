export const AboutApp = {
    render(os) {
        return `
            <div class="bg-slate-50 border border-slate-200 rounded-3xl md:rounded-[48px] p-8 md:p-16 space-y-12 relative overflow-hidden shadow-sm">

                <!-- Background Accent -->
                <div class="absolute top-0 right-0 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>

                <!-- Main Content -->
                <div class="max-w-4xl space-y-8 relative z-10">

                    <!-- Heading -->
                    <div class="space-y-4">
                        <h3 class="text-3xl md:text-6xl font-black tracking-tight leading-tight text-slate-900">
                            Redefining the <br class="hidden md:block">
                            <span class="text-indigo-500">Music Industry</span>
                        </h3>

                        <p class="text-slate-500 text-base md:text-xl leading-relaxed max-w-2xl">
                           Cadenx Music is an ALL IN ONE platform for musicians so that musicians dont feel scattered in their journey of learning music and pursuing it as career. there are mainly 4 components of Cadenx - Academy , Chord (portfolio) , Cadenx Community , Cadenx BLU (tech layer). 
                        </p>
                    </div>

                    <!-- Divider -->
                    <div class="border-t border-slate-200 pt-8 md:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">

                        <!-- Vision -->
                        <div class="space-y-3">
                            <h5 class="text-lg font-bold text-slate-900">Vision</h5>
                            <p class="text-slate-500 text-sm leading-relaxed">
                                To redefine the thinking of people for music and pursuing it as career. We are giving musicians a SUITE for their whole journey!
                            </p>
                        </div>

                        <!-- Values -->
                        <div class="space-y-3">
                            <h5 class="text-lg font-bold text-slate-900">Values</h5>
                            <p class="text-slate-500 text-sm leading-relaxed">
                                Built on innovation , care and passion to redefine music industry like other industry (for e.g - tech industry).
                            </p>
                        </div>

                        <!-- Mission (NEW Enhancement) -->
                        <div class="space-y-3">
                            <h5 class="text-lg font-bold text-slate-900">Mission</h5>
                            <p class="text-slate-500 text-sm leading-relaxed">
                                Our mission is to redefine music industry and actually make it good for passionate musicians to pursue it as career!
                            </p>
                        </div>

                    </div>

                </div>

                <!-- Bottom CTA (NEW Enhancement) -->
                <div class="relative z-10 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">

                    <p class="text-slate-600 text-sm md:text-base">
                        Join a new era of creative collaboration.
                    </p>

                    <button onclick="os.openApp('chord')" 
                        class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold text-sm transition shadow-sm">
                        Explore CHORD Network
                    </button>

                </div>

            </div>
        `;
    }
};
