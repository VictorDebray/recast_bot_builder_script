export class Expression {
    source: string;
    language: {
        isocode: string
    };
    constructor() {
        this.source = "";
        this.language = {
            isocode: ""
        }
    }
}