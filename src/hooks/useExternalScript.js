import { useEffect, useState } from 'react';

const cachedScripts = new Set();

export const useExternalScript = (url) => {
    const [state, setState] = useState(url ? (cachedScripts.has(url) ? 'ready' : 'loading') : 'idle');

    useEffect(() => {
        if (!url) {
            setState('idle');
            return;
        }

        if (cachedScripts.has(url)) {
            setState('ready');
            return;
        }

        setState('loading');

        let script = document.querySelector(`script[src="${url}"]`);

        if (!script) {
            script = document.createElement('script');
            script.src = url;
            script.async = true;
            document.head.appendChild(script);
        }

        const onScriptLoad = () => {
            cachedScripts.add(url);
            setState('ready');
        };

        const onScriptError = () => {
            setState('error');
        };

        script.addEventListener('load', onScriptLoad);
        script.addEventListener('error', onScriptError);

        return () => {
            script.removeEventListener('load', onScriptLoad);
            script.removeEventListener('error', onScriptError);
        };
    }, [url]);

    return state;
};
