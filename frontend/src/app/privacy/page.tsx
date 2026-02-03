export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-purple">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Your privacy is important to us. This is a placeholder privacy policy for the Viralis application.</p>
                <p>For any questions, please contact us at support@viralis.app.</p>
            </div>
        </div>
    );
}
