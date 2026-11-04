/** React imports */
import React, { Suspense } from "react";

/** Local imports */
import ChatPageView from "@/components/chat/chat-page-view";

/** Styles */
import styles from "./chat.module.css";

export const metadata = {
    title: "Live Messages",
    description: "Real-time chat with your hackathon teammates and paired developers.",
};

/**
 * Chat Page Server Component.
 * Hosts the 2-column live messaging system.
 *
 * @returns {React.ReactElement} Rendered Chat page view.
 */
const ChatPage = () => {
    return (
        <main className={styles.chat_page}>
            <Suspense fallback={null}>
                <ChatPageView />
            </Suspense>
        </main>
    );
};

export default ChatPage;

