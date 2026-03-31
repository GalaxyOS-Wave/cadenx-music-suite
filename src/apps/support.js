export const SupportApp = {
    render(os) {
        return `
            <div class="space-y-12 md:space-y-16">

                <!-- Header -->
                <div class="max-w-3xl space-y-4">
                    <h2 class="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        Support <span class="text-slate-400">Center</span>
                    </h2>
                    <p class="text-slate-500 text-lg md:text-xl">
                        How can we assist your creative journey today?
                    </p>
                </div>

                <!-- Support Cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

    ${[
        { 
            icon: 'message-circle', 
            title: 'Live Chat', 
            desc: 'Average response time: 2 mins', 
            btn: 'Start Chat',
            link: 'https://your-chat-app.com' // 🔗 replace with your chat link
        },
        { 
            icon: 'mail', 
            title: 'Email Support', 
            desc: 'For complex technical inquiries', 
            btn: 'Open Ticket',
            link: 'cadenxmusic@gmail.com' // 🔗 email opens directly
        },
        { 
            icon: 'book', 
            title: 'Documentation', 
            desc: 'Self-service guides and API docs', 
            btn: 'Browse Docs',
            link: 'https://yourdocs.com' // 🔗 docs site
        }
    ].map(card => `
        <div class="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6 hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 shadow-sm group">

            <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <i data-lucide="${card.icon}" class="w-5 h-5"></i>
            </div>

            <div class="space-y-1">
                <h4 class="text-lg font-bold text-slate-900">${card.title}</h4>
                <p class="text-slate-500 text-sm">${card.desc}</p>
            </div>

            <button 
                onclick="window.open('${card.link}', '_blank')" 
                class="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2">

                <span>${card.btn}</span>
                <i data-lucide="arrow-up-right" class="w-4 h-4"></i>

            </button>
        </div>
    `).join('')}

</div>

                <!-- SMTP Section -->
                <div class="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
                    
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 class="text-2xl font-bold text-slate-900">SMTP Configuration</h3>
                            <p class="text-slate-500 text-sm">Verify your email settings for automated enrollments.</p>
                        </div>

                        <div class="flex gap-3 w-full md:w-auto">
                            <input 
                                type="email" 
                                id="test-email-input" 
                                placeholder="Test email address"
                                class="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 w-full md:w-64"
                            >

                            <button onclick="SupportApp.testSmtp(window.os)" 
                                class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold whitespace-nowrap transition">
                                Test SMTP
                            </button>
                        </div>
                    </div>

                    <div id="smtp-status" class="hidden p-4 rounded-lg text-sm font-medium"></div>
                </div>

                <!-- FAQ -->
                <div class="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
                    
                    <h3 class="text-2xl font-bold mb-8 text-slate-900">Frequently Asked Questions</h3>

                    <div class="space-y-4">
                        ${[
                            { q: 'How do I opt for a batch', a: 'You can opt for a batch by filling enrollment form and paying the batch fee (if there).' },
                            { q: 'Can I collaborate with artists in different regions?', a: 'Yes, CHORD is a global directory designed for remote and local collaboration.You can also join Cadenx Community for real time talking with various artists.' },
                            { q: 'How do i get my profile on chord', a: 'You can get your profile on chord by filling registration form from registration app.' }
                        ].map(faq => `
                            <div class="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition">

                                <p class="font-semibold text-indigo-500 text-sm mb-1">
                                    ${faq.q}
                                </p>

                                <p class="text-slate-600 text-sm leading-relaxed">
                                    ${faq.a}
                                </p>

                            </div>
                        `).join('')}
                    </div>

                </div>

            </div>
        `;
    },

    async testSmtp(os) {
        const input = document.getElementById('test-email-input');
        const status = document.getElementById('smtp-status');
        const email = input.value.trim();

        if (!email) {
            os.showNotification('Please enter a test email address.', 'error');
            return;
        }

        status.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
        status.classList.add('bg-blue-100', 'text-blue-700');
        status.textContent = 'Sending test email...';

        try {
            const response = await fetch('/api/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: email })
            });

            const result = await response.json();

            if (response.ok) {
                status.classList.remove('bg-blue-100', 'text-blue-700');
                status.classList.add('bg-green-100', 'text-green-700');
                status.textContent = 'Success! Test email sent to ' + email;
                os.showNotification('SMTP Test Successful!', 'success');
            } else {
                throw new Error(result.error || 'Failed to send test email.');
            }
        } catch (error) {
            status.classList.remove('bg-blue-100', 'text-blue-700');
            status.classList.add('bg-red-100', 'text-red-700');
            status.textContent = 'Error: ' + error.message;
            os.showNotification('SMTP Test Failed', 'error');
        }
    }
};

window.SupportApp = SupportApp;