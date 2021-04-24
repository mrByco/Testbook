import {DisplaySheetResponse} from "../business/sheets/DisplaySheet/DisplaySheet.response";

export function getExampleSheetResponse(): DisplaySheetResponse {
    return JSON.parse(JSON.stringify({
        components: [
            {type: 'text', id: '1', text: 'Text 1'},
            {type: 'text', id: '2', text: 'Text 1'},
            {type: "inline-one-word", id: '3', hint: 'hint text', correctAnswers: []},
            {type: "inline-one-word", id: '4', content: 'content text', correctAnswers: []},
            {type: 'text', id: '5', text: 'Text 1'},
            {type: "inline-one-word", id: '5', correctAnswers: []},
            {
                type: "inline-one-word",
                id: '6',
                content: 'content text',
                hint: 'hint text',
                correctAnswers: []
            },
        ], name: "Test sheet"
    }))
}

export function getRealisticExampleSheet(): DisplaySheetResponse {
    return JSON.parse(JSON.stringify({
        components: [
            {type: 'text', id: '1', text: 'In the past, tattoos were'},
            {type: "inline-one-word", id: '2', hint: 'main', correctAnswers: []},
            {type: 'text', id: '3', text: 'a badge of belonging to a group and it was'},
            {type: "inline-one-word", id: '4', hint: 'general', correctAnswers: []},
            {type: 'text', id: '5', text: 'tribes, military personnel and lorry'},
            {type: "inline-one-word", id: '6', hint: 'drive', correctAnswers: []},
            {type: 'text', id: '7', text: 'who used them. But they are now used to express individuality and can range from the small dolphin on the ankle to huge drawings of a fan\'s'},
            {type: "inline-one-word", id: '8', hint: 'favour', correctAnswers: []},
            {type: 'text', id: '9', text: 'pop group, or even designs covering most of the body.\n On 7 October, the Dana Centre at London\'s Science Museum is putting tattoo culture under\n' +
                    'the microscope. Katie Maggs, associate curator at the Science Museum, said there would be a'},
            {type: "inline-one-word", id: '10', hint: 'collect', correctAnswers: []},
            {type: 'text', id: '11', text: 'of late 19th century tattoos on display, together with the'},
            {type: "inline-one-word", id: '12', hint: 'equip', correctAnswers: []},
            {type: 'text', id: '13', text: 'used to make them. “We are displaying a'},
            {type: "inline-one-word", id: '14', hint: 'surprise', correctAnswers: []},
            {type: 'text', id: '15', text: 'variety of images. There are lots of beautifully designed women, military ranks, and there is also a pig on a bike,” she said.\n The event will look at how tattoo use has changed and examine whether'},
            {type: "inline-one-word", id: '16', hint: 'improve', correctAnswers: []},
            {type: 'text', id: '17', text: 'technology may mean that tattoos do not need to be a permanent'},
            {type: "inline-one-word", id: '18', hint: 'decorate', correctAnswers: []},
            {type: 'text', id: '19', text: 'Dr Raj Mallipeddi, a well-known dermatological surgeon in London, said while he would not advise against tattoos, he would always recommend'},
            {type: "inline-one-word", id: '20', hint: 'care', correctAnswers: []},
            {type: 'text', id: '21', text: '“There are different types of potential problems following tattooing; for example, allergic'},
            {type: "inline-one-word", id: '22', hint: 'react', correctAnswers: []},
            {type: 'text', id: '23', text: 'to the ink, which may lead to a form of eczema or red spots on the skin.” '},
        ], name: "Mature exam 2010 Part 2 Task 2"
    }))
}
