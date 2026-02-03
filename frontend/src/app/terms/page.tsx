export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <div className="prose prose-purple">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>By using Viralis, you agree to these terms. This is a placeholder terms of service document.</p>
            </div>
        </div>
    );
}
