interface Text {
    type: 'text',
    text: string
}

interface Field {
    id: string,
    type: 'field',
    content: string,
    state: 'not-processed' | 'pass' | 'fail'
}

export interface DisplaySheetViewmodel {
    title: string;
    components: (Field | Text)[]
}
