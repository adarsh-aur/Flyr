const express = require('express');
const bodyParser = require('body-parser');
const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize PredictionServiceClient
const client = new PredictionServiceClient({
  keyFilename: './filename.json', // Ensure the path is correct
});


// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route to handle form submission
app.post('/generate', async (req, res) => {
    console.log('Recieved request: ', req.body);
    res.send('Form submitted successfully')
    const inputData = {
        productImages: req.body.images, // Adjust based on your form input
        promoText: req.body.message,
        colorPalette: req.body.colorPalette,
        theme: req.body.theme,
        outputSpecs: {
            aspectRatio: req.body.aspectRatio,
            resolution: req.body.resolution,
            format: req.body.format,
        }
    };

    const request = {
        endpoint: client.endpointPath('service-account-name', 'europe-west4', 'service-account-id'),
        instances: [
            {
                "Product images": inputData.productImages,
                "Promotional offer": inputData.promoText,
                "Color palette": inputData.colorPalette,
                "Theme": inputData.theme,
                "Output specifications": inputData.outputSpecs
            }
        ],
        parameters: {}, // Add any parameters if required
    };

    try {
        const [response] = await client.predict(request);
        console.log('Prediction Results:', response);
        
        // Display output to the user
        res.send(`
            <h1>Generated Output:</h1>
            <p>Banner Design:</p>
            <pre>${JSON.stringify(response, null, 2)}</pre>
            <a href="/">Back to Home</a>
        `);
    } catch (error) {
        console.error('Error in prediction:', error);
        res.send('Error occurred while generating banner. Please try again.');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
