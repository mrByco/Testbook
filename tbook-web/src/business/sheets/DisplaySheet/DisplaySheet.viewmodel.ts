export interface SheetViewText {
    type: 'text',
    text: string
}

export interface SheetViewField {
    id: string,
    type: 'field',
    content: string,
    hint: string,
    state: 'not-processed' | 'pass' | 'fail'
}

export type SheetViewComponent = SheetViewText | SheetViewField;

export interface DisplaySheetViewmodel {
    title: string;
    components: SheetViewComponent[]
}
