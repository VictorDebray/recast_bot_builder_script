import { Expression } from './Expression';


export class Intent {
    name: string;
    description: string;
    expressions: Expression[] = [];

    constructor(name: string = "", description: string) {
        this.name = name;
        this.description = description;
    }
}