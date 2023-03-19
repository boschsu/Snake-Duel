export type RecordItem = {
    id: number;
    rank: number;
    score: string;
    player_name: string;
    created_by: string;
};

export type State = {
    loading: boolean;
    dashboard: RecordItem[];
};

export const state: State = {
    loading: false,
    dashboard: [],
    default_dashboard: [{
        "id": 1,
        "rank": 1,
        "score": "13200",
        "player_name": "bosch"
    }, ]
};