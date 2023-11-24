async function initialize() {
  try {
    const express = require('express');
    require('dotenv').config({ path: 'config/.env' });
    const app = express();
    const PORT = process.env.PORT;
    app.listen(PORT);
  } catch (e) {
    console.log({ e });
  }
}

// start application
initialize();
