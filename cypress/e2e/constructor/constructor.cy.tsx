import type {} from 'cypress';
import type {} from '../../support/cypress';

describe('Проверка функциональности страницы конструктора бургера', () => {
  beforeEach(() => {
    // Перехват запросов
    cy.intercept('GET', 'ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'user', { fixture: 'user.json' });
    cy.intercept('POST', 'orders', { fixture: 'order.json' }).as('postOrder');

    // Подстановка фейковых токенов
    window.localStorage.setItem(
      'refreshToken',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTc3OTZmMTMzYWNkMDAxYmU0ZjY2NCIsImlhdCI6MTczOTUxODMxNiwiZXhwIjoxNzM5NTE5NTE2fQ.J6lLkNYxVi2efO8S5SXg4_D-3kODoaVy0HfCYf6K3bg'
    );
    cy.setCookie(
      'accessToken',
      'e96fca304050edd162cce7e52eda887a38efd8b6c16a17011a6c422739b9c5e53f356c6b81faea84'
    );

    // Переход на страницу конструктора
    cy.visit('http://localhost:4000/');
  });

  afterEach(() => {
    // Очистка токенов после теста
    window.localStorage.removeItem('refreshToken');
    cy.clearCookie('accessToken');
  });

  it(' проверка добавления ингредиентов в конструтор', () => {
    //добавляем булку
    cy.get('[data-cy=link643d69a5c3f7b9001cfa093c]').next().click();
    cy.get('[data-cy="topBun"]').should('exist');
    cy.get('[data-cy="bottomBun"]').should('exist');
    //добавляем начинку
    cy.get('[data-cy="link643d69a5c3f7b9001cfa093e"]').next().click();
    cy.get('[data-cy="li643d69a5c3f7b9001cfa093e"]').should('exist');
  });

  it('проверка открытия и закрытия модального окна с описанием ингредиента', () => {
    //открытие окна
    cy.get('[data-cy=link643d69a5c3f7b9001cfa093c]').click();
    cy.get('[data-cy="modal-close-button"]').should('be.visible');

    //отображение данных ингредиента
    cy.get('[data-cy="ingredient-name"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy="ingredient-calories"]').should('contain', '420');
    cy.get('[data-cy="ingredient-proteins"]').should('contain', '80');
    cy.get('[data-cy="ingredient-fat"]').should('contain', '24');
    cy.get('[data-cy="ingredient-carbohydrates"]').should('contain', '53');

    //закрытие окна
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal-close-button"]').should('not.exist');

    //закрытия по оверлею
    cy.get('[data-cy=link643d69a5c3f7b9001cfa093c]').click();
    cy.get('[data-cy="modal-close-button"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal-close-button"]').should('not.exist');
  });

  it('проверка создания заказа', () => {
    //добавляем булку
    cy.get('[data-cy=link643d69a5c3f7b9001cfa093c]').next().click();
    cy.get('[data-cy="topBun"]').should('exist');
    cy.get('[data-cy="bottomBun"]').should('exist');
    //добовляем начинку
    cy.get('[data-cy="link643d69a5c3f7b9001cfa093e"]').next().click();
    cy.get('[data-cy="li643d69a5c3f7b9001cfa093e"]').should('exist');
    //оформление заказа
    cy.get('[data-cy="order-button"]').click();
    cy.wait('@postOrder');
    //открытие модального окна с номером заказа
    cy.get('[data-cy="modal-close-button"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '68401');
    //закрытие  модального окна
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal-close-button"]').should('not.exist');
    //очистка конструктора
    cy.get('[data-cy="topBun"]').should('not.exist');
    cy.get('[data-cy="bottomBun"]').should('not.exist');
    cy.get('[data-cy="li643d69a5c3f7b9001cfa093e"]').should('not.exist');
  });
});
