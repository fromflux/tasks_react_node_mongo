import app from './app';
import { client } from './db'

const port = 3000;

process.on('uncaughtException', (err) => {
  // Log the exception and exit
  console.log('uncaughtException', err.message);
  process.exit(1);
});

process.on('exit', () => {
  //close database connection
  client.close();
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});