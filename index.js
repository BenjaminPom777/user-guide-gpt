const express = require('express');
const { flow } = require('./gpt');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Define a simple route to render the index page
app.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Simple Express Page',
    input1Label: 'Input 1',
  });
});

// Define a route to handle form submission
app.post('/buying-guide', async (req, res) => {
  try {
    const inputValue = req.body.input1;
    // Do something with the input value, e.g., save it to a database
    const answer = await flow(inputValue);
    res.render('result', {
      inputValue: answer.stringAnswer,
      urls: answer.links,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
