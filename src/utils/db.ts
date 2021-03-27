import mongoose from 'mongoose';

mongoose.connect(
  'mongodb+srv://drums:5aSL9do69zHrFC5m@dark-labs.zpzhw.mongodb.net/drums?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
console.log('MONGO [OK]');
export const db = mongoose.connection;
