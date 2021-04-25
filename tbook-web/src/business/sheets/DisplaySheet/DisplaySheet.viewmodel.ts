interface SheetViewText {
    type: 'text',
    id: string,
    text: string
}

interface SheetViewField {
    type: 'field',
    id: string,
    content: string,
    hint: string,
    state: 'not-processed' | 'pass' | 'fail'
}

export type DisplaySheetViewComponent = SheetViewText | SheetViewField;

export interface DisplaySheetViewmodel {
    title: string;
    components: DisplaySheetViewComponent[]
}
