describe('containers', () => {
  const num = (~~(Math.random() * 1000000)).toString();

  beforeEach(() => {
    cy.login();
    cy.menuGo('Containers > Containers');
  });

  it('checks the EE list view', () => {
    cy.contains('a', `remotepine${num}`);
    cy.contains('button', 'Add container');
    cy.contains('button', 'Push container images');
    cy.contains('table th', 'Container repository name');
    cy.contains('table th', 'Description');
    cy.contains('table th', 'Created');
    cy.contains('table th', 'Last modified');
    cy.contains('table th', 'Container registry type');
  });

  it('checks the EE detail view', () => {
    cy.contains('a', `remotepine${num}`).click();
    cy.get('[data-cy="title-box"]').should('have.text', `remotepine${num}`);
    cy.get('.pf-v6-c-clipboard-copy__text').should(
      'have.text',
      `podman pull --tls-verify=false localhost:8002/remotepine${num}`,
    );
  });

  it('adds a Readme', () => {
    cy.contains('a', `remotepine${num}`).click();
    cy.get('[data-cy=add-readme]').click();
    cy.get('textarea').type('{del}This is the readme file.');
    cy.get('[data-cy=save-readme]').click();
    cy.get('.markdown-editor').should(
      'have.text',
      'Raw MarkdownThis is the readme file.PreviewThis is the readme file.',
    );
  });
});
