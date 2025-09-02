const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

let paymentNotifications = [];

const dataFile = path.join(__dirname, 'payment-notifications.json');
if (fs.existsSync(dataFile)) {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    paymentNotifications = JSON.parse(data);
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
}

const saveData = () => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(paymentNotifications, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

app.post('/api/payment-notifications', (req, res) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    const expectedKey = 'Bearer admin-webhook-key-123';
    
    if (!authHeader || authHeader !== expectedKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid API key'
      });
    }
    
    const notification = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    paymentNotifications.unshift(notification);
    saveData();
    
    console.log('Received payment notification:', notification);
    
    res.json({
      success: true,
      message: 'Payment notification received successfully',
      id: notification._id
    });
  } catch (error) {
    console.error('Error processing payment notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment notification'
    });
  }
});

app.get('/api/payment-notifications', (req, res) => {
  try {
    res.json({
      data: paymentNotifications
    });
  } catch (error) {
    console.error('Error fetching payment notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment notifications'
    });
  }
});

app.get('/api/payment-notifications/:id', (req, res) => {
  try {
    const notification = paymentNotifications.find(n => n._id === req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Payment notification not found'
      });
    }
    
    res.json({
      data: notification
    });
  } catch (error) {
    console.error('Error fetching payment notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment notification'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Payment notifications endpoint: http://localhost:${PORT}/api/payment-notifications`);
});