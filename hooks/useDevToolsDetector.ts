import { useEffect, useState } from 'react';

export function useDevToolsDetector(onDetect: () => void) {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

    useEffect(() => {
        let detectorInterval: NodeJS.Timeout;

        const checkDevTools = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;

            if (widthThreshold || heightThreshold) {
                if (!isDevToolsOpen) {
                    setIsDevToolsOpen(true);
                    onDetect();
                }
            } else {
                setIsDevToolsOpen(false);
            }
        };

        window.addEventListener('resize', checkDevTools);
        detectorInterval = setInterval(checkDevTools, 1000);

        // Debugger trap method (more aggressive, might annoy users in standard browsing if not careful, 
        // but very effective for secure environments)
        const debuggerTrap = setInterval(() => {
            const start = performance.now();
            // eslint-disable-next-line no-debugger
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                if (!isDevToolsOpen) {
                    setIsDevToolsOpen(true);
                    onDetect();
                }
            }
        }, 1000);

        return () => {
            window.removeEventListener('resize', checkDevTools);
            clearInterval(detectorInterval);
            clearInterval(debuggerTrap);
        };
    }, [isDevToolsOpen, onDetect]);

    return isDevToolsOpen;
}
