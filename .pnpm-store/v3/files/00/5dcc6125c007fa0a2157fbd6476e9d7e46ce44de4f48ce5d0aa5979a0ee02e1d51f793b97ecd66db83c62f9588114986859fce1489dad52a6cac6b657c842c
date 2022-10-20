import { createTestContainer } from '../../server/test/create-test-container';

describe('getFormDataMethod', () => {
  ['fieldsFirst:true', 'fieldsFirst:false'].forEach(fieldsFirstFlag => {
    describe(fieldsFirstFlag, () => {
      createTestContainer(
        fetchAPI => {
          it('should parse fields correctly', async () => {
            const formData = new fetchAPI.FormData();
            formData.append('greetings', 'Hello world!');
            formData.append('bye', 'Goodbye world!');
            const request = new fetchAPI.Request('http://localhost:8080', {
              method: 'POST',
              body: formData,
            });
            const formdata = await request.formData();
            expect(formdata.get('greetings')).toBe('Hello world!');
            expect(formdata.get('bye')).toBe('Goodbye world!');
          });
          it('should parse and receive text files correctly', async () => {
            const formData = new fetchAPI.FormData();
            const greetingsFile = new fetchAPI.File(['Hello world!'], 'greetings.txt', { type: 'text/plain' });
            const byeFile = new fetchAPI.File(['Goodbye world!'], 'bye.txt', { type: 'text/plain' });
            formData.append('greetings', greetingsFile);
            formData.append('bye', byeFile);
            const request = new fetchAPI.Request('http://localhost:8080', {
              method: 'POST',
              body: formData,
            });
            const formdata = await request.formData();
            const receivedGreetingsFile = formdata.get('greetings') as File;
            const receivedGreetingsText = await receivedGreetingsFile.text();
            expect(receivedGreetingsText).toBe('Hello world!');
            const receivedByeFile = formdata.get('bye') as File;
            const receivedByeText = await receivedByeFile.text();
            expect(receivedByeText).toBe('Goodbye world!');
          });
        },
        {
          formDataLimits: {
            fieldsFirst: fieldsFirstFlag === 'fieldsFirst:true',
          },
        }
      );
    });
  });
});
