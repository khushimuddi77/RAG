export default function DocumentViewer({
    document,
    onBack
}) {

    return (

        <div className="flex-1 p-10 overflow-auto">

            <button
                onClick={onBack}
                className="mb-8 rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
                ← Back to AI Chat
            </button>

            <h1 className="text-4xl font-bold">

                {document.title}

            </h1>

            <p className="text-gray-500 mt-2">

                {document.department}

            </p>

            <p className="text-gray-400">

                Updated {document.updated}

            </p>

            <div className="mt-8 whitespace-pre-wrap leading-8">

                {document.content}

            </div>

        </div>

    );

}