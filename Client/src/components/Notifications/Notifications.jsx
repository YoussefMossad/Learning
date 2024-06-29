import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { MdNotificationsActive } from "react-icons/md";
import NotificationPopover from './NotificationPopover';

const socket = io('http://localhost:4001');

function Notifications({ userId }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        // Fetch existing notifications
        axios.get(`http://localhost:4001/api/notifications/${userId}`)
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });

        // Fetch unread notifications
        axios.get(`http://localhost:4001/api/unread-notifications/${userId}`)
            .then(response => {
                setUnreadNotifications(response.data);
            })
            .catch(error => {
                console.error('Error fetching unread notifications:', error);
            });

        // Listen for new notifications
        socket.on('notification', notification => {
            setNotifications(prev => [...prev, notification]);
            // Optionally increment unread notifications counter
            setUnreadNotifications(prev => [{ unread: (prev[0]?.unread || 0) + 1 }]);
        });

        return () => {
            socket.off('notification');
        };
    }, [userId]);

    useEffect(() => {
        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopover]);

    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            setShowPopover(false);
            axios.post(`http://localhost:4001/api/mark-notifications-read/${userId}`)
                .then(() => {
                    setUnreadNotifications([{ unread: 0 }]);
                })
                .catch(error => {
                    console.error('Error marking notifications as read:', error);
                });
        }
    };

    const togglePopover = () => {
        setShowPopover(prev => !prev);
    };

    return (
        <div style={{ position: 'relative' }}>
            <MdNotificationsActive onClick={togglePopover} size={20} />
            {unreadNotifications.length > 0 && unreadNotifications[0].unread > 0 && (
                <span className="notification-counter">{unreadNotifications[0].unread}</span>
            )}
            {showPopover && (
                <div ref={popoverRef}>
                    <NotificationPopover notifications={notifications} />
                </div>
            )}
        </div>
    );
}

export default Notifications;
