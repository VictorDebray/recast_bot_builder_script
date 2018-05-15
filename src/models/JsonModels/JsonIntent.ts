export interface JsonIntent {
    name: string,
    description: string,
    expressions: [
        {
            language: string,
            file: string
        }
        ]
}