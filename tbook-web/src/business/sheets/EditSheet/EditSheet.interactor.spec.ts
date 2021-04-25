
import {Provider} from "../../provider";
import {EditSheetInteractor} from "./EditSheet.interactor";

describe('DisplaySheet', () => {
    let interactor;

    beforeEach(() => {
        interactor = new EditSheetInteractor(Provider.Entities.SheetEntity)
    })

    it('Return object should have components', function () {
        let response = interactor.execute()
        expect(response).toHaveProperty('components')
    });

    it('Return object should have name', function () {
        let response = interactor.execute()
        expect(response).toHaveProperty('name')
    });
})
