import {DisplaySheetPresenter} from "./DisplaySheet.presenter";
import {ServerProvider} from "../../server-provider";
import {DisplaySheetViewmodel} from "./DisplaySheet.viewmodel";
import {getExampleSheetResponse} from "../../../test/ExampleSheets";
import {MockServerGateway} from "../../../test/mock-server-gateway";

describe('DisplaySheet Presenter', () => {
    let presenter: DisplaySheetPresenter;
    let result: DisplaySheetViewmodel
    beforeAll(async () => {
        ServerProvider.ServerGateway = new MockServerGateway(() => getExampleSheetResponse())
        presenter = new DisplaySheetPresenter();
        presenter.setCallback((vm) => {
            result = vm;
        });
        await presenter.Load();
    })

    it('should return value', function () {
        expect(result).toBeTruthy()
    });

    describe("Text component presentation", () => {

        it('should match the number of text components in input and output', function () {
            expect(result.components.filter(r => r.type == 'text').length)
                .toBe(getExampleSheetResponse().components.filter(r => r.type == 'text').length)
        });

        it('should match the appended content of text components', function () {
            const appendedResult = result.components.filter(r => r.type == 'text')
                .reduce((value, current, i) => value + current['text'], '')
            const appendedExample = getExampleSheetResponse().components.filter(r => r.type == 'text')
                .reduce((value, current, i) => value + current['text'], '')
            expect(appendedResult).toBe(appendedExample)
        });
    })

    describe("Field component presentation", () => {

        it('should match the count of fields', function () {
            expect(result.components.filter(r => r.type == 'field').length)
                .toBe(getExampleSheetResponse().components.filter(r => r.type == 'inline-one-word').length)
        });

        it('should not pass undefined as hint', function () {
            const appendedResult = result.components.filter(r => r.type == 'field')
                .reduce((value, current, i) => value + current['hint'], '')
            expect(appendedResult).not.toContain('undefined')
        });

        it('should pass hint', function () {
            expect(result.components[2]['hint']).toBe('hint text')
        });

        it('should fill "" when content is null', function () {
            expect(result.components[2]['content']).toBe('')
        });
    })

    it('should pass the name as title', function () {
        expect(result.title).toBe(getExampleSheetResponse().name)
    });


})
