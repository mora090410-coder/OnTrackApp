export default function ThankYouPage() {
    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="container header-inner">
                    <a href="/" className="wordmark">OnTrack</a>
                </div>
            </header>

            <main>
                <section className="thank-you-section">
                    <div className="container">
                        <div className="thank-you-card">
                            <div className="thank-you-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h1 className="thank-you-headline">Payment Successful!</h1>
                            <p className="thank-you-intro">Thank you for joining OnTrack early access.</p>

                            <div className="thank-you-steps">
                                <h2 className="thank-you-steps-title">What happens next:</h2>
                                <ol className="thank-you-list">
                                    <li>Check your email for the receipt</li>
                                    <li>We'll email you when OnTrack is ready (estimated Feb 10, 2026)</li>
                                    <li>You'll get lifetime access the day we launch</li>
                                </ol>
                            </div>

                            <p className="thank-you-support">
                                Questions? Reply to your receipt email.
                            </p>

                            <p className="thank-you-closing">Welcome to the club.</p>
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
                    <p className="footer-copyright">© 2026 OnTrack.</p>
                </div>
            </footer>
        </>
    );
}
