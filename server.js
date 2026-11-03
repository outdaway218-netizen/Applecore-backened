const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let businessRegistry = {
  "8785550123": { companyName: "Bright Smiles Dental", niche: "Dental" }
};

app.post('/api/agency/register-free-link', (req, res) => {
  const { companyName, niche, businessPhoneNumber } = req.body;
  if (!companyName || !businessPhoneNumber) {
    return res.status(400).json({ success: false, error: 'Incomplete client parameters' });
  }
  const cleanNumber = businessPhoneNumber.replace(/\D/g, '');
  businessRegistry[cleanNumber] = { companyName, niche, activatedAt: new Date().toISOString() };
  res.json({ success: true, message: `Successfully linked ${companyName}!`, instructions: `*61*8782779051*15#` });
});

app.get('/api/agency/lookup/:phoneNumber', (req, res) => {
  const incomingNumber = req.params.phoneNumber.replace(/\D/g, '');
  const businessMatch = businessRegistry[incomingNumber];
  if (!businessMatch) {
    return res.json({
      companyName: "ApplecoreEnt Partner",
      niche: "Customer Care",
      promptGreeting: "Thank you for calling customer support. How can we help you book your appointment?"
    });
  }
  res.json({
    companyName: businessMatch.companyName,
    niche: businessMatch.niche,
    promptGreeting: `Thank you for calling ${businessMatch.companyName}. How can we assist you with our ${businessMatch.niche} services today?`
  });
});

app.get('/api/agency/list', (req, res) => {
  res.json(Object.entries(businessRegistry).map(([phone, data]) => ({ phone, ...data, active: true, id: phone })));
});

app.listen(PORT, () => console.log(`Free Answering Engine Online on Port ${PORT}`));
