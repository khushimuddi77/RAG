import { useEffect, useState } from "react";

export default function Sidebar({ onDocumentClick }) {

    const [documents, setDocuments] = useState([]);

    useEffect(() => {

        fetch("http://localhost:8000/documents")
            .then(res => res.json())
            .then(data => {

                setDocuments(data);

            });

    }, []);

    return (

        <div className="w-80 border-r h-screen flex flex-col">

            <div className="p-5 border-b">

                <h2 className="font-bold text-xl">
                    Knowledge Base
                </h2>

            </div>

            <div className="overflow-auto">

                {documents.map(doc => (

                    <div
                        key={doc.id}
                        onClick={() => onDocumentClick(doc)}
                        className="cursor-pointer border-b p-4 hover:bg-gray-100"
                    >

                        <h3 className="font-semibold">

                            {doc.title}

                        </h3>

                        <p className="text-sm text-gray-500">

                            {doc.department}

                        </p>

                        <p className="text-xs text-gray-400">

                            Updated: {doc.updated}

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}