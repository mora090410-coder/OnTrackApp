import { useState, FormEvent } from 'react';

function App() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        // Store in localStorage
        const earlyAccessEmails = JSON.parse(localStorage.getItem('earlyAccessEmails') || '[]');
        earlyAccessEmails.push({ email, timestamp: new Date().toISOString() });
        localStorage.setItem('earlyAccessEmails', JSON.stringify(earlyAccessEmails));

        // Log to console for debugging
        console.log('Early access signup:', { email, timestamp: new Date().toISOString() });

        setStatus('success');
    };

    const scrollToForm = () => {
        document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="container header-inner">
                    <a href="/" className="wordmark">OnTrack</a>
                    <button onClick={scrollToForm} className="btn btn-secondary">
                        Join the club
                    </button>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section className="hero">
                    <div className="container">
                        <h1 className="hero-headline">Are you on track in recruiting?</h1>
                        <p className="hero-body">
                            OnTrack helps families organize every interaction, follow up on time,
                            and prove they're running the right process—so you never wonder if you're doing enough.
                        </p>
                        <div className="hero-cta">
                            <button onClick={scrollToForm} className="btn btn-primary">
                                Get early access
                            </button>
                        </div>
                        <p className="hero-micro">
                            Launching February 2026 • Built for youth sports families
                        </p>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="section problem">
                    <div className="container">
                        <h2 className="section-title">The problem</h2>
                        <p className="problem-intro">
                            You're spending thousands on camps and travel ball.
                        </p>
                        <p className="problem-chaos">
                            But managing the most important part—relationships with coaches—with scattered emails, notes, and memory. That chaos causes:
                        </p>
                        <ul className="problem-list">
                            <li>Missed follow-ups</li>
                            <li>Lost momentum</li>
                            <li>Sleepless nights wondering: "Am I doing enough?"</li>
                        </ul>
                    </div>
                </section>

                {/* Solution Section */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">OnTrack fixes this.</h2>
                        <div className="feature-blocks">
                            <div className="feature-block">
                                <div className="feature-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <h3>Track every email, camp, call, and visit</h3>
                                    <p>See the complete timeline of your relationship with every coach and school.</p>
                                </div>
                            </div>
                            <div className="feature-block">
                                <div className="feature-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <h3>Never miss a follow-up</h3>
                                    <p>Know exactly what to do next and when—no guessing, no forgetting.</p>
                                </div>
                            </div>
                            <div className="feature-block">
                                <div className="feature-check">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div className="feature-content">
                                    <h3>See proof you're on track</h3>
                                    <p>Get a clear view of your progress and know if you're executing the right process for your stage.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stage-Based Section */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Built for your athlete's stage</h2>
                        <p className="stage-intro">
                            Recruiting isn't the same for freshmen and seniors. OnTrack adapts to exactly where your athlete is:
                        </p>
                        <ul className="stage-list">
                            <li><strong>Freshmen:</strong> Build your list. Cast a wide net. Start conversations.</li>
                            <li><strong>Sophomores:</strong> Narrow your targets. Increase visibility. Deepen relationships.</li>
                            <li><strong>Juniors:</strong> Active recruiting. Campus visits. Push for offers.</li>
                            <li><strong>Seniors:</strong> Decision time. Compare offers. Commit.</li>
                        </ul>
                        <p className="stage-closer">
                            OnTrack gives you the playbook for your stage—not generic advice.
                        </p>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section className="section social-proof">
                    <div className="container">
                        <h2 className="section-title">Join families who are getting on track</h2>
                        <div className="testimonial-placeholder">
                            Testimonials coming after beta.
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="final-cta">
                    <div className="container">
                        <h2 className="final-cta-headline">Stop guessing. Start knowing.</h2>
                        <p className="final-cta-body">
                            Get early access to OnTrack and join the families who run recruiting like a process, not a hope.
                        </p>
                        <button onClick={scrollToForm} className="btn btn-primary">
                            Get early access
                        </button>
                    </div>
                </section>

                {/* Email Capture Form */}
                <section id="email-form" className="email-form-section">
                    <div className="container">
                        <div className="email-form-wrapper">
                            <h2 className="email-form-title">Get early access</h2>

                            {status === 'success' ? (
                                <div className="email-success">
                                    <p className="email-success-text">You're on the list.</p>
                                </div>
                            ) : (
                                <>
                                    <form className="email-form" onSubmit={handleSubmit}>
                                        <input
                                            type="email"
                                            className={`email-input ${status === 'error' ? 'error' : ''}`}
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === 'error') setStatus('idle');
                                            }}
                                            aria-label="Email address"
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            Join the club
                                        </button>
                                    </form>
                                    {status === 'error' && (
                                        <p className="email-error">{errorMessage}</p>
                                    )}
                                    <p className="email-form-micro">
                                        No spam. Just product updates.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-wordmark">OnTrack</div>
                    <p className="footer-tagline">
                        Built by families, for families navigating youth sports recruiting.
                    </p>
                    <p className="footer-email">
                        Questions? <a href="mailto:hello@getontrack.club">hello@getontrack.club</a>
                    </p>
                    <div className="footer-socials">
                        <a href="https://twitter.com/getontrackclub" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com/getontrackclub" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                    <p className="footer-copyright">© 2026 OnTrack.</p>
                </div>
            </footer>
        </>
    );
}

export default App;
