"use client";

/** React imports */
import React, { useState, useEffect, useRef } from "react";

/** Libraries */
import Image from "next/image";
import toast from "react-hot-toast";

/** Local imports */
import api from "@/helpers/axios";
import { getSocket } from "@/helpers/socket";
import { useAuth } from "@/hooks/use-auth";

/** Styles */
import styles from "./chat-modal.module.css";

/**
 * Real-time Chat Drawer Component allowing paired developers to message each other.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.partner The connected developer partner to chat with.
 * @param {Function} props.onClose Callback to close the chat drawer.
 * @returns {React.ReactElement} Rendered ChatModal element.
 */
const ChatModal = ({ partner, onClose }) => {
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const [imageError, setImageError] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const partnerName =
        `${partner?.firstName || ""} ${partner?.lastName || ""}`.trim() ||
        "Developer";
    const partnerInitials = (partner?.firstName?.charAt(0) || "D").toUpperCase();

    // Auto-scroll to bottom of chat
    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // 1. Fetch message history
    useEffect(() => {
        if (!partner?._id) return;

        let isMounted = true;

        const fetchHistory = async () => {
            try {
                const response = await api.get(`/chat/${partner._id}`);
                if (isMounted) {
                    setMessages(response.data?.messages || []);
                    setLoading(false);
                    setTimeout(() => scrollToBottom("auto"), 50);
                }
            } catch (err) {
                if (isMounted) {
                    setLoading(false);
                    const errorMsg =
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to load chat history";
                    toast.error(errorMsg);
                }
            }
        };

        fetchHistory();

        return () => {
            isMounted = false;
        };
    }, [partner?._id]);

    // 2. Setup real-time Socket.IO room & listeners
    useEffect(() => {
        if (!partner?._id) return;

        const socket = getSocket();

        // Join room
        socket.emit("joinChat", { targetUserId: partner._id });

        // Listen for incoming messages
        const handleMessageReceived = (msg) => {
            const isRelevant =
                (msg.senderId?.toString() === partner._id?.toString() &&
                    msg.targetUserId?.toString() === currentUser?._id?.toString()) ||
                (msg.senderId?.toString() === currentUser?._id?.toString() &&
                    msg.targetUserId?.toString() === partner._id?.toString());

            if (isRelevant) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom("smooth");
            }
        };

        // Listen for typing events
        const handleUserTyping = ({ userId, isTyping }) => {
            if (userId?.toString() === partner._id?.toString()) {
                setIsPartnerTyping(Boolean(isTyping));
                scrollToBottom("smooth");
            }
        };

        const handleSocketError = ({ message }) => {
            toast.error(message || "Chat error occurred");
        };

        socket.on("messageReceived", handleMessageReceived);
        socket.on("userTyping", handleUserTyping);
        socket.on("error", handleSocketError);

        return () => {
            socket.off("messageReceived", handleMessageReceived);
            socket.off("userTyping", handleUserTyping);
            socket.off("error", handleSocketError);
        };
    }, [partner?._id, currentUser?._id]);

    // Scroll whenever messages or typing changes
    useEffect(() => {
        scrollToBottom("smooth");
    }, [messages, isPartnerTyping]);

    // Handle Input Typing & debounce stopTyping
    const handleInputChange = (e) => {
        const text = e.target.value;
        setNewMessage(text);

        const socket = getSocket();
        socket.emit("typing", { targetUserId: partner._id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { targetUserId: partner._id });
        }, 1500);
    };

    // Send Message
    const handleSendMessage = (e) => {
        e?.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed) return;

        const socket = getSocket();
        socket.emit("sendMessage", {
            targetUserId: partner._id,
            text: trimmed,
        });

        socket.emit("stopTyping", { targetUserId: partner._id });
        setNewMessage("");
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <div className={styles.chat_backdrop} onClick={onClose}>
            <div
                className={styles.chat_panel}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.chat_header}>
                    <div className={styles.partner_info}>
                        <div className={styles.avatar_wrapper}>
                            {partner?.photoUrl && !imageError ? (
                                <Image
                                    src={partner.photoUrl}
                                    alt={partnerName}
                                    fill
                                    sizes="42px"
                                    unoptimized={partner.photoUrl.startsWith("data:")}
                                    className={styles.avatar_image}
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className={styles.avatar_fallback}>
                                    {partnerInitials}
                                </div>
                            )}
                        </div>
                        <div className={styles.partner_details}>
                            <h3 className={styles.partner_name}>{partnerName}</h3>
                            <span className={styles.partner_status}>
                                {isPartnerTyping ? (
                                    <span className={styles.typing_indicator}>
                                        typing...
                                    </span>
                                ) : (
                                    <>
                                        <span className={styles.online_dot} />
                                        <span>Active Connection</span>
                                    </>
                                )}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.close_button}
                        title="Close chat"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages Container */}
                <div className={styles.messages_container}>
                    {loading ? (
                        <div className={styles.loading_state}>
                            <div className={styles.spinner} />
                            <span>Loading conversation...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className={styles.empty_state}>
                            <span className={styles.empty_icon}>💬</span>
                            <h4 className={styles.empty_title}>No messages yet</h4>
                            <p className={styles.empty_subtitle}>
                                Send a message to say hi to {partner?.firstName || "your partner"}!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isOutgoing =
                                msg.senderId?.toString() === currentUser?._id?.toString() ||
                                msg.senderId === currentUser?._id;

                            return (
                                <div
                                    key={msg._id || index}
                                    className={`${styles.message_wrapper} ${
                                        isOutgoing
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

                {/* Footer Input */}
                <div className={styles.chat_footer}>
                    <form onSubmit={handleSendMessage} className={styles.chat_form}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            className={styles.chat_input}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className={styles.send_button}
                            title="Send Message"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
