const { App } = require('./app');

const PORT = process.env.PORT || 5000;
const host = new App();
host.app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
