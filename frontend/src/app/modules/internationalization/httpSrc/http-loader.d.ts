import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "../internationalization.module";
export declare class TranslateHttpLoader implements TranslateLoader {
    private http;
    prefix: string;
    suffix: string;
    constructor(http: HttpClient, prefix?: string, suffix?: string);
    /**
     * Gets the translations from the server
     * @param lang
     * @returns {any}
     */
    getTranslation(lang: string): any;
}
