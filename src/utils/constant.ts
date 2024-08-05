export const SIDE = {
    Bear: 'Bear',
    Short: 'Short',
    Bull: 'Bull',
    Long: 'Long',
};

export const HAKIFI_KEY = {
    SYMBOL: "HAKIFI_KEY_SYMBOL",
};

export enum MODE {
    BULL = "BULL",
    BEAR = "BEAR",
}

export const HEDGE_INIT = 0.05;

export const MARGIN_PERCENT = {
    0.02: '2%',
    0.04: '4%',
    0.06: '6%',
    0.08: '8%',
    0.1: '10%',
};

export enum NOTIFICATIONS {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
}

export enum TRADING_VIEW_DEFAULTS {
    LIBRARY_PATH = "/lib/tradingview/charting_library/",
    CHARTS_STORAGE_URL = "https://saveload.tradingview.com",
    CHARTS_STORAGE_API_VERSION = "1.1",
    CLIENT_ID = "tradingview.com",
    USER_ID = "public_user_id",
    CONTAINER_ID_SPOT = "tv_chart_container",
    CONTAINER_ID_SPOT_DETAIL = "tv_chart_container_detail",
    INTERVAL = "1D",
    CUSTOM_CSS = "/lib/tradingview/trading_view.theme.css",
    TEST_SYMBOL = "Bitfinex:BTC/USD",
    PRESET_WIDTH = 1023,
}

export const STATE_INSURANCES: { [key: string]: string; } = {
    CLAIM_WAITING: "Claim-waiting",
    REFUNDED: "Refunded",
    CLAIMED: "Claimed",
    EXPIRED: "Expired",
    LIQUIDATED: "Liquidated",
    AVAILABLE: "Available",
    CANCELLED: "Cancelled",
    INVALID: "Invalid",
    REFUND_WAITING: "Refund-waiting",
    PENDING: "Pending",
};

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    AVAILABLE: 'AVAILABLE',
    EXPIRED: 'EXPIRED',
    REFUNDED: 'REFUNDED',
    REFUND_WAITING: 'REFUND_WAITING',
    CLAIMED: 'CLAIMED',
    CLAIM_WAITING: 'CLAIM_WAITING',
    LIQUIDATED: 'LIQUIDATED',
    INVALID: 'INVALID',
    CANCELLED: 'CANCELLED'
};

export const ORDER_LIST_MODE = {
    OPENING: "opening",
    HISTORY: "history",
};

export const GLOSSARY_MODE = {
    TERMINOLOGY: "terminology",
    STATUS: "status",
};

export const STATUS_DEFINITIONS: Record<string, {
    title: string;
    variant: "primary" | "error" | "warning" | "disabled" | "success";
    description: string;
}> = {
    CLAIM_WAITING: {
        title: "Claim-waiting",
        variant: "warning",
        description: "Terminology.refund_waiting"
    },
    REFUNDED: {
        title: "Refunded",
        variant: "success",
        description: "P-Market is between P-Refund and P-Claim at T-Expire, Margin is refunded"
    },
    CLAIMED: {
        title: "Claimed",
        variant: "success",
        description: "Insurance contract has received Q-Claim at T-Expire"
    },
    LIQUIDATED: {
        title: "Liquidated",
        variant: "error",
        description: "P-Market reaches P-Expire, Insurance contract is terminated immediately"
    },
    AVAILABLE: {
        title: "Available",
        variant: "primary",
        description: "Insurance contract is activated but has not yet reached other milestones"
    },
    CANCELLED: {
        title: "Cancelled",
        variant: "disabled",
        description: "Terminology.cancelled"
    },
    INVALID: {
        title: "Invalid",
        variant: "disabled",
        description: "Users will be unlocked margin when in invalid status, and no commission is charged"
    },
    REFUND_WAITING: {
        title: "Refund-waiting",
        variant: "warning",
        description: "Terminology.refund_waiting"
    },
    EXPIRED: {
        title: "Expired",
        variant: "error",
        description: "At T-Expire, P-Market is not in the cases Claim-waiting, Claimed, Refunded, Liquidated"
    },
    PENDING: {
        title: "Pending",
        variant: "warning",
        description: "Terminology.pending"
    },
};
export const VICTION_SCAN = "";
