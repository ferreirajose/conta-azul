import Express from './config/express';

const app = new Express();
const PORT = process.env.PORT || 3000;

app.express().listen(PORT, (err: Error) => {
    if (err) {
        return console.log(err.message);
    }

    return console.log(`server is listening on:  ${PORT}`);
});
