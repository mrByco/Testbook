interface TextSheetComponent {
    type: 'text';
    id: string;
    text: string;
}

interface InlineOneWordFieldSheetComponent {
    type: 'inline-one-word';
    id: string;
    hint?: string;
    correctAnswers: string[];
}
type SheetComponent = TextSheetComponent | InlineOneWordFieldSheetComponent

export interface Sheet {
    name: string;
    components: SheetComponent[]
}



