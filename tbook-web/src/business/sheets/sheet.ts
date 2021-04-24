export interface TextSheetComponent {
    type: 'text';
    id: string;
    text: string;
}

export interface InlineOneWordFieldSheetComponent {
    type: 'inline-one-word';
    id: string;
    content?: string;
    hint?: string;
    correctAnswers: string[];
}
export type SheetComponent = TextSheetComponent | InlineOneWordFieldSheetComponent

export interface Sheet {
    name: string;
    components: SheetComponent[]
}



