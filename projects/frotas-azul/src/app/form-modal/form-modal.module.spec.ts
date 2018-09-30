import { FormModalModule } from './form-modal.module';

describe('FormModalModule', () => {
  let formModalModule: FormModalModule;

  beforeEach(() => {
    formModalModule = new FormModalModule();
  });

  it('should create an instance', () => {
    expect(formModalModule).toBeTruthy();
  });
});
