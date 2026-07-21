import { useEffect, useRef } from 'react';

export function useInactivityTimeout(timeoutMinutes: number, onTimeout: () => void) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            onTimeout();
        }, timeoutMinutes * 60 * 1000);
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        
        const handleActivity = () => {
            resetTimeout();
        };

        // Initialize first timeout
        resetTimeout();

        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [timeoutMinutes, onTimeout]);
}
