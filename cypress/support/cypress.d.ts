import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      prepare(email: string, password: string): void;
    }
  }
}
