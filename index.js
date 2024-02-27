const express = require('express');
const ExcelJS = require('exceljs');
const fs = require('fs');

const { flow } = require('./gpt');
const { scrapeAutocomplete } = require('./start');

const app = express();
const port = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Body parser middleware to parse form data
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

app.post('/scrape-amazon-ac', async (req, res) => {
  try {
    const inputValue = req.body.input2;
    const autocompleteList = await scrapeAutocomplete(inputValue);

     // Create Excel workbook and worksheet
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet('Autocomplete Data');
 
   // Set up columns
   worksheet.columns = [
    { header: 'Autocomplete Suggestions', key: 'suggestion' }
  ];

     // Add data to worksheet
     autocompleteList.forEach(suggestion => {
       worksheet.addRow({ suggestion });
     });
     
     const fileName = `autocomplete_data.xlsx`;
      
     await workbook.xlsx.writeFile(fileName);
 
     res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

     const fileStream = fs.createReadStream(fileName);
     fileStream.pipe(res);
    res.send('your download started')
 
  } catch (error) {
    console.error(error);
    if(error.name == 'TimeoutError'){}
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
