const production = 'https://gentle-waters-83618.herokuapp.com/';
const development = 'http://localhost:3000/';

export const url = process.env.NODE_ENV ? production : development;