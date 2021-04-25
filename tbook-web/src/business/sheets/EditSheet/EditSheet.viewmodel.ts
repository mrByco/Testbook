interface SheetViewText {
    type: 'text',
    id: string,
    text: string
}

interface SheetViewObject {
    type: 'object',
    objectType: 'field',
    id: string,
    displayText: string,
    displayName: string,
    renderColor: string,
    helperText: string,
    answers: string[],
}

export type EditSheetViewComponent = SheetViewText | SheetViewObject;

export interface EditSheetViewmodel {
    title: string;
    components: EditSheetViewComponent[]
}
