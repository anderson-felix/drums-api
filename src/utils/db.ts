import mongoose from 'mongoose';

mongoose.connect(
  'mongodb+srv://drums-web:pICcNtRfImKx8cGr@dark-labs.zpzhw.mongodb.net/drums-web?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
console.log('MONGO [OK]');
export const db = mongoose.connection;
