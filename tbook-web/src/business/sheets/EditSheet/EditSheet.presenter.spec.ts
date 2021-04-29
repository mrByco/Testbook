import {ServerProvider} from "../../server-provider";
import {MockServerGateway} from "../../../test/mock-server-gateway";
import {getExampleSheetResponse} from "../../../test/ExampleSheets";
import {EditSheetViewComponent, EditSheetViewmodel} from "./EditSheet.viewmodel";
import {EditSheetPresenter} from "./EditSheet.presenter";
import {EditSheetResponse} from "./EditSheet.response";

describe('EditSheet presenter', () => {

    describe("With realistic example response", () => {
        let presenter: EditSheetPresenter;
        let result: EditSheetViewmodel
        beforeAll(async () => {
            ServerProvider.ServerGateway = new MockServerGateway(() => getExampleSheetResponse())
            presenter = new EditSheetPresenter();
            presenter.setCallback((vm) => {
                result = vm;
            });
            await presenter.Load();
        })

        it('should return value', function () {
            expect(result).toBeTruthy()
        });
    })
    describe("Convert", () => {
        async function getPresentedView(response: EditSheetResponse) {
            let presenter: EditSheetPresenter;
            ServerProvider.ServerGateway = new MockServerGateway(() => response)
            presenter = new EditSheetPresenter();
            presenter.Load();
            return new Promise<EditSheetViewmodel>(r => {
                presenter.setCallback((vm) => {
                    r(vm);
                });
            });
        }

        it('should pass text', async function () {
            let result = await getPresentedView({
                components: [
                    {type: "text", id: '1', text: 'Text of the sheet'},
                ], name: "Title"
            })
            let expected: EditSheetViewmodel = {
                selection: undefined,
                title: 'Title',
                components: [
                    {type: "text", id: '1', text: 'Text of the sheet'}
                ]
            }
            expect(result).toEqual(expected)
        });

        describe('Data clean up', () => {
            it('the first and last component should be text', async function () {
                let result = await getPresentedView({
                    name: "",
                    components: [
                        {type: "inline-one-word", id: "id1", correctAnswers: [], hint: "", content: ""}
                    ]
                })
                expect(result.components[0].type).toBe("text");
                expect(result.components[result.components.length - 1].type).toBe("text")
            });

            it('There should be text component between the two object', async () => {
                let result = await getPresentedView({
                    name: "",
                    components: [
                        {type: "inline-one-word", id: "id1", correctAnswers: [], hint: "", content: ""},
                        {type: "inline-one-word", id: "id2", correctAnswers: [], hint: "", content: ""}
                    ]
                });
                expect(result.components[2].type).toBe("text");
            });
        })

        it('should online-one-word should be red', async function () {
            const result = await getPresentedView({
                components: [
                    {type: "inline-one-word", id: '1', hint: 'hint', correctAnswers: []}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components.find(x => x.id == '1');
            expect(checkComponent['renderColor']).toEqual('#992211')
        });

        it('should show error message when there is no correct answer', async function () {
            const result = await getPresentedView({
                components: [
                    {type: "inline-one-word", id: '1', hint: 'hint', correctAnswers: []}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components.find(x => x.id == '1');
            expect(checkComponent['displayText']).toEqual('[NO ANSWER SET] (hint)')
        });

        it('should show error message when there is no correct answer', async function () {
            const result = await getPresentedView({
                components: [
                    {type: "text", text: 'text', id: '1'},
                    {type: "inline-one-word", id: '2', hint: 'hint', correctAnswers: ['answer1', 'answer2']}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components.find(x => x.id == '2');
            expect(checkComponent['displayText']).toEqual('answer1 (hint)')
        });


        it('should pass all the correct answers', async function () {
            const result = await getPresentedView({
                components: [
                    {type: "text", text: 'text', id: '1'},
                    {type: "inline-one-word", id: '2', hint: 'hint', correctAnswers: ['answer1', 'answer2']}
                ], name: "Title"
            });
            const checkComponent: EditSheetViewComponent = result.components[1];
            expect(checkComponent['answers'].length).toBe(2)
        });
    });
    describe('Text editor', () => {
        let textPresenter: EditSheetPresenter;
        let lastViewmodel: EditSheetViewmodel;

        beforeEach(async () => {
            ServerProvider.ServerGateway = new MockServerGateway(() => getSomeEditSheetResponse())
            textPresenter = new EditSheetPresenter();
            textPresenter.Load();
            await new Promise<void>(r => {
                textPresenter.setCallback((vm) => {
                    lastViewmodel = vm;
                    r();
                });
            });
            return;
        });

        afterEach(() => {
            lastViewmodel = undefined;
            textPresenter = undefined;
        })

        it('should set selection', function () {
            textPresenter.SetSelection({startChar: 1, endChar: 2, startComponentId: '1', endComponentId: '1'})
            expect(lastViewmodel.selection).toEqual({
                startChar: 1,
                endChar: 2,
                startComponentId: '1',
                endComponentId: '1'
            })
        });

        test('should limit selection in valid area', function () {
            textPresenter.SetSelection({startChar: 900, endChar: 1000, startComponentId: '1', endComponentId: '1'});
            expect(lastViewmodel.selection.startChar).toBe(getSomeEditSheetResponse().components[0]['text'].length - 1)
            expect(lastViewmodel.selection.endChar).toBe(getSomeEditSheetResponse().components[0]['text'].length - 1)
        });

        test('should type single letters', function () {
            textPresenter.SetSelection({startChar: 2, endChar: 2, startComponentId: '1', endComponentId: '1'});
            textPresenter.Type("g");
            expect(lastViewmodel.components[0]['text']).toBe('sogmeText')
        });

        test('should type to multy character selections', function () {
            textPresenter.SetSelection({startChar: 2, endChar: 4, startComponentId: '1', endComponentId: '1'});
            textPresenter.Type("g");
            expect(lastViewmodel.components[0]['text']).toBe('sogText')
        });

        test('should type to cross component selection', () => {
            textPresenter.SetSelection({startChar: 2, endChar: 4, startComponentId: '1', endComponentId: '3'});
            textPresenter.Type(' hello');
            expect(lastViewmodel.components[0]['text']).toBe('so hellole text')
        });
    });
});

const getSomeEditSheetResponse: () => EditSheetResponse = () => {
    return JSON.parse(JSON.stringify({
        components: [
            {type: "text", id: '1', text: 'someText'},
            {
                type: 'inline-one-word',
                id: '2',
                hint: 'someTextHint',
                content: undefined,
                correctAnswers: ['answer1', 'answer2']
            },
            {
                type: 'text',
                id: '3',
                text: 'sample text'
            },
            {
                type: 'inline-one-word',
                id: '4',
                hint: 'someTextHint2',
                content: undefined,
                correctAnswers: ['answer1', 'answer2']
            },
        ],
        name: "someName"
    })) as EditSheetResponse;
}
