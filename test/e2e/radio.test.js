import chromedriver from 'chromedriver';
import { Builder, until, By } from 'selenium-webdriver';
import server from '../../app';

describe('e2e tests for animal type selector as radio', () => {

  /*
   * Här börjar kod som ger möjlighet att fjärrstyra en webbläsare (Chrome i det här fallet)
   */
  let listeningServer;
  let driver;

  const PORT = 8081;
  const baseUrl = `localhost:${PORT}`;
  const timeout = 1000;

  beforeAll((done) => {
    listeningServer = server.listen(PORT);
    // driver är komponenten som fjärrstyr Chrome åt oss
    driver = new Builder().forBrowser('chrome').build();
    // Surfa in på sidan som vi vill testa
    driver.get(baseUrl)
        .then(done); // Tala om för jest att vi är redo att börja köra tester
  });

  /*
   * Den här koden städar upp efter att vi är färdiga (stänger ner vår lokala server
   * och stänger ner vår fjärrstyrda webbläsare)
   */
  afterAll((done) => {
    listeningServer.close();
    driver.quit()
        .then(done);
  });

  /*
   * Testerna!!!
   */

  test('clicking on dog and see if select is populated', (done) => {
    // Hitta elementet med värdet "dog"
    driver.wait(until.elementLocated(By.value('dog')), timeout)
    // Klicka på dog-elementet
        .then((dogElement) => {
          return dogElement.click();
        })
    // Hitta elementet med id "animal-select"
        .then(() => {
          return driver.wait(until.elementLocated(By.id('animal-select')), timeout);
        })
    // Vänta på att animal-select töms
        .then((animalSelect) => {
          return driver.wait(animalSelect.getAttribute('data-loaded'), timeout)
              .then((loaded) => {
                if (loaded === 'false') {
                  return animalSelect;
                }
                return false;
              });
        })
    // Vänta på att animal-select laddas
        .then((animalSelect) => {
          return driver.wait(animalSelect.getAttribute('data-loaded'), timeout)
            .then((loaded) => {
              if (loaded === 'true') {
                return animalSelect;
              }
              return false;
            });
        })
    // Hitta första option-elementet i animal-select
        .then((animalSelect) => {
          return animalSelect.findElements(By.tagName('option'));
        })
    // Verifiera att texten är "Please select dog"
        .then((options) => {
          return options[0].getText();
        })
        .then((optionText) => {
          expect(optionText).toBe('Please select dog');
          done();
        });
  });
});











