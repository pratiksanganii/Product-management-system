import swaggerDoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PMS express API with Swagger',
      version: '1.0.0',
      description:
        'This is a PMS demo application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Pratik Sangani',
        email: 'pratikpsangani2003@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['src/routes/*.ts'],
};

// add swagger
const spec = swaggerDoc(options);
export default spec;
