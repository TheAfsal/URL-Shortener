import UrlForm from "../components/url-form"
import UrlList from "../components/url-list"

export default function HomePage() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-blue-100 mb-2">URL Shortener</h1>
                <p className="text-blue-300 max-w-2xl mx-auto">
                    Create shortened URLs that are easy to share and track. Paste your long URL below to get started.
                </p>
            </div>
            <UrlForm />
            <UrlList />
        </div>
    )
}
