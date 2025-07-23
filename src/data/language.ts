export class Language {
    private readonly _code: string;
    private readonly _display: string;

    private constructor(
        code: string,
        display: string
    ) {
        this._code = code;
        this._display = display;
    }

    static create(code: string, display: string): Language {
        return new Language(code, display);
    }

    get code(): string {
        return this._code;
    }

    get display(): string {
        return this._display;
    }


    static getAll(): Language[] {
        return [
            Language.create("universal", "🌍 Universal"),
            Language.create("en", "🇺🇸 English"),
            Language.create("es", "🇪🇸 Spanish"),
            Language.create("fr", "🇫🇷 French"),
            Language.create("de", "🇩🇪 German"),
            Language.create("it", "🇮🇹 Italian"),
            Language.create("pt", "🇵🇹 Portuguese")
        ];
    }

    static fromCode(code: string): Language | undefined {
        return Language.getAll().find(lang => lang.code === code);
    }

    static getDisplay(code: string): string {
        const language = Language.fromCode(code);
        return language ? language.display : code;
    }

    static isValid(code: string): boolean {
        return Language.fromCode(code) !== undefined;
    }

    static universal(): Language {
        return Language.create("universal", "🌍 Universal");
    }

    static english(): Language {
        return Language.create("en", "🇺🇸 English");
    }

    static spanish(): Language {
        return Language.create("es", "🇪🇸 Spanish");
    }
}
