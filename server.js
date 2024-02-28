// File: server.js

const express = require('express');
const bodyParser = require('body-parser');
const gpio = require('onoff').Gpio; // For controlling GPIO pins
const app = express();
const port = process.env.PORT || 3000;

// Initialize GPIO pins (adjust pin numbers as needed)
const lightSwitch = new gpio(17, 'out');
const doorSensor = new gpio(18, 'in', 'both');

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Building Switch Control Platform!');
});

// Handle sensor events
doorSensor.watch((err, value) => {
  if (err) throw err;
  if (value === 1) {
    console.log('Door opened!');
    // Send notification (e.g., SMS, email)
  }
});

// Handle user commands
app.post('/switch', (req, res) => {
  const { switchId, action } = req.body;
  if (switchId === 'light') {
    if (action === 'on') {
      lightSwitch.writeSync(1); // Turn light on
    } else if (action === 'off') {
      lightSwitch.writeSync(0); // Turn light off
    }
    res.status(200).json({ message: `Light switch ${action}` });
  } else {
    res.status(400).json({ error: 'Invalid switch ID' });
  }
});

// Listen for voice commands (using a voice recognition library)
// Implement SMS handling (using Twilio or similar service)

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
