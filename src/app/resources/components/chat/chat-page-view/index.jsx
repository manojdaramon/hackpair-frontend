"use client";

/** React imports */
import React, { useState, useEffect, useRef } from "react";

/** Libraries */
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";
import { getSocket } from "@/helpers/socket";
import { useAuth } from "@/hooks/use-auth";
import DashboardShell from "@/components/dashboard/dashboard-shell";

/** Styles */
import styles from "./chat-page-view.module.css";

/**
 * Full Messenger Chat Page View component providing a 2-column interface for conversations.
 *
 * @returns {React.ReactElement} Rendered ChatPageView element.
 */
const ChatPageView = () => {
    const { user: currentUser } = useAuth();
    const searchParams = useSearchParams();
    const queryUserId = searchParams.get("userId");

    const [conversations, setConversations] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [failedImages, setFailedImages] = useState({});

    // Mobile view toggle ("list" | "chat")
    const [mobileView, setMobileView] = useState("list");

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const handleImageError = (id) => {
        setFailedImages((prev) => ({ ...prev, [id]: true }));
    };

    // 1. Fetch conversations on mount or query param change
    useEffect(() => {
        let isMounted = true;

        const loadConversations = async () => {
            try {
                const res = await api.get("/chat/conversations");
                if (!isMounted) return;

                const list = res.data?.conversations || [];
                setConversations(list);
                setLoadingConversations(false);

                // Auto-select partner based on query param or first conversation
                if (queryUserId) {
                    const targetConv = list.find(
                        (c) => c.partner?._id?.toString() === queryUserId.toString()
                    );
                    if (targetConv) {
                        setSelectedPartner(targetConv.partner);
                        setMobileView("chat");
                    }
                } else if (list.length > 0) {
                    setSelectedPartner((prev) => prev || list[0].partner);
                }
            } catch (err) {
                if (isMounted) {
                    setLoadingConversations(false);
                    toast.error(err.response?.data?.message || "Failed to load conversations");
                }
            }
        };

        loadConversations();

        return () => {
            isMounted = false;
        };
    }, [queryUserId]);

    // 2. Load messages and join room when selectedPartner changes
    useEffect(() => {
        if (!selectedPartner?._id) return;

        let isMounted = true;

        const socket = getSocket();
        socket.emit("joinChat", { targetUserId: selectedPartner._id });
        socket.emit("markAsSeen", { targetUserId: selectedPartner._id });

        const loadHistory = async () => {
            try {
                const res = await api.get(`/chat/${selectedPartner._id}`);
                if (isMounted) {
                    setMessages(res.data?.messages || []);
                    setLoadingMessages(false);
                    setTimeout(() => scrollToBottom("auto"), 50);

                    // Clear unread badge in conversation list for this partner
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.partner?._id?.toString() === selectedPartner._id?.toString()
                                ? { ...c, unreadCount: 0 }
                                : c
                        )
                    );
                }
            } catch (err) {
                if (isMounted) {
                    setLoadingMessages(false);
                    toast.error(err.response?.data?.message || "Failed to load messages");
                }
            }
        };

        loadHistory();

        return () => {
            isMounted = false;
        };
    }, [selectedPartner?._id]);

    // 3. Setup real-time Socket.IO listeners
    useEffect(() => {
        const socket = getSocket();

        const handleMessageReceived = (msg) => {
            const partnerId = selectedPartner?._id?.toString();
            const senderId = msg.senderId?.toString();
            const targetId = msg.targetUserId?.toString();

            // If message is in currently active chat:
            if (
                partnerId &&
                (senderId === partnerId || (senderId === currentUser?._id && targetId === partnerId))
            ) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom("smooth");

                if (senderId === partnerId) {
                    socket.emit("markAsSeen", { targetUserId: partnerId });
                }
            }

            // Update conversation list item preview & position
            setConversations((prev) => {
                const otherUserId = senderId === currentUser?._id ? targetId : senderId;
                const existingIndex = prev.findIndex(
                    (c) => c.partner?._id?.toString() === otherUserId
                );

                if (existingIndex !== -1) {
                    const updated = [...prev];
                    const item = { ...updated[existingIndex] };
                    item.lastMessage = msg.text;
                    item.lastMessageTime = msg.createdAt;
                    if (otherUserId !== partnerId) {
                        item.unreadCount = (item.unreadCount || 0) + 1;
                    }
                    updated.splice(existingIndex, 1);
                    return [item, ...updated];
                }
                return prev;
            });
        };

        const handleUserTyping = ({ userId, isTyping }) => {
            if (userId?.toString() === selectedPartner?._id?.toString()) {
                setIsPartnerTyping(Boolean(isTyping));
                scrollToBottom("smooth");
            }
        };

        socket.on("messageReceived", handleMessageReceived);
        socket.on("userTyping", handleUserTyping);

        return () => {
            socket.off("messageReceived", handleMessageReceived);
            socket.off("userTyping", handleUserTyping);
        };
    }, [selectedPartner?._id, currentUser?._id]);

    // Typing debounce
    const handleInputChange = (e) => {
        const text = e.target.value;
        setNewMessage(text);

        if (!selectedPartner?._id) return;

        const socket = getSocket();
        socket.emit("typing", { targetUserId: selectedPartner._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { targetUserId: selectedPartner._id });
        }, 1500);
    };

    // Send Message
    const handleSendMessage = (e) => {
        e?.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || !selectedPartner?._id) return;

        const socket = getSocket();
        socket.emit("sendMessage", {
            targetUserId: selectedPartner._id,
            text: trimmed,
        });

        socket.emit("stopTyping", { targetUserId: selectedPartner._id });
        setNewMessage("");
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            if (isToday) {
                return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            }
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        } catch {
            return "";
        }
    };

    // Filter conversations by search input
    const filteredConversations = conversations.filter((c) => {
        const name = `${c.partner?.firstName || ""} ${c.partner?.lastName || ""}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    const activePartnerName =
        `${selectedPartner?.firstName || ""} ${selectedPartner?.lastName || ""}`.trim() ||
        "Developer";

    return (
        <DashboardShell
            title="Messages"
            subtitle="Real-time collaboration with your confirmed hackathon partners."
        >
            <div className={styles.chat_workspace}>
                {/* 1. Left Conversations Sidebar */}
                <div
                    className={`${styles.conversations_sidebar} ${mobileView === "chat" ? styles.hide_on_mobile : ""
                        }`}
                >
                    <div className={styles.search_wrapper}>
                        <input
                            type="text"
                            placeholder="Search partners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.search_input}
                        />
                    </div>

                    <div className={styles.conversations_list}>
                        {loadingConversations ? (
                            <div className={styles.loading_container}>
                                <div className={styles.spinner} />
                                <span>Loading chats...</span>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className={styles.empty_conversations}>
                                {searchQuery
                                    ? "No matching partners found"
                                    : "No connected partners yet. Match on Feed to start chatting!"}
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const partner = conv.partner;
                                const isSelected =
                                    selectedPartner?._id?.toString() === partner?._id?.toString();
                                const fullName =
                                    `${partner?.firstName || ""} ${partner?.lastName || ""}`.trim() ||
                                    "Developer";
                                const initials = (partner?.firstName?.charAt(0) || "D").toUpperCase();
                                const hasImageError = failedImages[partner?._id];

                                return (
                                    <button
                                        key={partner?._id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedPartner(partner);
                                            setLoadingMessages(true);
                                            setMobileView("chat");
                                        }}
                                        className={`${styles.conversation_item} ${isSelected ? styles.conversation_item_active : ""
                                            }`}
                                    >
                                        <div className={styles.avatar_wrapper}>
                                            {partner?.photoUrl && !hasImageError ? (
                                                <Image
                                                    src={partner.photoUrl}
                                                    alt={fullName}
                                                    fill
                                                    sizes="44px"
                                                    unoptimized={partner.photoUrl.startsWith("data:")}
                                                    className={styles.avatar_image}
                                                    onError={() => handleImageError(partner?._id)}
                                                />
                                            ) : (
                                                <div className={styles.avatar_fallback}>
                                                    {initials}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.item_content}>
                                            <div className={styles.item_header}>
                                                <span className={styles.item_name}>{fullName}</span>
                                                <span className={styles.item_time}>
                                                    {formatTime(conv.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className={styles.item_preview_row}>
                                                <span className={styles.item_snippet}>
                                                    {conv.lastMessage}
                                                </span>
                                                {conv.unreadCount > 0 && (
                                                    <span className={styles.unread_badge}>
                                                        {conv.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. Right Active Chat Pane */}
                <div
                    className={`${styles.active_chat_pane} ${mobileView === "list" ? styles.hide_on_mobile : ""
                        }`}
                >
                    {selectedPartner ? (
                        <>
                            {/* Chat Header */}
                            <div className={styles.chat_header}>
                                <div className={styles.header_left}>
                                    <button
                                        type="button"
                                        onClick={() => setMobileView("list")}
                                        className={styles.back_btn}
                                        title="Back to conversations"
                                    >
                                        ←
                                    </button>
                                    <div className={styles.avatar_wrapper}>
                                        {selectedPartner.photoUrl && !failedImages[selectedPartner._id] ? (
                                            <Image
                                                src={selectedPartner.photoUrl}
                                                alt={activePartnerName}
                                                fill
                                                sizes="42px"
                                                unoptimized={selectedPartner.photoUrl.startsWith("data:")}
                                                className={styles.avatar_image}
                                                onError={() => handleImageError(selectedPartner._id)}
                                            />
                                        ) : (
                                            <div className={styles.avatar_fallback}>
                                                {(selectedPartner.firstName?.charAt(0) || "D").toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={styles.header_partner_name}>
                                            {activePartnerName}
                                        </h3>
                                        <div className={styles.header_status}>
                                            {isPartnerTyping ? (
                                                <span className={styles.typing_text}>
                                                    typing...
                                                </span>
                                            ) : (
                                                <>
                                                    <span className={styles.online_dot} />
                                                    <span>Active Connection</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Stream */}
                            <div className={styles.messages_stream}>
                                {loadingMessages ? (
                                    <div className={styles.loading_container}>
                                        <div className={styles.spinner} />
                                        <span>Loading conversation...</span>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className={styles.no_chat_selected}>
                                        <span className={styles.placeholder_icon}>👋</span>
                                        <h4 className={styles.placeholder_title}>
                                            Say hi to {selectedPartner.firstName || "your partner"}!
                                        </h4>
                                        <p className={styles.placeholder_desc}>
                                            Start collaborating, sharing ideas, and pairing up for your upcoming hackathon.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isOutgoing =
                                            msg.senderId?.toString() === currentUser?._id?.toString() ||
                                            msg.senderId === currentUser?._id;

                                        return (
                                            <div
                                                key={msg._id || idx}
                                                className={`${styles.message_wrapper} ${isOutgoing
                                                        ? styles.message_outgoing
                                                        : styles.message_incoming
                                                    }`}
                                            >
                                                <div className={styles.message_bubble}>
                                                    {msg.text}
                                                </div>
                                                <span className={styles.message_time}>
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}

                                {isPartnerTyping && (
                                    <div className={styles.typing_bubble}>
                                        <div className={styles.typing_dot} />
                                        <div className={styles.typing_dot} />
                                        <div className={styles.typing_dot} />
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className={styles.chat_input_area}>
                                <form onSubmit={handleSendMessage} className={styles.input_form}>
                                    <input
                                        type="text"
                                        placeholder={`Message ${selectedPartner.firstName || "partner"}...`}
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        className={styles.text_input}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className={styles.send_btn}
                                        title="Send message"
                                    >
                                        ➤
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className={styles.no_chat_selected}>
                            <span className={styles.placeholder_icon}>💬</span>
                            <h3 className={styles.placeholder_title}>Your Messages</h3>
                            <p className={styles.placeholder_desc}>
                                Select a conversation from the left to start chatting with your hackathon teammates.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
};

export default ChatPageView;
