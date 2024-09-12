interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    initDataUnsafe: {
        user?: {
            id: number;
            username: string;
            coinsToAdd: number;
            henergy: number;
            chan: number;
            group: number;
        };
        start_param?: string;
    };
}

interface Window {
    Telegram?: {
        WebApp: TelegramWebApp;
    };
}
