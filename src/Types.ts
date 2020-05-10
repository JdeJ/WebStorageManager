export type Storage = 'sessionStorage' | 'localStorage';

export interface WebStorage {
    length: number;
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    clear(): void;
    key(index: number): string | null;
}
