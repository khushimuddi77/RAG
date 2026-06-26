import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import DocumentViewer from "./components/DocumentViewer";

export default function App() {

    const [selectedDocument, setSelectedDocument] = useState(null);

    return (

        <div className="flex h-screen">

            <Sidebar
                onDocumentClick={setSelectedDocument}
            />

            {selectedDocument ? (

                <DocumentViewer
                    document={selectedDocument}
                    onBack={() => setSelectedDocument(null)}
                />

            ) : (

                <ChatWindow />

            )}

        </div>

    );

}