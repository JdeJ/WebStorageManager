export class WindowStorage implements Storage {
    [name: string]: any;

    get length(): number {
        return Object.keys(this).length;
    }

    clear(): void {
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                this.removeItem(this[key]);
            }
        }
    }

    getItem(key: string): string | null {
        return this[key] ?? null;
    }

    key(index: number): string | null {
        return Object.keys(this)[index] ?? null;
    }

    removeItem(key: string): void {
        delete this[key];
    }

    setItem(key: string, value: string): void {
        this[key] = value;
    }
}